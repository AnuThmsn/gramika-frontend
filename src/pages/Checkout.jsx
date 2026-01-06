import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Checkout = ({ onConfirmOrder }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { cartItems = [], grandTotal = 0 } = location.state || {};

  const [billingDetails, setBillingDetails] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const sellerUPI = "9876543210@upi";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBillingDetails({ ...billingDetails, [name]: value });
  };

  const handleConfirmOrder = () => {
    if (!cartItems.length) {
      alert("Your cart is empty");
      return;
    }

    onConfirmOrder();
    navigate("/orders/ORDER123"); // UI demo
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.title}>Checkout</h2>

        {/* ORDER SUMMARY */}
        <div style={styles.card}>
          <h4 style={styles.cardTitle}>Order Summary</h4>

          {cartItems.map((item) => (
            <div key={item._id} style={styles.row}>
              <span style={styles.itemName}>
                {item.name} × {item.quantity}
              </span>
              <span style={styles.price}>
                ₹{item.price * item.quantity}
              </span>
            </div>
          ))}

          <div style={styles.divider} />

          <div style={styles.totalRow}>
            <span>Total Payable</span>
            <span>₹{grandTotal}</span>
          </div>
        </div>

        {/* DELIVERY DETAILS */}
        <div style={styles.card}>
          <h4 style={styles.cardTitle}>Delivery Details</h4>

          <input
            style={styles.input}
            placeholder="Full name"
            name="name"
            onChange={handleChange}
          />
          <input
            style={styles.input}
            placeholder="Mobile number"
            name="phone"
            onChange={handleChange}
          />
          <textarea
            style={styles.textarea}
            placeholder="Complete delivery address"
            name="address"
            onChange={handleChange}
          />
        </div>

        {/* PAYMENT */}
        <div style={styles.card}>
          <h4 style={styles.cardTitle}>Payment</h4>
          <p style={styles.subText}>
            Pay directly to the seller using UPI
          </p>

          <div style={styles.paymentBox}>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=110x110&data=upi://pay?pa=${sellerUPI}`}
              alt="UPI QR"
              style={styles.qr}
            />

            <div>
              <p style={styles.upiLabel}>UPI ID</p>
              <p style={styles.upiId}>{sellerUPI}</p>
              <p style={styles.note}>
                Scan with GPay / PhonePe / Paytm
              </p>
            </div>
          </div>
        </div>

        {/* CONFIRM */}
        <button style={styles.primaryButton} onClick={handleConfirmOrder}>
          Confirm & Place Order
        </button>
      </div>
    </div>
  );
};

const styles = {
  page: {
    background: "#f6f7f9",
    minHeight: "100vh",
    padding: "50px 0",
  },
  container: {
    maxWidth: 520,
    margin: "auto",
    fontFamily: "Inter, Segoe UI, sans-serif",
  },
  title: {
    textAlign: "center",
    marginBottom: 30,
    fontWeight: 600,
    color: "#1f2937",
  },
  card: {
    background: "#ffffff",
    padding: 20,
    borderRadius: 12,
    boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
    marginBottom: 20,
  },
  cardTitle: {
    marginBottom: 14,
    fontSize: 16,
    fontWeight: 600,
    color: "#111827",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 8,
    fontSize: 14,
  },
  itemName: {
    color: "#374151",
  },
  price: {
    fontWeight: 500,
  },
  divider: {
    height: 1,
    background: "#e5e7eb",
    margin: "12px 0",
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    fontWeight: 600,
    fontSize: 16,
  },
  input: {
    width: "100%",
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    border: "1px solid #d1d5db",
    fontSize: 14,
  },
  textarea: {
    width: "100%",
    padding: 12,
    height: 90,
    borderRadius: 8,
    border: "1px solid #d1d5db",
    fontSize: 14,
  },
  subText: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 12,
  },
  paymentBox: {
    display: "flex",
    gap: 16,
    alignItems: "center",
    background: "#f9fafb",
    padding: 14,
    borderRadius: 10,
  },
  qr: {
    borderRadius: 8,
    background: "#fff",
    padding: 4,
  },
  upiLabel: {
    fontSize: 12,
    color: "#6b7280",
  },
  upiId: {
    fontWeight: 600,
    fontSize: 14,
  },
  note: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
  },
  primaryButton: {
    width: "100%",
    padding: 15,
    background: "#204229",
    color: "#ffffff",
    fontSize: 16,
    fontWeight: 600,
    border: "none",
    borderRadius: 12,
    cursor: "pointer",
    marginTop: 10,
  },
};

export default Checkout;
