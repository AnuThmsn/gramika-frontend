import React from "react";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";

const CartItem = ({ item, onUpdateQuantity }) => {
  if (!item) return null;

  return (
    <div className="cart-item">
      {/* Product name */}
      <p className="cart-item-name">{item.name}</p>

      {/* Quantity controls */}
      <div className="cart-qty-controls">
        <button
          className="qty-btn"
          onClick={() => onUpdateQuantity(item._id, -1)}
        >
          <FaMinus />
        </button>

        <span className="qty-value">{item.quantity}</span>

        <button
          className="qty-btn"
          onClick={() => onUpdateQuantity(item._id, +1)}
        >
          <FaPlus />
        </button>

        {/* Optional remove */}
        <button
          className="qty-btn remove"
          onClick={() => onUpdateQuantity(item._id, -item.quantity)}
        >
          <FaTrash />
        </button>
      </div>

      {/* Price */}
      <span className="cart-item-price">
        ₹{item.price * item.quantity}
      </span>
    </div>
  );
};

export default CartItem;
