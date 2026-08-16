import React, { useEffect, useMemo, useState } from "react";
import { BarElement, CategoryScale, Chart as ChartJS, LinearScale, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import { getHoldings } from "../services/api";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const money = (value, decimals = 2) =>
  Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

const Holdings = () => {
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadHoldings = async () => {
    try {
      setLoading(true);
      const data = await getHoldings();
      setHoldings(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      console.error("Error fetching holdings:", err);
      setError(err?.response?.data?.message || "Failed to load holdings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHoldings();
  }, []);

  const totals = useMemo(() => {
    const investment = holdings.reduce((sum, stock) => sum + Number(stock.avg || 0) * Number(stock.qty || 0), 0);
    const current = holdings.reduce((sum, stock) => sum + Number(stock.price || 0) * Number(stock.qty || 0), 0);
    const pnl = current - investment;
    return { investment, current, pnl, pct: investment ? (pnl / investment) * 100 : 0 };
  }, [holdings]);

  const chartData = useMemo(() => ({
    labels: holdings.map((stock) => stock.name),
    datasets: [
      {
        label: "Invested",
        data: holdings.map((stock) => Number(stock.avg || 0) * Number(stock.qty || 0)),
        backgroundColor: "rgba(56,126,209,.55)",
      },
      {
        label: "Current",
        data: holdings.map((stock) => Number(stock.price || 0) * Number(stock.qty || 0)),
        backgroundColor: holdings.map((stock) =>
          Number(stock.price || 0) >= Number(stock.avg || 0) ? "rgba(31,157,97,.55)" : "rgba(227,75,75,.55)"
        ),
      },
    ],
  }), [holdings]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Invested vs Current Value" },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { callback: (value) => `₹${Number(value).toLocaleString("en-IN")}` },
      },
    },
  };

  if (loading) return <div className="page-state">Loading holdings...</div>;
  if (error) return <div className="page-state error-state">{error}</div>;

  return (
    <div className="page-section">
      <div className="page-section-header">
        <div>
          <span className="page-eyebrow">PORTFOLIO</span>
          <h2>Holdings ({holdings.length})</h2>
          <p>Your current long-term equity holdings.</p>
        </div>
        <button className="secondary-action" type="button" onClick={loadHoldings}>Refresh</button>
      </div>

      {holdings.length > 0 && <div className="chart-card"><Bar data={chartData} options={chartOptions} /></div>}

      <div className="summary-strip">
        <div><span>Investment</span><strong>₹{money(totals.investment)}</strong></div>
        <div><span>Current Value</span><strong>₹{money(totals.current)}</strong></div>
        <div><span>P&amp;L</span><strong className={totals.pnl >= 0 ? "profit" : "loss"}>{totals.pnl >= 0 ? "+" : "-"}₹{money(Math.abs(totals.pnl))}</strong></div>
        <div><span>Return</span><strong className={totals.pct >= 0 ? "profit" : "loss"}>{totals.pct >= 0 ? "+" : ""}{totals.pct.toFixed(2)}%</strong></div>
      </div>

      {holdings.length === 0 ? (
        <div className="empty-page-state">No holdings found.</div>
      ) : (
        <div className="simple-table-wrapper">
          <table className="simple-table">
            <thead><tr><th>Instrument</th><th>Qty</th><th>Avg Cost</th><th>LTP</th><th>Current Value</th><th>P&amp;L</th><th>Net</th><th>Day</th></tr></thead>
            <tbody>
              {holdings.map((stock) => {
                const invested = Number(stock.avg || 0) * Number(stock.qty || 0);
                const current = Number(stock.price || 0) * Number(stock.qty || 0);
                const pnl = current - invested;
                return (
                  <tr key={stock._id || stock.name}>
                    <td><strong>{stock.name}</strong></td>
                    <td>{stock.qty}</td>
                    <td>₹{money(stock.avg)}</td>
                    <td>₹{money(stock.price)}</td>
                    <td>₹{money(current)}</td>
                    <td className={pnl >= 0 ? "profit" : "loss"}>{pnl >= 0 ? "+" : "-"}₹{money(Math.abs(pnl))}</td>
                    <td className={String(stock.net || "").startsWith("-") ? "loss" : "profit"}>{stock.net || "-"}</td>
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

export default Holdings;
