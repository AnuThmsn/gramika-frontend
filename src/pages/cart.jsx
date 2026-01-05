import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // navigate to checkout
import CartItem from "../components/CartItem";
import "../styles/Cart.css";

const Cart = ({ isOpen, onClose, cartItems = [], onUpdateQuantity }) => {
  const navigate = useNavigate();

  // Totals
  const itemsTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryCharge = 0;
  const handlingCharge = 0;
  const grandTotal = itemsTotal + deliveryCharge + handlingCharge;

  // Disable body scroll when cart is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  // Navigate to Checkout with cart data
  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    onClose(); // close cart sidebar
    navigate("/checkout", { state: { cartItems, grandTotal } }); // pass cart data
  };

  return (
    <>
      {/* Overlay */}
      <div className={`cart-overlay ${isOpen ? "open" : ""}`} onClick={onClose} />

      {/* Sidebar */}
      <div className={`cart-sidebar ${isOpen ? "open" : ""}`}>
        {/* Header */}
        <div className="cart-header">
          <h3>Your Cart</h3>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>

        {/* Cart Items */}
        <div className="cart-items">
          {cartItems.length === 0 ? (
            <p className="empty-cart">Your cart is empty</p>
          ) : (
            cartItems.map(item => (
              <CartItem key={item._id} item={item} onUpdateQuantity={onUpdateQuantity} />
            ))
          )}
        </div>

        {/* Bill Details */}
        <div className="bill-details">
          <p>Items Total <span>₹{itemsTotal}</span></p>
          <p>Delivery Charge <span>₹{deliveryCharge}</span></p>
          <p>Handling Charge <span>₹{handlingCharge}</span></p>
          <p className="grand-total">Grand Total <span>₹{grandTotal}</span></p>
        </div>

        {/* Footer */}
        <div className="cart-footer">
          <span className="total-amount">₹{grandTotal}</span>
          <button className="proceed-button" onClick={handleProceedToCheckout}>
            Proceed to Checkout
          </button>
        </div>
      </div>
    </>
  );
};

export default Cart;
