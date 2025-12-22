import React, { useEffect, useState } from 'react';
import AddProduct from './addproduct'; // ✅ filename must match exactly
import './Product.css';
import { CiCirclePlus } from "react-icons/ci";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

  // 🔥 Fetch products from backend
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  // ✅ Add product after AddProduct success
  const addProduct = (newProduct) => {
    setProducts(prev => [newProduct, ...prev]);
  };

  // ✅ Update quantity locally (UI only)
  const updateQuantity = (id, change) => {
    setProducts(products.map(product => {
      if (product._id === id) {
        const newQuantity = Math.max(0, product.quantity + change);
        return {
          ...product,
          quantity: newQuantity
        };
      }
      return product;
    }));
  };

  // ✅ Delete product
  const deleteProduct = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE"
      });
      setProducts(products.filter(p => p._id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <div className="products-content-wrapper">
      <div className="products-section-header">
        <h1 className="products-section-title">Products</h1>

        <button className="btn btn-add" onClick={() => setShowAddForm(true)}>
          <CiCirclePlus style={{ color: 'white', fontSize: '22px' }} />
          Add Product
        </button>
      </div>

      {showAddForm && (
        <AddProduct
          onAddProduct={addProduct}
          onClose={() => setShowAddForm(false)}
        />
      )}

      <div className="products-grid">
        {products.map(product => (
          <div key={product._id} className="product-card">
            <div className="product-image">
              <img
                src={
                  product.image?.startsWith("data:image")
                    ? product.image
                    : `data:image/jpeg;base64,${product.image}`
                }
                alt={product.name}
              />
            </div>

            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <div className="product-price">₹{product.price}</div>

              <div className="products-qty-container">
                <span>Quantity: {product.quantity}</span>
                <div className="products-quantity-buttons">
                  <button
                    className="products-qty-btn"
                    onClick={() => updateQuantity(product._id, -1)}
                  >
                    -
                  </button>
                  <button
                    className="products-qty-btn"
                    onClick={() => updateQuantity(product._id, 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className={`products-status ${product.quantity === 0 ? 'sold-out' : 'available'}`}>
                {product.quantity === 0 ? '❌ Sold Out' : '✅ Available'}
              </div>

              <div className="products-action-buttons">
                <button
                  className="btn btn-delete"
                  onClick={() => deleteProduct(product._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {products.length === 0 && (
          <p style={{ textAlign: "center", width: "100%" }}>
            No products available
          </p>
        )}
      </div>
    </div>
  );
};

export default Products;
