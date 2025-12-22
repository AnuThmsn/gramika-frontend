import React, { useState } from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { 
  FaThLarge, 
  FaBoxOpen, 
  FaShoppingCart, 
  FaUsers, 
  FaMoneyBillWave, 
  FaCog, 
  FaSearch, 
  FaUserCircle 
} from 'react-icons/fa';
import './AdminLayout.css';
import logoImg from '../assets/logo.png';

const AdminLayout = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');

  // Handle search form submit
  const handleSearchSubmit = (e) => {
    e?.preventDefault?.();
    const query = (searchValue || '').trim();
    if (!query) return;

    const lowerQuery = query.toLowerCase();

    // Simple routing heuristics
    if (lowerQuery.includes('product') || lowerQuery.startsWith('p:') || /sku|item|price|category/.test(lowerQuery)) {
      navigate(`/admin/products?q=${encodeURIComponent(query)}`);
    } else if (lowerQuery.includes('order') || lowerQuery.startsWith('o:') || /invoice|order#|trx|buyer|seller/.test(lowerQuery)) {
      navigate(`/admin/orders?q=${encodeURIComponent(query)}`);
    } else if (lowerQuery.includes('user') || lowerQuery.includes('buyer') || lowerQuery.includes('seller')) {
      navigate(`/admin/users?q=${encodeURIComponent(query)}`);
    } else if (lowerQuery.includes('payout') || lowerQuery.includes('pay')) {
      navigate(`/admin/payouts?q=${encodeURIComponent(query)}`);
    } else {
      navigate(`/admin/dashboard?q=${encodeURIComponent(query)}`);
    }
  };

  // Sidebar menu items
  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <FaThLarge /> },
    { name: 'Products', path: '/admin/products', icon: <FaBoxOpen /> },
    { name: 'Orders', path: '/admin/orders', icon: <FaShoppingCart /> },
    { name: 'Users', path: '/admin/users', icon: <FaUsers /> },
    { name: 'Payouts', path: '/admin/payouts', icon: <FaMoneyBillWave /> },
  ];

  return (
    <div className="admin-container">
      {/* TOP NAVBAR */}
      <header className="top-navbar">
        {/* Logo */}
        <div className="navbar-brand">
          <img src={logoImg} alt="Gramika" className="navbar-logo" />
        </div>

        {/* Search + Profile */}
        <div className="nav-right">
          <form onSubmit={handleSearchSubmit} className="search-box">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search..."
            />
            <FaSearch className="search-icon" onClick={handleSearchSubmit} />
          </form>

          <div className="profile-section">
            <span className="admin-name">Anu Thomson</span>
            <Link to="/admin/settings" className="profile-icon-link">
              <FaUserCircle size={32} />
            </Link>
          </div>
        </div>
      </header>

      {/* BODY LAYOUT: Sidebar + Content */}
      <div className="layout-body">
        {/* SIDEBAR */}
        <aside className="admin-sidebar">
          <nav className="sidebar-nav">
            {menuItems.map((item) => (
              <NavLink 
                key={item.name} 
                to={item.path} 
                className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
              >
                <span className="icon">{item.icon}</span>
                <span className="label">{item.name}</span>
              </NavLink>
            ))}
          </nav>

          <div className="sidebar-footer">
            <NavLink 
              to="/admin/settings" 
              className={({ isActive }) => isActive ? "nav-item active settings" : "nav-item settings"}
            >
              <span className="icon"><FaCog /></span>
              <span className="label">Settings</span>
            </NavLink>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
