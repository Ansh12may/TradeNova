import React, { useState, useContext } from "react";
import axios from "axios";
import GeneralContext from "./GeneralContext";
import "./BuyActionWindow.css";

const BuyActionWindow = ({ uid }) => {
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(0.0);
  const [mode, setMode] = useState("BUY"); // BUY or SELL
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  //  Use useContext — calling GeneralContext.closeBuyWindow() directly
  //         on the context object is undefined at runtime. Must use the hook.
  const { closeBuyWindow } = useContext(GeneralContext);

  const handleOrderClick = async () => {
    if (!stockPrice || stockPrice <= 0) {
      setMessage("Please enter a valid price.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      //  Added auth header — /newOrder now requires authentication
      await axios.post(
        "http://localhost:8080/newOrder",
        {
          name: uid,
          qty: Number(stockQuantity),
          price: Number(stockPrice),
          mode,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage(`${mode} order placed for ${uid}!`);
      setTimeout(() => closeBuyWindow(), 1000);
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Order failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" id="buy-window" draggable="true">
      <div className="regular-order">
        {/* Mode toggle */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
          <button
            onClick={() => setMode("BUY")}
            style={{
              background: mode === "BUY" ? "#387ED1" : "#eee",
              color: mode === "BUY" ? "#fff" : "#333",
              border: "none",
              padding: "4px 16px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Buy
          </button>
          <button
            onClick={() => setMode("SELL")}
            style={{
              background: mode === "SELL" ? "#e74c3c" : "#eee",
              color: mode === "SELL" ? "#fff" : "#333",
              border: "none",
              padding: "4px 16px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Sell
          </button>
        </div>

        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              name="qty"
              id="qty"
              min="1"
              onChange={(e) => setStockQuantity(e.target.value)}
              value={stockQuantity}
            />
          </fieldset>
          <fieldset>
            <legend>Price</legend>
            <input
              type="number"
              name="price"
              id="price"
              step="0.05"
              onChange={(e) => setStockPrice(Number(e.target.value))}
              value={stockPrice}
            />
          </fieldset>
        </div>

        {message && (
          <p
            style={{
              fontSize: "12px",
              color: message.includes("placed") ? "green" : "red",
              margin: "4px 0 0",
            }}
          >
            {message}
          </p>
        )}
      </div>

      <div className="buttons">
        <span>Margin required ₹140.65</span>
        <div>
          <button
            className={`btn ${mode === "BUY" ? "btn-blue" : "btn-red"}`}
            onClick={handleOrderClick}
            disabled={loading}
            style={{ cursor: "pointer" }}
          >
            {loading ? "Placing..." : mode}
          </button>
          <button
            className="btn btn-grey"
            onClick={closeBuyWindow}
            style={{ cursor: "pointer" }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyActionWindow;