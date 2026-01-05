import React, { useState } from "react";

const AddProduct = ({ onAddProduct, onClose }) => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    quantity: "",
    category: "",
    image: ""
  });

  const [loading, setLoading] = useState(false);

  // Handle text & select inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setNewProduct((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  // Submit product to backend
  const handleSubmit = async () => {
    const { name, price, quantity, category, image } = newProduct;

    if (!name || !price || !quantity || !category || !image) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/products/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          price: Number(price),
          quantity: Number(quantity),
          category,
          image
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add product");
      }

      // Update parent state
      if (onAddProduct) {
        onAddProduct(data.product);
      }

      alert("Product added successfully");

      // Reset form
      setNewProduct({
        name: "",
        price: "",
        quantity: "",
        category: "",
        image: ""
      });

      onClose();
    } catch (error) {
      console.error("Add product error:", error);
      alert(error.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="products-add-product-modal">
      <div className="products-modal-content">
        <h3>Add New Product</h3>

        <div className="products-form-group">
          <label>Product Name</label>
          <input
            type="text"
            name="name"
            value={newProduct.name}
            onChange={handleInputChange}
            placeholder="Enter product name"
          />
        </div>

        <div className="products-form-group">
          <label>Category</label>
          <select
            name="category"
            value={newProduct.category}
            onChange={handleInputChange}
          >
            <option value="">Select category</option>
            <option value="Vegetables">Vegetables</option>
            <option value="Fruits">Fruits</option>
            <option value="Poultry & Meat">Poultry & Meat</option>
            <option value="Dairy & Beverages">Dairy & Beverages</option>
            <option value="Bakery & Snacks">Bakery & Snacks</option>
            <option value="Homemade Essentials">Homemade Essentials</option>
          </select>
        </div>

        <div className="products-form-group">
          <label>Price (₹)</label>
          <input
            type="number"
            name="price"
            value={newProduct.price}
            onChange={handleInputChange}
            placeholder="Enter price"
          />
        </div>

        <div className="products-form-group">
          <label>Quantity</label>
          <input
            type="number"
            name="quantity"
            value={newProduct.quantity}
            onChange={handleInputChange}
            placeholder="Enter quantity"
          />
        </div>

        <div className="products-form-group">
          <label>Product Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>

        {newProduct.image && (
          <div className="image-preview">
            <img
              src={newProduct.image}
              alt="Preview"
              style={{
                width: "100px",
                height: "100px",
                objectFit: "cover",
                borderRadius: "8px"
              }}
            />
          </div>
        )}

        <div className="products-modal-actions">
          <button className="btn" onClick={onClose} disabled={loading}>
            Cancel
          </button>

          <button className="btn btn-add" onClick={handleSubmit} disabled={loading}>
            {loading ? "Adding..." : "Add Product"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
