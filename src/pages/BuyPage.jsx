import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import Cart from "./cart";
import { FaCarrot, FaAppleAlt, FaHome } from "react-icons/fa";
import { GiMeatCleaver, GiMilkCarton, GiManualMeatGrinder } from "react-icons/gi";
import { CiSearch } from "react-icons/ci";

function BuyPage() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error(err));
  }, []);

  // 🛒 ADD TO CART (merge quantity)
  const handleAddToCart = (product) => {
  setCartItems(prevItems => {
    const existingItem = prevItems.find(
      item => item._id === product._id
    );

    if (existingItem) {
      return prevItems.map(item =>
        item._id === product._id
          ? { ...item, quantity: item.quantity + product.quantity }
          : item
      );
    }

    return [
      ...prevItems,
      {
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: product.quantity
      }
    ];
  });

  setIsCartOpen(true);
};



  // ➕➖ UPDATE CART QTY
  const handleUpdateQuantity = (id, change) => {
    setCartItems(prev =>
      prev
        .map(item =>
          item._id === id
            ? { ...item, quantity: Math.max(1, item.quantity + change) }
            : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  const categories = [
    "All",
    "Vegetables",
    "Fruits",
    "Poultry & Meat",
    "Dairy & Beverages",
    "Bakery & Snacks",
    "Homemade Essentials",
  ];

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Vegetables": return <FaCarrot />;
      case "Fruits": return <FaAppleAlt />;
      case "Poultry & Meat": return <GiMeatCleaver />;
      case "Dairy & Beverages": return <GiMilkCarton />;
      case "Bakery & Snacks": return <GiManualMeatGrinder />;
      case "Homemade Essentials": return <FaHome />;
      default: return null;
    }
  };

  return (
    <div style={{ padding: "32px", maxWidth: "1200px", margin: "0 auto" }}>
      
      {/* SEARCH */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
        <div style={{ display: "flex", width: "80%", background: "#f5f5f5", borderRadius: "30px" }}>
          <div style={{ flex: 1, position: "relative" }}>
            <CiSearch style={{ position: "absolute", top: "50%", left: "16px", transform: "translateY(-50%)" }} />
            <input
              placeholder="Search products"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ width: "100%", padding: "14px 14px 14px 45px", border: "none", background: "transparent" }}
            />
          </div>
        </div>
      </div>

      {/* CATEGORIES */}
      <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginBottom: "32px", flexWrap: "wrap" }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: "10px 18px",
              borderRadius: "24px",
              border: "none",
              fontWeight: "bold",
              background: selectedCategory === cat ? "#63c959" : "#1a3c34",
              color: selectedCategory === cat ? "#1a3c34" : "#fff",
              display: "flex",
              gap: "6px",
              alignItems: "center"
            }}
          >
            {getCategoryIcon(cat)} {cat}
          </button>
        ))}
      </div>

      {/* PRODUCTS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "24px" }}>
        {products
          .filter(p =>
            (selectedCategory === "All" || p.category === selectedCategory) &&
            p.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .sort((a, b) => {
            if (sortOption === "priceLowHigh") return a.price - b.price;
            if (sortOption === "priceHighLow") return b.price - a.price;
            return a.name.localeCompare(b.name);
          })
          .map(item => (
            <ProductCard
              key={item._id}
              image={item.image}
              name={item.name}
              price={item.price}
              stock={item.quantity}
              onAddToCart={(qty) => handleAddToCart({ ...item, quantity: qty })}
            />
          ))}
      </div>

      {/* 🧺 CART */}
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onProceedToPayment={(total) => alert(`Proceeding with ₹${total}`)}
      />
    </div>
  );
}

export default BuyPage;
