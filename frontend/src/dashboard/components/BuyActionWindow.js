import React, { useContext, useMemo, useState } from "react";
import GeneralContext from "./GeneralContext";
import { createOrder } from "../services/api";
import "./BuyActionWindow.css";

const BuyActionWindow = ({uid,price,initialMode = "BUY"}) =>  {
  const { closeBuyWindow } = useContext(GeneralContext);
  const [stockQuantity, setStockQuantity] = useState(1);
 const [stockPrice, setStockPrice] = useState(Number(price)||0);
  const [mode, setMode] = useState(initialMode === "SELL" ? "SELL" : "BUY");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const orderValue = useMemo(
    () => Number(stockQuantity || 0) * Number(stockPrice || 0),
    [stockQuantity, stockPrice]
  );

  const handleOrderClick = async () => {
    const qty = Number(stockQuantity);
    const price = Number(stockPrice);

    if (!Number.isInteger(qty) || qty <= 0) {
      setMessage("Quantity must be a positive whole number.");
      setMessageType("error");
      return;
    }

    if (!Number.isFinite(price) || price <= 0) {
      setMessage("Please enter a valid price.");
      setMessageType("error");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await createOrder({
        name: uid,
        qty,
        price,
        mode,
      });
      setMessage(`${mode} order submitted for ${uid}.`);
      setMessageType("success");

      window.dispatchEvent(new Event("orders:changed"));

      setTimeout(closeBuyWindow, 700);
    } catch (err) {
      setMessage(
        err?.response?.data?.message ||
          err?.message ||
          "Order failed. Please try again."
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="order-modal-backdrop" onMouseDown={closeBuyWindow}>
      <div
        className="buy-window"
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-window-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="order-window-header">
          <div>
            <span>PLACE ORDER</span>
            <h3 id="order-window-title">{uid}</h3>
          </div>
          <button type="button" onClick={closeBuyWindow} aria-label="Close">
            ×
          </button>
        </div>

        <div className="order-mode-toggle">
          <button
            type="button"
            className={mode === "BUY" ? "active-buy" : ""}
            onClick={() => setMode("BUY")}
          >
            Buy
          </button>
          <button
            type="button"
            className={mode === "SELL" ? "active-sell" : ""}
            onClick={() => setMode("SELL")}
          >
            Sell
          </button>
        </div>

        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              min="1"
              step="1"
              value={stockQuantity}
              onChange={(event) => setStockQuantity(event.target.value)}
            />
          </fieldset>

          <fieldset>
            <legend>Price</legend>
            <input
              type="number"
              min="0.05"
              step="0.05"
              value={stockPrice}
              onChange={(event) => setStockPrice(event.target.value)}
            />
          </fieldset>
        </div>

        <div className="order-summary-line">
          <span>Order value</span>
          <strong>₹{orderValue.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</strong>
        </div>

        {message && (
          <p className={`order-message ${messageType}`}>{message}</p>
        )}

        <div className="buttons">
          <span>Market execution is not simulated.</span>
          <div>
            <button
              type="button"
              className={`btn ${mode === "BUY" ? "btn-blue" : "btn-red"}`}
              onClick={handleOrderClick}
              disabled={loading}
            >
              {loading ? "Submitting..." : mode}
            </button>
            <button type="button" className="btn btn-grey" onClick={closeBuyWindow}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyActionWindow;
