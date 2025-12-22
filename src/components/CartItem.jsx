import React from 'react';

const CartItem = ({ item, onUpdateQuantity }) => {
  if (!item) return null; // Safety check

  const handleChange = (e) => {
    const newQty = parseInt(e.target.value, 10) || 0;
    onUpdateQuantity(item.id, newQty);
  };

  return (
    <div className="cart-item">
      <p>{item.name}</p>
      <input type="number" min="1" value={item.quantity} onChange={handleChange} />
      <span>₹{item.price * item.quantity}</span>
    </div>
  );
};

export default CartItem;
