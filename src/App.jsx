import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// Layouts
import UserLayout from "./layouts/UserLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";

// User-side pages
import Home from "./pages/Home.jsx";
import BuyPage from "./pages/BuyPage.jsx";
import ProfilePage from "./pages/Profile.jsx";
import MyShop from "./pages/Myshop.jsx";
import Cart from "./pages/cart.jsx";
import Login from "./pages/Login.jsx";
import Checkout from "./pages/Checkout.jsx";

// Admin-side pages
import Dashboard from "./pages/admin/Dashboard.jsx";
import Products from "./pages/admin/Products.jsx";
import Orders from "./pages/admin/Orders.jsx";
import Users from "./pages/admin/Users.jsx";
import Payouts from "./pages/admin/Payouts.jsx";
import Settings from "./pages/admin/Settings.jsx";

// Route Guards
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import AdminRoute from "./routes/AdminRoute.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login (no layout) */}
        <Route path="/login" element={<Login />} />

        {/* User Layout */}
        <Route element={<UserLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<BuyPage />} />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route path="/my-shop" element={<MyShop />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
        </Route>

        {/* Admin Layout */}
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

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
