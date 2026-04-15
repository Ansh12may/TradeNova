import React, { useState, useEffect } from "react";
import axios from "axios";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);

// Distinct colors for the doughnut slices
const COLORS = [
  "#387ED1", "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0",
  "#9966FF", "#FF9F40", "#C9CBCF", "#E7E9ED", "#76b041",
  "#f3722c", "#f9c74f", "#90be6d", "#43aa8b", "#577590",
];

const Summary = () => {
  const [holdings, setHoldings] = useState([]);
  const [userName, setUserName] = useState("User");
  const [loadingChart, setLoadingChart] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUserName(parsed.name || "User");
      } catch (_) {}
    }

    if (!token) {
      setLoadingChart(false);
      return;
    }

    axios
      .get("http://localhost:8080/allHoldings", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setHoldings(res.data);
        setLoadingChart(false);
      })
      .catch(() => setLoadingChart(false));
  }, []);

  //  Portfolio Doughnut 
  const totalValue = holdings.reduce((sum, s) => sum + s.price * s.qty, 0);
  const totalInvestment = holdings.reduce((sum, s) => sum + s.avg * s.qty, 0);
  const totalPnL = totalValue - totalInvestment;
  const pnlPct =
    totalInvestment > 0
      ? ((totalPnL / totalInvestment) * 100).toFixed(2)
      : "0.00";

  const doughnutData = {
    labels: holdings.map((s) => s.name),
    datasets: [
      {
        label: "Portfolio Allocation",
        data: holdings.map((s) =>
          ((s.price * s.qty) / (totalValue || 1) * 100).toFixed(2)
        ),
        backgroundColor: holdings.map((_, i) => COLORS[i % COLORS.length]),
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: { position: "right", labels: { boxWidth: 12, font: { size: 11 } } },
      title: {
        display: true,
        text: "Portfolio Allocation (%)",
        font: { size: 13, weight: "bold" },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.label}: ${ctx.parsed}%`,
        },
      },
    },
  };

  // P&L Line Chart (simulated 7-day trend)
  const generateTrend = () => {
    const today = totalPnL;
    const points = [];
    for (let i = 6; i >= 0; i--) {
      // Small random walk around the real P&L for demo purposes
      const delta = (Math.random() - 0.45) * Math.abs(today) * 0.1;
      points.push((today - delta * i).toFixed(2));
    }
    return points;
  };

  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Today"];
  const trendData = generateTrend();

  const lineData = {
    labels,
    datasets: [
      {
        label: "P&L (₹)",
        data: trendData,
        fill: true,
        backgroundColor: "rgba(56,126,209,0.1)",
        borderColor: "#387ED1",
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: "#387ED1",
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Weekly P&L Trend",
        font: { size: 13, weight: "bold" },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (v) => `₹${Number(v).toLocaleString("en-IN")}`,
        },
      },
    },
  };

  return (
    <>
      {/*  Greeting */}
      <div className="username">
        <h6>Hi, {userName}!</h6>
        <hr className="divider" />
      </div>

      {/* Equity Section */}
      <div className="section">
        <span>
          <p>Equity</p>
        </span>
        <div className="data">
          <div className="first">
            <h3>3.74k</h3>
            <p>Margin available</p>
          </div>
          <hr />
          <div className="second">
            <p>
              Margins used <span>0</span>
            </p>
            <p>
              Opening balance <span>3.74k</span>
            </p>
          </div>
        </div>
        <hr className="divider" />
      </div>

      {/* Holdings Section*/}
      <div className="section">
        <span>
          <p>Holdings ({holdings.length})</p>
        </span>
        <div className="data">
          <div className="first">
            <h3 className={totalPnL >= 0 ? "profit" : "loss"}>
              {totalPnL >= 0 ? "+" : ""}
              {Math.abs(totalPnL).toFixed(2)}{" "}
              <small>
                {totalPnL >= 0 ? "+" : "-"}
                {Math.abs(pnlPct)}%
              </small>
            </h3>
            <p>P&amp;L</p>
          </div>
          <hr />
          <div className="second">
            <p>
              Current Value{" "}
              <span>₹{totalValue.toFixed(2)}</span>
            </p>
            <p>
              Investment{" "}
              <span>₹{totalInvestment.toFixed(2)}</span>
            </p>
          </div>
        </div>
        <hr className="divider" />
      </div>

      {/*  Charts */}
      {!loadingChart && holdings.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "24px",
            margin: "20px 0",
          }}
        >
          {/* Doughnut Chart */}
          <div
            style={{
              flex: "1 1 260px",
              maxWidth: "320px",
              background: "#fff",
              borderRadius: "8px",
              padding: "16px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            }}
          >
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>

          {/* Line Chart */}
          <div
            style={{
              flex: "2 1 300px",
              background: "#fff",
              borderRadius: "8px",
              padding: "16px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            }}
          >
            <Line data={lineData} options={lineOptions} />
          </div>
        </div>
      )}

      {loadingChart && (
        <p style={{ color: "#999", fontSize: "13px" }}>Loading charts...</p>
      )}
    </>
  );
};

export default Summary;