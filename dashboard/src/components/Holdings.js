import React, { useState, useEffect } from "react";
import axios from "axios"; 

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Holdings = () => {
  const [allHoldings, setAllHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    
    const token = localStorage.getItem("token");

    axios.get(
  `${process.env.REACT_APP_API_URL}/allHoldings`,
  {
    headers: { Authorization: `Bearer ${token}` },
  })
      .then((res) => {
        setAllHoldings(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching holdings:", err);
        setError("Failed to load holdings. Please login again.");
        setLoading(false);
      });
  }, []);

  //  Chart Data 
  const chartData = {
    labels: allHoldings.map((s) => s.name),
    datasets: [
      {
        label: "Avg Cost (₹)",
        data: allHoldings.map((s) => (s.avg * s.qty).toFixed(2)),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
      {
        label: "Current Value (₹)",
        data: allHoldings.map((s) => (s.price * s.qty).toFixed(2)),
        backgroundColor: allHoldings.map((s) =>
          s.price * s.qty >= s.avg * s.qty
            ? "rgba(75, 192, 92, 0.6)"
            : "rgba(255, 99, 132, 0.6)"
        ),
        borderColor: allHoldings.map((s) =>
          s.price * s.qty >= s.avg * s.qty
            ? "rgba(75, 192, 92, 1)"
            : "rgba(255, 99, 132, 1)"
        ),
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Holdings — Invested vs Current Value",
        font: { size: 14 },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `₹${value.toLocaleString("en-IN")}`,
        },
      },
    },
  };

  // Summary Totals 
  const totalInvestment = allHoldings.reduce(
    (sum, s) => sum + s.avg * s.qty,
    0
  );
  const totalCurrentValue = allHoldings.reduce(
    (sum, s) => sum + s.price * s.qty,
    0
  );
  const totalPnL = totalCurrentValue - totalInvestment;
  const pnlPercent =
    totalInvestment > 0
      ? ((totalPnL / totalInvestment) * 100).toFixed(2)
      : "0.00";

  if (loading) return <p style={{ padding: "1rem" }}>Loading holdings...</p>;
  if (error) return <p style={{ padding: "1rem", color: "red" }}>{error}</p>;

  return (
    <>
      <h3 className="title">Holdings ({allHoldings.length})</h3>

      {/* ─── Chart.js Bar Chart ─────────────────────────────────── */}
      {allHoldings.length > 0 && (
        <div style={{ maxWidth: "700px", margin: "1rem 0 2rem" }}>
          <Bar data={chartData} options={chartOptions} />
        </div>
      )}

      {/* ─── Holdings Table ─────────────────────────────────────── */}
      <div className="order-table">
        <table>
          {/* FIX: Added missing <thead> and <tbody> */}
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg. cost</th>
              <th>LTP</th>
              <th>Cur. val</th>
              <th>P&amp;L</th>
              <th>Net chg.</th>
              <th>Day chg.</th>
            </tr>
          </thead>
          <tbody>
            {allHoldings.map((stock, index) => {
              const curValue = stock.price * stock.qty;
              const invested = stock.avg * stock.qty;
              const isProfit = curValue - invested >= 0;
              const profClass = isProfit ? "profit" : "loss";
              const dayClass = stock.isLoss ? "loss" : "profit";

              return (
                <tr key={index}>
                  <td>{stock.name}</td>
                  <td>{stock.qty}</td>
                  <td>{stock.avg.toFixed(2)}</td>
                  <td>{stock.price.toFixed(2)}</td>
                  <td>{curValue.toFixed(2)}</td>
                  <td className={profClass}>
                    {(curValue - invested).toFixed(2)}
                  </td>
                  <td className={profClass}>{stock.net}</td>
                  <td className={dayClass}>{stock.day}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ─── Summary Row ────────────────────────────────────────── */}
      <div className="row">
        <div className="col">
          <h5>₹{totalInvestment.toFixed(2)}</h5>
          <p>Total investment</p>
        </div>
        <div className="col">
          <h5>₹{totalCurrentValue.toFixed(2)}</h5>
          <p>Current value</p>
        </div>
        <div className="col">
          <h5 className={totalPnL >= 0 ? "profit" : "loss"}>
            {totalPnL >= 0 ? "+" : ""}
            {totalPnL.toFixed(2)} ({totalPnL >= 0 ? "+" : ""}
            {pnlPercent}%)
          </h5>
          <p>P&amp;L</p>
        </div>
      </div>
    </>
  );
};

export default Holdings;