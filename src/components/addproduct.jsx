import React, { useState } from "react";

const AddProduct = ({ onAddProduct, onClose }) => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    quantity: "",
    image: ""
  });

  const [loading, setLoading] = useState(false);

  // Handle text inputs
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
    if (!newProduct.name || !newProduct.price || !newProduct.quantity || !newProduct.image) {
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
          name: newProduct.name,
          price: Number(newProduct.price),
          quantity: Number(newProduct.quantity),
          image: newProduct.image
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add product");
      }

      // Update parent state (optional)
      if (onAddProduct) {
        onAddProduct(data.product);
      }

      alert("Product added successfully");

      // Reset form
      setNewProduct({
        name: "",
        price: "",
        quantity: "",
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

export default AddProduct