import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Checkout = ({ onConfirmOrder }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get cart data passed from Cart page
  const { cartItems = [], grandTotal = 0 } = location.state || {};

  const [billingDetails, setBillingDetails] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBillingDetails({ ...billingDetails, [name]: value });
  };

  // Handle confirm order
  const handleConfirm = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      navigate("/");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}` // if auth middleware used
        },
        body: JSON.stringify({
          items: cartItems.map(i => ({
            productId: i._id,
            name: i.name,
            price: i.price,
            quantity: i.quantity
          })),
          billingDetails,
          paymentMethod,
          totalAmount: grandTotal
        })
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        alert(data.message); // "Order placed successfully"
        onConfirmOrder();    // clear cart
        navigate("/");       // redirect home
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert("Server error, please try again");
    }
  };

  // Styles
  const containerStyle = {
    maxWidth: 600,
    margin: '40px auto',
    padding: 30,
    background: '#f5f5f5',
    borderRadius: 10,
    boxShadow: '0 0 15px rgba(0,0,0,0.1)',
    fontFamily: 'Arial, sans-serif'
  };

  const sectionStyle = { marginBottom: 25 };
  const headingStyle = { color: '#204229', marginBottom: 10 };
  const inputStyle = { width: '100%', padding: 10, marginBottom: 10, borderRadius: 5, border: '1px solid #ccc' };
  const buttonStyle = { width: '100%', padding: 12, backgroundColor: '#204229', color: 'white', fontSize: 16, fontWeight: 600, border: 'none', borderRadius: 5, cursor: 'pointer' };
  const buttonHoverStyle = { backgroundColor: '#1b3b1c' };

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: 'center', color: '#204229', marginBottom: 20 }}>Checkout</h2>

      {/* Order Summary */}
      <section style={sectionStyle}>
        <h3 style={headingStyle}>Order Summary</h3>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {cartItems.map(item => (
              <li key={item._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
                {item.name} x {item.quantity} = ₹{item.price * item.quantity}
              </li>
            ))}
          </ul>
        )}
        <p style={{ fontWeight: 'bold', marginTop: 10 }}>Grand Total: ₹{grandTotal}</p>
      </section>

      {/* Billing Details */}
      <section style={sectionStyle}>
        <h3 style={headingStyle}>Billing Details</h3>
        <input type="text" name="name" placeholder="Full Name" value={billingDetails.name} onChange={handleChange} style={inputStyle} />
        <input type="email" name="email" placeholder="Email" value={billingDetails.email} onChange={handleChange} style={inputStyle} />
        <input type="tel" name="phone" placeholder="Phone Number" value={billingDetails.phone} onChange={handleChange} style={inputStyle} />
        <textarea name="address" placeholder="Delivery Address" value={billingDetails.address} onChange={handleChange} style={{ ...inputStyle, height: 80 }}></textarea>
      </section>

      {/* Payment Method */}
      <section style={sectionStyle}>
        <h3 style={headingStyle}>Payment Method</h3>
        <label style={{ display: 'block', marginBottom: 8, cursor: 'pointer' }}>
          <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
          Credit/Debit Card
        </label>
        <label style={{ display: 'block', marginBottom: 8, cursor: 'pointer' }}>
          <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} />
          UPI
        </label>
        <label style={{ display: 'block', marginBottom: 8, cursor: 'pointer' }}>
          <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
          Cash on Delivery
        </label>
      </section>

      {/* Confirm Button */}
      <button
        style={buttonStyle}
        disabled={loading}
        onMouseOver={e => e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor}
        onMouseOut={e => e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor}
        onClick={handleConfirm}
      >
        {loading ? "Placing Order..." : "Confirm Order"}
      </button>
    </div>
  );
};

export default Checkout;
