import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Cart from '../pages/cart.jsx';
import './UserLayout.css';
import trialPic from '../assets/trial_pic.jpg';

export default function UserLayout() {
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Global cart state
  const [cartItems, setCartItems] = useState([
    { id: 'coke', name: 'Coca-Cola Soft Drink', volume: '750 ml', price: 45, quantity: 1, image: trialPic },
    { id: 'sprite', name: 'Sprite Lime Flavored Soft Drink', volume: '750 ml', price: 45, quantity: 1, image: trialPic }
  ]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const handleUpdateQuantity = (id, newQuantity) => {
    setCartItems(prev =>
      prev
        .map(item =>
          item.id === id ? { ...item, quantity: Math.max(0, newQuantity) } : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  const handleProceedToCheckout = () => {
    closeCart();
    navigate('/checkout'); // Navigate to checkout page
  };

  return (
    <div className="user-layout">
      <Header onCartClick={openCart} />
      <main>
        <Outlet />
      </main>

      {/* Cart Sidebar */}
      <Cart
        isOpen={isCartOpen}
        onClose={closeCart}
        onProceedToPayment={handleProceedToCheckout}
        cartItems={cartItems}                 // ✅ Pass global cart items
        onUpdateQuantity={handleUpdateQuantity} // ✅ Pass quantity updater
      />
    </div>
  );
}
