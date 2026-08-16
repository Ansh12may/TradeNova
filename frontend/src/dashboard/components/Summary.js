import React, { useEffect, useMemo, useState } from "react";
import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  Tooltip,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { getHoldings } from "../services/api";

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = [
  "#387ED1", "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0",
  "#9966FF", "#FF9F40", "#76B041", "#F3722C", "#90BE6D",
];

const Summary = () => {
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = useMemo(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  const loadHoldings = async () => {
    try {
      setLoading(true);
      const data = await getHoldings();
      setHoldings(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      console.error("Summary holdings error:", err);
      setError(err?.response?.data?.message || "Unable to load portfolio data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadHoldings(); }, []);

  const totals = useMemo(() => {
    const current = holdings.reduce((sum, s) => sum + Number(s.price || 0) * Number(s.qty || 0), 0);
    const investment = holdings.reduce((sum, s) => sum + Number(s.avg || 0) * Number(s.qty || 0), 0);
    const pnl = current - investment;
    return { current, investment, pnl, pct: investment ? (pnl / investment) * 100 : 0 };
  }, [holdings]);

  const doughnutData = useMemo(() => ({
    labels: holdings.map((s) => s.name),
    datasets: [{
      label: "Portfolio Allocation",
      data: holdings.map((s) => Number(s.price || 0) * Number(s.qty || 0)),
      backgroundColor: holdings.map((_, index) => COLORS[index % COLORS.length]),
      borderColor: "#fff",
      borderWidth: 2,
    }],
  }), [holdings]);

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: { position: "right", labels: { boxWidth: 12, font: { size: 11 } } },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = Number(context.raw || 0);
            const percentage = totals.current ? (value / totals.current) * 100 : 0;
            return ` ${context.label}: ${percentage.toFixed(1)}%`;
          },
        },
      },
    },
  };

  return (
    <div className="page-section summary-page">
      <div className="page-section-header">
        <div>
          <span className="page-eyebrow">OVERVIEW</span>
          <h2>Hi, {user?.full_name || user?.name || "User"}</h2>
          <p>Your TradeNova portfolio at a glance.</p>
        </div>
        <button className="secondary-action" type="button" onClick={loadHoldings}>Refresh</button>
      </div>

      {error && <div className="inline-error">{error}</div>}

      {loading ? (
        <div className="page-state">Loading portfolio...</div>
      ) : (
        <>
          <div className="summary-strip summary-strip-large">
            <div><span>Portfolio Value</span><strong>₹{totals.current.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</strong></div>
            <div><span>Investment</span><strong>₹{totals.investment.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</strong></div>
            <div><span>P&amp;L</span><strong className={totals.pnl >= 0 ? "profit" : "loss"}>{totals.pnl >= 0 ? "+" : "-"}₹{Math.abs(totals.pnl).toLocaleString("en-IN", { maximumFractionDigits: 0 })}</strong></div>
            <div><span>Return</span><strong className={totals.pct >= 0 ? "profit" : "loss"}>{totals.pct >= 0 ? "+" : ""}{totals.pct.toFixed(2)}%</strong></div>
          </div>

          {holdings.length > 0 ? (
            <div className="summary-chart-grid">
              <div className="chart-card summary-doughnut-card">
                <h3>Portfolio Allocation</h3>
                <p>Current-value allocation across your holdings.</p>
                <Doughnut data={doughnutData} options={doughnutOptions} />
              </div>

              <div className="chart-card">
                <h3>Portfolio Snapshot</h3>
                <p>Current values returned by your holdings service.</p>
                <div className="snapshot-list">
                  {holdings.slice(0, 8).map((stock) => {
                    const value = Number(stock.price || 0) * Number(stock.qty || 0);
                    const weight = totals.current ? (value / totals.current) * 100 : 0;
                    return (
                      <div className="snapshot-row" key={stock._id || stock.name}>
                        <strong>{stock.name}</strong>
                        <div className="snapshot-progress"><span style={{ width: `${weight}%` }} /></div>
                        <span>{weight.toFixed(1)}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-page-state">No holdings found yet.</div>
          )}
        </>
      )}
    </div>
  );
};

export default Summary;
