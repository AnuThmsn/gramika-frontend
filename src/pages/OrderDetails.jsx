import React, { useState } from "react";
import { useParams } from "react-router-dom";

const OrderDetails = () => {
  const { id } = useParams();
  const [status, setStatus] = useState("Pending");

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h3 style={styles.title}>Order Details</h3>

        <p style={styles.meta}>Order ID: {id}</p>

        <div
          style={
            status === "Completed"
              ? styles.statusCompleted
              : styles.statusPending
          }
        >
          {status === "Completed"
            ? "Delivered & Payment Completed"
            : "Waiting for delivery"}
        </div>

        {status === "Pending" && (
          <button
            style={styles.primaryButton}
            onClick={() => setStatus("Completed")}
          >
            Confirm Order Received
          </button>
        )}

        {status === "Completed" && (
          <div style={styles.successBox}>
            ✅ Order successfully delivered <br />
            💰 Payment confirmed
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: {
    background: "#f6f7f9",
    minHeight: "100vh",
    paddingTop: 70,
  },
  card: {
    maxWidth: 480,
    margin: "auto",
    background: "#ffffff",
    padding: 24,
    borderRadius: 14,
    boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
    fontFamily: "Inter, Segoe UI, sans-serif",
  },
  title: {
    marginBottom: 6,
    fontWeight: 600,
  },
  meta: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 20,
  },
  statusPending: {
    background: "#fff7ed",
    color: "#9a3412",
    padding: 12,
    borderRadius: 10,
    textAlign: "center",
    fontWeight: 600,
    marginBottom: 20,
  },
  statusCompleted: {
    background: "#ecfdf5",
    color: "#065f46",
    padding: 12,
    borderRadius: 10,
    textAlign: "center",
    fontWeight: 600,
    marginBottom: 20,
  },
  primaryButton: {
    width: "100%",
    padding: 14,
    background: "#204229",
    color: "#fff",
    fontSize: 15,
    fontWeight: 600,
    border: "none",
    borderRadius: 12,
    cursor: "pointer",
  },
  successBox: {
    marginTop: 10,
    background: "#e6f4ea",
    padding: 14,
    borderRadius: 10,
    textAlign: "center",
    fontWeight: 600,
  },
};

export default OrderDetails;
