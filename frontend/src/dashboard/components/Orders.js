import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, RefreshCw, ShoppingCart } from "lucide-react";
import { getOrders } from "../services/api";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getOrders();

      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Load orders error:", err);

      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Unable to load orders."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  if (loading) {
    return (
      <div className="page-state">
        Loading orders...
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-state">
        <AlertTriangle size={30} />

        <strong>Unable to load orders</strong>

        <span>{error}</span>

        <button
          className="secondary-action"
          type="button"
          onClick={loadOrders}
        >
          <RefreshCw size={15} />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="page-section orders-page">

      <div className="page-section-header">

        <div>
          <span className="page-eyebrow">
            TRADING
          </span>

          <h2>Orders</h2>

          <p>
            View your submitted Buy and Sell orders.
          </p>
        </div>

        <button
          className="secondary-action"
          type="button"
          onClick={loadOrders}
        >
          <RefreshCw size={15} />
          Refresh
        </button>

      </div>

      {orders.length === 0 ? (
        <div className="empty-page-state">

          <ShoppingCart size={30} />

          <strong>
            No orders yet
          </strong>

          <span>
            Place a Buy or Sell order from the watchlist.
          </span>

          <Link
            to="/dashboard"
            className="primary-action"
          >
            Go to dashboard
          </Link>

        </div>
      ) : (
        <div className="simple-table-wrapper">

          <table className="simple-table">

            <thead>
              <tr>
                <th>Stock</th>
                <th>Side</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Value</th>
                <th>Status</th>
                <th>Time</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (

                <tr key={order._id}>

                  <td>
                    <strong>
                      {order.name}
                    </strong>
                  </td>

                  <td>
                    <span
                      className={`order-side ${
                        order.mode === "BUY"
                          ? "buy"
                          : "sell"
                      }`}
                    >
                      {order.mode}
                    </span>
                  </td>

                  <td>
                    {order.qty}
                  </td>

                  <td>
                    ₹
                    {Number(order.price).toLocaleString(
                      "en-IN",
                      {
                        maximumFractionDigits: 2,
                      }
                    )}
                  </td>

                  <td>
                    ₹
                    {(
                      Number(order.qty) *
                      Number(order.price)
                    ).toLocaleString(
                      "en-IN",
                      {
                        maximumFractionDigits: 2,
                      }
                    )}
                  </td>

                  <td>
                    <span className="order-status">
                      {order.status || "SUBMITTED"}
                    </span>
                  </td>

                  <td>
                    {order.createdAt
                      ? new Date(
                          order.createdAt
                        ).toLocaleString("en-IN")
                      : "-"}
                  </td>

                </tr>

              ))}
            </tbody>

          </table>

        </div>
      )}

    </div>
  );
};

export default Orders;