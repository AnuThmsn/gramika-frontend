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
import OrderDetails from "./pages/OrderDetails.jsx";

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

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cartItems"));
    if (savedCart) setCartItems(savedCart);
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // Add / update quantity (used in BuyPage)
  const onUpdateQuantity = (product, delta) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item._id === product._id);

      if (existing) {
        const updatedQty = existing.quantity + delta;
        if (updatedQty <= 0) {
          return prev.filter((item) => item._id !== product._id);
        }
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: updatedQty }
            : item
        );
      } else if (delta > 0) {
        return [...prev, { ...product, quantity: delta }];
      }
      return prev;
    });
  };

  // Set quantity directly (used in Cart page)
  const onSetQuantity = (id, quantity) => {
    setCartItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((item) => item._id !== id);
      }
      return prev.map((item) =>
        item._id === id ? { ...item, quantity } : item
      );
    });
  };

  // Clear cart after order
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cartItems");
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* ================= LOGIN ================= */}
        <Route path="/login" element={<Login />} />

        {/* ================= USER LAYOUT ================= */}
        <Route element={<UserLayout />}>
          <Route path="/" element={<Home />} />

          <Route
            path="/shop"
            element={<BuyPage onUpdateQuantity={onUpdateQuantity} />}
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-shop"
            element={
              <ProtectedRoute>
                <MyShop />
              </ProtectedRoute>
            }
          />

          {/* CART */}
          <Route
            path="/cart"
            element={
              <Cart
                cartItems={cartItems}
                onUpdateQuantity={onSetQuantity}
              />
            }
          />

          {/* CHECKOUT */}
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout onConfirmOrder={clearCart} />
              </ProtectedRoute>
            }
          />

          {/* ORDER DETAILS */}
          <Route
            path="/orders/:id"
            element={
              <ProtectedRoute>
                <OrderDetails />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* ================= ADMIN LAYOUT ================= */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          <Route path="users" element={<Users />} />
          <Route path="payouts" element={<Payouts />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
