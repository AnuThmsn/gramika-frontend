import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// Layouts
import UserLayout from "./layouts/UserLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";

// User pages
import Home from "./pages/Home.jsx";
import BuyPage from "./pages/BuyPage.jsx";
import ProfilePage from "./pages/Profile.jsx";
import MyShop from "./pages/Myshop.jsx";
import Cart from "./pages/cart.jsx";
import Login from "./pages/Login.jsx";
import Checkout from "./pages/Checkout.jsx";

// Admin pages
import Dashboard from "./pages/admin/Dashboard.jsx";
import Products from "./pages/admin/Products.jsx";
import Orders from "./pages/admin/Orders.jsx";
import Users from "./pages/admin/Users.jsx";
import Payouts from "./pages/admin/Payouts.jsx";
import Settings from "./pages/admin/Settings.jsx";

// Route guards
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import AdminRoute from "./routes/AdminRoute.jsx";

export default function App() {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cartItems"));
    if (savedCart) setCartItems(savedCart);
  }, []);

  // Save cart to localStorage whenever cartItems changes
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // Add/update/remove items in cart
  const onUpdateQuantity = (product, delta) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item._id === product._id);

      if (existing) {
        const updatedQty = existing.quantity + delta;
        if (updatedQty <= 0) return prev.filter(item => item._id !== product._id);
        return prev.map(item =>
          item._id === product._id ? { ...item, quantity: updatedQty } : item
        );
      } else if (delta > 0) {
        return [...prev, { ...product, quantity: delta }];
      }
      return prev;
    });
  };

  // Optional: Update quantity directly (used by Cart page buttons)
  const onSetQuantity = (id, quantity) => {
    setCartItems(prev => {
      if (quantity <= 0) return prev.filter(item => item._id !== id);
      return prev.map(item => item._id === id ? { ...item, quantity } : item);
    });
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* User layout */}
        <Route element={<UserLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<BuyPage onUpdateQuantity={onUpdateQuantity} />} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/my-shop" element={<MyShop />} />

          {/* Cart Page */}
          <Route
            path="/cart"
            element={
              <Cart
                cartItems={cartItems}
                onUpdateQuantity={onSetQuantity} // Now using direct quantity
                onProceedToPayment={(total) => alert(`Proceeding to payment ₹${total}`)}
              />
            }
          />

          <Route path="/checkout" element={<Checkout />} />
        </Route>

        {/* Admin layout */}
        <Route
          path="/admin"
          element={<AdminRoute><AdminLayout /></AdminRoute>}
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          <Route path="users" element={<Users />} />
          <Route path="payouts" element={<Payouts />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
