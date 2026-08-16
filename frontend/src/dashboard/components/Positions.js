import React, { useEffect, useMemo, useState } from "react";
import { getPositions } from "../services/api";

const money = (value) => Number(value || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const Positions = () => {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPositions = async () => {
    try {
      setLoading(true);
      const data = await getPositions();
      setPositions(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      console.error("Error fetching positions:", err);
      setError(err?.response?.data?.message || "Failed to load positions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadPositions(); }, []);

  const totalPnl = useMemo(
    () => positions.reduce((sum, stock) => sum + (Number(stock.price || 0) - Number(stock.avg || 0)) * Number(stock.qty || 0), 0),
    [positions]
  );

  if (loading) return <div className="page-state">Loading positions...</div>;
  if (error) return <div className="page-state error-state">{error}</div>;

  return (
    <div className="page-section">
      <div className="page-section-header">
        <div>
          <span className="page-eyebrow">TRADING</span>
          <h2>Positions ({positions.length})</h2>
          <p>Open trading positions returned by the backend.</p>
        </div>
        <button className="secondary-action" type="button" onClick={loadPositions}>Refresh</button>
      </div>

      <div className="summary-strip">
        <div><span>Open Positions</span><strong>{positions.length}</strong></div>
        <div><span>Unrealized P&amp;L</span><strong className={totalPnl >= 0 ? "profit" : "loss"}>{totalPnl >= 0 ? "+" : "-"}₹{money(Math.abs(totalPnl))}</strong></div>
      </div>

      {positions.length === 0 ? (
        <div className="empty-page-state">No open positions.</div>
      ) : (
        <div className="simple-table-wrapper">
          <table className="simple-table">
            <thead><tr><th>Product</th><th>Instrument</th><th>Qty</th><th>Avg</th><th>LTP</th><th>P&amp;L</th><th>Day</th></tr></thead>
            <tbody>
              {positions.map((stock) => {
                const pnl = (Number(stock.price || 0) - Number(stock.avg || 0)) * Number(stock.qty || 0);
                return (
                  <tr key={stock._id || `${stock.product}-${stock.name}`}>
                    <td>{stock.product}</td>
                    <td><strong>{stock.name}</strong></td>
                    <td>{stock.qty}</td>
                    <td>₹{money(stock.avg)}</td>
                    <td>₹{money(stock.price)}</td>
                    <td className={pnl >= 0 ? "profit" : "loss"}>{pnl >= 0 ? "+" : "-"}₹{money(Math.abs(pnl))}</td>
                    <td className={String(stock.day || "").startsWith("-") ? "loss" : "profit"}>{stock.day || "-"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Positions;
