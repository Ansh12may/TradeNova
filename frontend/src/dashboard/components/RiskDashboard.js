import React, { useEffect, useMemo, useState } from "react";

import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Brain,
  BriefcaseBusiness,
  CheckCircle2,
  Shield,
  ShieldCheck,
  TrendingUp,
  Zap,
  X,
} from "lucide-react";

import {
  getBatchRisk,
  getStockRisk,
  getPortfolioRisk,
} from "../services/api";

import "../styles/risk-dashboard.css";

const RiskDashboard = () => {
  // ============================================================
  // MARKET RISK
  // ============================================================

  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ============================================================
  // PORTFOLIO RISK
  // ============================================================

  const [portfolioRisk, setPortfolioRisk] = useState(null);
  const [portfolioLoading, setPortfolioLoading] = useState(true);
  const [portfolioError, setPortfolioError] = useState("");

  // ============================================================
  // STOCK DETAIL
  // ============================================================

  const [selectedStock, setSelectedStock] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // ============================================================
  // LOAD MARKET RISK
  // ============================================================

  useEffect(() => {
    const loadRiskData = async () => {
      try {
        setLoading(true);

        const data = await getBatchRisk();

        setStocks(data?.stocks || []);
        setError("");
      } catch (err) {
        console.error("Risk dashboard error:", err);

        setError(
          err?.response?.data?.message ||
            "Unable to load AI risk data."
        );
      } finally {
        setLoading(false);
      }
    };

    loadRiskData();
  }, []);

  // ============================================================
  // LOAD PORTFOLIO RISK
  // ============================================================

  useEffect(() => {
    const loadPortfolioRisk = async () => {
      try {
        setPortfolioLoading(true);

        const data = await getPortfolioRisk();

        console.log("PORTFOLIO RISK RESPONSE:", data);

        setPortfolioRisk(data);
        setPortfolioError("");
      } catch (err) {
        console.error("Portfolio risk error:", err);

        setPortfolioError(
          err?.response?.data?.message ||
            "Unable to load portfolio risk."
        );
      } finally {
        setPortfolioLoading(false);
      }
    };

    loadPortfolioRisk();
  }, []);

  // ============================================================
  // STOCK DETAIL
  // ============================================================

  const handleStockSelect = async (stock) => {
    setSelectedStock(stock);

    try {
      setDetailLoading(true);

      const freshData = await getStockRisk(stock.Ticker);

      setSelectedStock(freshData);
    } catch (err) {
      console.error("Individual risk analysis error:", err);

      // Keep batch result
      setSelectedStock(stock);
    } finally {
      setDetailLoading(false);
    }
  };

  // ============================================================
  // CLOSE MODAL
  // ============================================================

  const closeModal = () => {
    setSelectedStock(null);
    setDetailLoading(false);
  };

  // ============================================================
  // STATISTICS
  // ============================================================

  const statistics = useMemo(() => {
    return {
      total: stocks.length,

      veryHigh: stocks.filter(
        (stock) => stock.risk_level === "VERY HIGH"
      ).length,

      high: stocks.filter(
        (stock) => stock.risk_level === "HIGH"
      ).length,

      moderate: stocks.filter(
        (stock) => stock.risk_level === "MODERATE"
      ).length,

      low: stocks.filter(
        (stock) => stock.risk_level === "LOW"
      ).length,
    };
  }, [stocks]);

  // ============================================================
  // HIGHEST RISK
  // ============================================================

  const highestRisk = useMemo(() => {
    return [...stocks]
      .sort(
        (a, b) =>
          Number(b.risk_score || 0) -
          Number(a.risk_score || 0)
      )
      .slice(0, 5);
  }, [stocks]);

  // ============================================================
  // LOWEST RISK
  // ============================================================

  const lowestRisk = useMemo(() => {
    return [...stocks]
      .sort(
        (a, b) =>
          Number(a.risk_score || 0) -
          Number(b.risk_score || 0)
      )
      .slice(0, 5);
  }, [stocks]);

  // ============================================================
  // RISK HELPERS
  // ============================================================

  const getRiskClass = (level) => {
    switch (level) {
      case "VERY HIGH":
        return "risk-critical";

      case "HIGH":
        return "risk-high";

      case "MODERATE":
        return "risk-moderate";

      case "LOW":
        return "risk-low";

      default:
        return "risk-unknown";
    }
  };

  const getRiskIcon = (level, size = 15) => {
    switch (level) {
      case "VERY HIGH":
        return <AlertTriangle size={size} />;

      case "HIGH":
        return <TrendingUp size={size} />;

      case "MODERATE":
        return <Activity size={size} />;

      case "LOW":
        return <ShieldCheck size={size} />;

      default:
        return <Shield size={size} />;
    }
  };

  const formatNumber = (value, decimals = 0) => {
    const number = Number(value);

    if (!Number.isFinite(number)) {
      return "0";
    }

    return number.toLocaleString("en-IN", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  const formatVolatility = (value) => {
    const number = Number(value);

    if (!Number.isFinite(number)) {
      return "-";
    }

    return number.toFixed(4);
  };

  const getPercentage = (value) => {
    if (!statistics.total) {
      return 0;
    }

    return (value / statistics.total) * 100;
  };

  // ============================================================
  // PORTFOLIO DATA
  // ============================================================

  const portfolio = portfolioRisk?.portfolio;

  const portfolioRiskScore = Number(
    portfolio?.riskScore || 0
  );

  const portfolioRiskLevel =
    portfolio?.riskLevel || "UNKNOWN";

  const portfolioHoldings =
    portfolioRisk?.holdings ||
    portfolio?.holdings ||
    [];

  const portfolioValue = Number(
    portfolio?.totalCurrentValue ??
      portfolio?.portfolioValue ??
      0
  );

  const totalPnL = Number(
    portfolio?.totalPnL || 0
  );

  const pnlPercentage = Number(
    portfolio?.pnlPercentage || 0
  );

  const highRiskExposure = Number(
    portfolio?.highRiskExposure || 0
  );

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="risk-page-loading">
        <div className="risk-loading-card">
          <div className="risk-loader"></div>

          <h2>Running AI Risk Analysis</h2>

          <p>
            V5, V6 and V7 models are analyzing the
            market...
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (error) {
    return (
      <div className="risk-page-loading">
        <div className="risk-error-card">
          <AlertTriangle size={34} />

          <h2>Risk Engine Unavailable</h2>

          <p>{error}</p>
        </div>
      </div>
    );
  }

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="risk-dashboard">

      {/* ====================================================== */}
      {/* PAGE HEADER */}
      {/* ====================================================== */}

      <div className="risk-page-header">

        <div>
          <div className="risk-page-title">
            <div className="risk-page-title-icon">
              <Brain size={24} />
            </div>

            <div>
              <h1>Risk Dashboard</h1>

              <p>
                AI-powered risk intelligence using
                V5, V6 and V7 models
              </p>
            </div>
          </div>
        </div>

        <div className="risk-engine-status">
          <span className="status-dot"></span>

          <div>
            <strong>ML Engine Online</strong>
            <span>Last updated: Just now</span>
          </div>
        </div>

      </div>

      {/* ====================================================== */}
      {/* PERSONALIZED PORTFOLIO RISK */}
      {/* ====================================================== */}

      <section className="portfolio-risk-section">

        <div className="portfolio-section-header">

          <div>
            <span className="section-eyebrow">
              PERSONALIZED RISK
            </span>

            <h2>My Portfolio Risk</h2>

            <p>
              Risk exposure calculated from your
              actual holdings and TradeNova's ML
              risk engine.
            </p>
          </div>

          {!portfolioLoading && portfolio && (
            <div
              className={`portfolio-level-pill ${getRiskClass(
                portfolioRiskLevel
              )}`}
            >
              {getRiskIcon(portfolioRiskLevel, 17)}
              {portfolioRiskLevel}
            </div>
          )}

        </div>

        {/* ---------------------------------------------------- */}
        {/* PORTFOLIO LOADING */}
        {/* ---------------------------------------------------- */}

        {portfolioLoading && (
          <div className="portfolio-loading">
            <div className="small-loader"></div>

            <div>
              <strong>
                Calculating portfolio risk...
              </strong>

              <span>
                Combining your holdings with ML risk
                signals.
              </span>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* PORTFOLIO ERROR */}
        {/* ---------------------------------------------------- */}

        {!portfolioLoading && portfolioError && (
          <div className="portfolio-error">
            <AlertTriangle size={21} />

            <div>
              <strong>
                Portfolio Risk Unavailable
              </strong>

              <p>{portfolioError}</p>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* PORTFOLIO CONTENT */}
        {/* ---------------------------------------------------- */}

        {!portfolioLoading &&
          !portfolioError &&
          portfolio && (
            <>
              <div className="portfolio-overview-grid">

                {/* RISK SCORE */}

                <div className="portfolio-score-card">

                  <div className="score-card-label">
                    Portfolio Risk Score
                  </div>

                  <div className="score-main-row">

                    <div className="portfolio-score-number">
                      {portfolioRiskScore.toFixed(0)}
                      <span>/100</span>
                    </div>

                    <div
                      className={`portfolio-risk-badge ${getRiskClass(
                        portfolioRiskLevel
                      )}`}
                    >
                      {getRiskIcon(
                        portfolioRiskLevel,
                        16
                      )}

                      {portfolioRiskLevel}
                    </div>

                  </div>

                  <div className="portfolio-score-track">
                    <div
                      className={`portfolio-score-progress ${getRiskClass(
                        portfolioRiskLevel
                      )}`}
                      style={{
                        width: `${Math.min(
                          portfolioRiskScore,
                          100
                        )}%`,
                      }}
                    />
                  </div>

                </div>

                {/* PORTFOLIO VALUE */}

                <div className="portfolio-metric-card">

                  <div className="metric-icon blue">
                    <BriefcaseBusiness size={19} />
                  </div>

                  <div className="metric-content">

                    <span>Portfolio Value</span>

                    <strong>
                      ₹{formatNumber(portfolioValue)}
                    </strong>

                    <small>
                      Current market value
                    </small>

                  </div>

                </div>

                {/* P&L */}

                <div className="portfolio-metric-card">

                  <div className="metric-icon green">
                    <TrendingUp size={19} />
                  </div>

                  <div className="metric-content">

                    <span>Total P&L</span>

                    <strong
                      className={
                        totalPnL >= 0
                          ? "pnl-positive"
                          : "pnl-negative"
                      }
                    >
                      {totalPnL >= 0 ? "+" : "-"}₹
                      {formatNumber(
                        Math.abs(totalPnL)
                      )}
                    </strong>

                    <small>
                      {pnlPercentage >= 0
                        ? "+"
                        : ""}
                      {pnlPercentage.toFixed(2)}
                      % overall
                    </small>

                  </div>

                </div>

                {/* HIGH RISK EXPOSURE */}

                <div className="portfolio-metric-card">

                  <div className="metric-icon red">
                    <Shield size={19} />
                  </div>

                  <div className="metric-content">

                    <span>
                      High Risk Exposure
                    </span>

                    <strong>
                      {highRiskExposure.toFixed(1)}%
                    </strong>

                    <small>
                      Of portfolio value
                    </small>

                  </div>

                </div>

                {/* HOLDINGS */}

                <div className="portfolio-metric-card">

                  <div className="metric-icon purple">
                    <BarChart3 size={19} />
                  </div>

                  <div className="metric-content">

                    <span>No. of Holdings</span>

                    <strong>
                      {portfolioHoldings.length}
                    </strong>

                    <small>
                      Stocks
                    </small>

                  </div>

                </div>

              </div>

              {/* ------------------------------------------------ */}
              {/* HOLDINGS RISK TABLE */}
              {/* ------------------------------------------------ */}

              <div className="portfolio-holdings-section">

                <div className="holdings-section-header">

                  <div>
                    <h3>
                      Risk of My Holdings
                    </h3>

                    <p>
                      ML risk mapped against your
                      actual portfolio exposure.
                    </p>
                  </div>

                  <button
                    className="view-holdings-button"
                    type="button"
                  >
                    View all holdings
                    <ArrowRight size={16} />
                  </button>

                </div>

                {portfolioHoldings.length === 0 ? (
                  <div className="empty-holdings">
                    <BriefcaseBusiness size={28} />

                    <strong>
                      No holdings found
                    </strong>

                    <span>
                      Your portfolio risk will appear
                      here once you have holdings.
                    </span>
                  </div>
                ) : (
                  <div className="holdings-table-wrapper">

                    <table className="portfolio-holdings-table">

                      <thead>
                        <tr>
                          <th>Stock</th>
                          <th>Shares</th>
                          <th>Current Value</th>
                          <th>Weight</th>
                          <th>Risk Score</th>
                          <th>Risk Level</th>
                          <th>ML Status</th>
                        </tr>
                      </thead>

                      <tbody>
                        {portfolioHoldings.map(
                          (holding) => {

                            const mlAvailable =
                              holding.mlAvailable;

                            const riskScore = Number(
                              holding.riskScore || 0
                            );

                            return (
                              <tr
                                key={holding.ticker}
                                onClick={() => {
                                  if (!mlAvailable) {
                                    return;
                                  }

                                  handleStockSelect({
                                    Ticker:
                                      holding.ticker,
                                    Date:
                                      new Date().toISOString(),
                                    risk_score:
                                      holding.riskScore,
                                    risk_level:
                                      holding.riskLevel,
                                    volatility_forecast:
                                      holding.volatilityForecast,
                                    volatility_risk:
                                      holding.volatilityRisk,
                                    anomaly_level:
                                      holding.anomalyLevel,
                                    anomaly_score:
                                      holding.anomalyScore,
                                    behavioral_type:
                                      holding.behavioralType,
                                    behavioral_cluster:
                                      holding.behavioralCluster,
                                  });
                                }}
                                className={
                                  mlAvailable
                                    ? "clickable-holding"
                                    : ""
                                }
                              >

                                <td>
                                  <div className="holding-name">
                                    <span className="stock-avatar">
                                      {holding.ticker
                                        ?.replace(
                                          ".NS",
                                          ""
                                        )
                                        .slice(0, 1)}
                                    </span>

                                    <strong>
                                      {holding.ticker}
                                    </strong>
                                  </div>
                                </td>

                                <td>
                                  {formatNumber(
                                    holding.quantity
                                  )}
                                </td>

                                <td>
                                  <strong>
                                    ₹
                                    {formatNumber(
                                      holding.currentValue
                                    )}
                                  </strong>
                                </td>

                                <td>
                                  {Number(
                                    holding.portfolioWeight ||
                                      0
                                  ).toFixed(1)}
                                  %
                                </td>

                                <td>
                                  {mlAvailable ? (
                                    <strong className="holding-score">
                                      {riskScore.toFixed(0)}
                                    </strong>
                                  ) : (
                                    <span className="na-text">
                                      N/A
                                    </span>
                                  )}
                                </td>

                                <td>
                                  {mlAvailable ? (
                                    <span
                                      className={`table-risk-badge ${getRiskClass(
                                        holding.riskLevel
                                      )}`}
                                    >
                                      {getRiskIcon(
                                        holding.riskLevel,
                                        13
                                      )}

                                      {holding.riskLevel}
                                    </span>
                                  ) : (
                                    <span className="table-risk-badge risk-unknown">
                                      ML DATA N/A
                                    </span>
                                  )}
                                </td>

                                <td>
                                  {mlAvailable ? (
                                    <span className="ml-available">
                                      <CheckCircle2
                                        size={14}
                                      />
                                      Available
                                    </span>
                                  ) : (
                                    <span className="ml-unavailable">
                                      Unavailable
                                    </span>
                                  )}
                                </td>

                              </tr>
                            );
                          }
                        )}
                      </tbody>

                    </table>

                  </div>
                )}

              </div>
            </>
          )}

      </section>

      {/* ====================================================== */}
      {/* MARKET RISK */}
      {/* ====================================================== */}

      <section className="market-risk-section">

        <div className="market-section-header">

          <div>
            <span className="section-eyebrow">
              MARKET INTELLIGENCE
            </span>

            <h2>AI Risk Intelligence</h2>

            <p>
              ML-powered market risk analysis using
              V5, V6 and V7 models.
            </p>
          </div>

          <div className="market-engine-status">
            <span className="status-dot"></span>
            ML Engine Online
          </div>

        </div>

        {/* ---------------------------------------------------- */}
        {/* MARKET STAT CARDS */}
        {/* ---------------------------------------------------- */}

        <div className="market-stat-grid">

          <div className="market-stat-card">

            <div className="market-stat-icon blue">
              <Activity size={20} />
            </div>

            <div>
              <span>Total Stocks</span>
              <strong>
                {statistics.total}
              </strong>
            </div>

          </div>

          <div className="market-stat-card">

            <div className="market-stat-icon red">
              <AlertTriangle size={20} />
            </div>

            <div>
              <span>Very High Risk</span>
              <strong>
                {statistics.veryHigh}
              </strong>

              <small>
                {getPercentage(
                  statistics.veryHigh
                ).toFixed(1)}
                %
              </small>
            </div>

          </div>

          <div className="market-stat-card">

            <div className="market-stat-icon orange">
              <TrendingUp size={20} />
            </div>

            <div>
              <span>High Risk</span>
              <strong>
                {statistics.high}
              </strong>

              <small>
                {getPercentage(
                  statistics.high
                ).toFixed(1)}
                %
              </small>
            </div>

          </div>

          <div className="market-stat-card">

            <div className="market-stat-icon yellow">
              <Zap size={20} />
            </div>

            <div>
              <span>Moderate</span>
              <strong>
                {statistics.moderate}
              </strong>

              <small>
                {getPercentage(
                  statistics.moderate
                ).toFixed(1)}
                %
              </small>
            </div>

          </div>

          <div className="market-stat-card">

            <div className="market-stat-icon green">
              <ShieldCheck size={20} />
            </div>

            <div>
              <span>Low Risk</span>
              <strong>
                {statistics.low}
              </strong>

              <small>
                {getPercentage(
                  statistics.low
                ).toFixed(1)}
                %
              </small>
            </div>

          </div>

        </div>

        {/* ---------------------------------------------------- */}
        {/* DISTRIBUTION + HIGHEST + LOWEST */}
        {/* ---------------------------------------------------- */}

        <div className="market-overview-grid">

          {/* DISTRIBUTION */}

          <div className="risk-panel">

            <div className="panel-title">
              <div>
                <h3>Risk Distribution</h3>
                <p>
                  Current universe classification
                </p>
              </div>

              <BarChart3 size={19} />
            </div>

            <div className="distribution-content">

              <div className="distribution-chart">

                <div

    className="distribution-donut"

    style={{

        "--very-high": `${getPercentage(

            statistics.veryHigh

        )}%`,

        "--high": `${getPercentage(

            statistics.high

        )}%`,

        "--moderate": `${getPercentage(

            statistics.moderate

        )}%`,

    }}

>

    <div className="donut-center">

        <strong>

            {statistics.total}

        </strong>

        <span>Total</span>

    </div>

</div>

              </div>

              <div className="distribution-list">

                <div className="distribution-item">
                  <span>
                    <i className="distribution-dot red"></i>
                    Very High
                  </span>

                  <strong>
                    {statistics.veryHigh}
                  </strong>
                </div>

                <div className="distribution-item">
                  <span>
                    <i className="distribution-dot orange"></i>
                    High
                  </span>

                  <strong>
                    {statistics.high}
                  </strong>
                </div>

                <div className="distribution-item">
                  <span>
                    <i className="distribution-dot yellow"></i>
                    Moderate
                  </span>

                  <strong>
                    {statistics.moderate}
                  </strong>
                </div>

                <div className="distribution-item">
                  <span>
                    <i className="distribution-dot green"></i>
                    Low
                  </span>

                  <strong>
                    {statistics.low}
                  </strong>
                </div>

              </div>

            </div>

          </div>

          {/* HIGHEST RISK */}

          <div className="risk-panel">

            <div className="panel-title">
              <div>
                <h3>Highest Risk Stocks</h3>

                <p>
                  Stocks requiring attention
                </p>
              </div>

              <AlertTriangle size={19} />
            </div>

            <div className="rank-list">

              {highestRisk.map(
                (stock, index) => (

                  <div
                    className="rank-list-item"
                    key={stock.Ticker}
                    onClick={() =>
                      handleStockSelect(stock)
                    }
                  >

                    <span className="rank-number">
                      {index + 1}
                    </span>

                    <div className="rank-stock-info">

                      <strong>
                        {stock.Ticker}
                      </strong>

                      <span>
                        Risk Score{" "}
                        {Number(
                          stock.risk_score || 0
                        ).toFixed(0)}
                      </span>

                    </div>

                    <span
                      className={`mini-risk-badge ${getRiskClass(
                        stock.risk_level
                      )}`}
                    >
                      {stock.risk_level}
                    </span>

                  </div>
                )
              )}

            </div>

          </div>

          {/* LOWEST RISK */}

          <div className="risk-panel">

            <div className="panel-title">
              <div>
                <h3>Lower Risk Stocks</h3>

                <p>
                  Comparatively lower model risk
                </p>
              </div>

              <ShieldCheck size={19} />
            </div>

            <div className="rank-list">

              {lowestRisk.map(
                (stock, index) => (

                  <div
                    className="rank-list-item"
                    key={stock.Ticker}
                    onClick={() =>
                      handleStockSelect(stock)
                    }
                  >

                    <span className="rank-number">
                      {index + 1}
                    </span>

                    <div className="rank-stock-info">

                      <strong>
                        {stock.Ticker}
                      </strong>

                      <span>
                        Risk Score{" "}
                        {Number(
                          stock.risk_score || 0
                        ).toFixed(0)}
                      </span>

                    </div>

                    <strong className="low-score">
                      {Number(
                        stock.risk_score || 0
                      ).toFixed(0)}
                    </strong>

                  </div>
                )
              )}

            </div>

          </div>

        </div>

        {/* ---------------------------------------------------- */}
        {/* FULL TABLE */}
        {/* ---------------------------------------------------- */}

        <div className="risk-panel full-risk-table">

          <div className="panel-title">

            <div>
              <h3>AI Risk Ranking</h3>

              <p>
                Deterministic risk output from the
                TradeNova Risk Engine
              </p>
            </div>

            <span className="table-count">
              {stocks.length} stocks
            </span>

          </div>

          <div className="market-table-wrapper">

            <table className="market-risk-table">

              <thead>
                <tr>
                  <th>#</th>
                  <th>Stock</th>
                  <th>Forecast Volatility</th>
                  <th>Volatility Risk</th>
                  <th>Anomaly</th>
                  <th>Behavioral Type</th>
                  <th>Risk Score</th>
                  <th>Risk Level</th>
                </tr>
              </thead>

              <tbody>

                {stocks.map(
                  (stock, index) => (

                    <tr
                      key={stock.Ticker}
                      onClick={() =>
                        handleStockSelect(stock)
                      }
                    >

                      <td className="table-rank">
                        {index + 1}
                      </td>

                      <td>
                        <strong className="table-ticker">
                          {stock.Ticker}
                        </strong>
                      </td>

                      <td>
                        {formatVolatility(
                          stock.volatility_forecast
                        )}
                      </td>

                      <td>

                        <div className="volatility-progress">

                          <div className="progress-track">
                            <div
                              className={`progress-fill ${getRiskClass(
                                stock.risk_level
                              )}`}
                              style={{
                                width: `${Math.min(
                                  Number(
                                    stock.volatility_risk ||
                                      0
                                  ),
                                  100
                                )}%`,
                              }}
                            />
                          </div>

                          <span>
                            {Number(
                              stock.volatility_risk ||
                                0
                            ).toFixed(0)}
                          </span>

                        </div>

                      </td>

                      <td>
                        <span
                          className={
                            stock.anomaly_level ===
                            "NORMAL"
                              ? "anomaly-normal"
                              : "anomaly-warning"
                          }
                        >
                          {stock.anomaly_level}
                        </span>
                      </td>

                      <td>
                        <span className="behavior-type">
                          {stock.behavioral_type}
                        </span>
                      </td>

                      <td>
                        <strong className="table-score">
                          {Number(
                            stock.risk_score || 0
                          ).toFixed(0)}
                        </strong>
                      </td>

                      <td>
                        <span
                          className={`table-risk-badge ${getRiskClass(
                            stock.risk_level
                          )}`}
                        >
                          {getRiskIcon(
                            stock.risk_level,
                            13
                          )}

                          {stock.risk_level}
                        </span>
                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>

        </div>

      </section>

      {/* ====================================================== */}
      {/* METHODOLOGY */}
      {/* ====================================================== */}

      <div className="risk-methodology-banner">

        <div className="methodology-icon">
          <Brain size={20} />
        </div>

        <div>
          <strong>
            How TradeNova calculates risk
          </strong>

          <p>
            V5 forecasts expected volatility. V6
            evaluates whether recent market behavior
            is anomalous. V7 identifies the stock's
            historical behavioral profile. These
            signals are combined by the deterministic
            Risk Engine to produce the final risk score.
          </p>
        </div>

      </div>

      {/* ====================================================== */}
      {/* STOCK DETAIL MODAL */}
      {/* ====================================================== */}

      {selectedStock && (
        <div
          className="stock-risk-overlay"
          onClick={closeModal}
        >

          <div
            className="stock-risk-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <button
              className="modal-close"
              onClick={closeModal}
              aria-label="Close"
            >
              <X size={19} />
            </button>

            {detailLoading && (
              <div className="modal-refreshing">
                <div className="small-loader"></div>
                Running fresh ML inference...
              </div>
            )}

            <div className="modal-header">

              <div>

                <span>
                  AI RISK ANALYSIS
                </span>

                <h2>
                  {selectedStock.Ticker}
                </h2>

                <p>
                  Analysis date:{" "}
                  {selectedStock.Date
                    ? new Date(
                        selectedStock.Date
                      ).toLocaleDateString(
                        "en-IN"
                      )
                    : "N/A"}
                </p>

              </div>

            </div>

            <div className="modal-score-section">

              <div>
                <span>Final Risk Score</span>

                <div className="modal-score">
                  {Number(
                    selectedStock.risk_score || 0
                  ).toFixed(0)}

                  <small>/100</small>
                </div>
              </div>

              <span
                className={`modal-risk-badge ${getRiskClass(
                  selectedStock.risk_level
                )}`}
              >
                {getRiskIcon(
                  selectedStock.risk_level,
                  15
                )}

                {selectedStock.risk_level}
              </span>

            </div>

            <div className="modal-model-grid">

              <div className="modal-model-card">

                <span className="model-version">
                  V5
                </span>

                <h4>
                  Volatility Forecast
                </h4>

                <strong>
                  {formatVolatility(
                    selectedStock.volatility_forecast
                  )}
                </strong>

                <span>
                  Volatility Risk
                </span>

                <b>
                  {Number(
                    selectedStock.volatility_risk ||
                      0
                  ).toFixed(0)}
                  /100
                </b>

              </div>

              <div className="modal-model-card">

                <span className="model-version">
                  V6
                </span>

                <h4>
                  Anomaly Detection
                </h4>

                <strong>
                  {selectedStock.anomaly_level ||
                    "N/A"}
                </strong>

                <span>
                  Anomaly Score
                </span>

                <b>
                  {Number(
                    selectedStock.anomaly_score ||
                      0
                  ).toFixed(4)}
                </b>

              </div>

              <div className="modal-model-card">

                <span className="model-version">
                  V7
                </span>

                <h4>
                  Behavioral Profile
                </h4>

                <strong>
                  Cluster{" "}
                  {selectedStock.behavioral_cluster ??
                    "N/A"}
                </strong>

                <span>
                  Behavioral Type
                </span>

                <b>
                  {selectedStock.behavioral_type ||
                    "N/A"}
                </b>

              </div>

            </div>

            <div className="modal-signals">

              <h3>Risk Signals</h3>

              <div className="signal-row">
                <span>
                  Volatility Signal
                </span>

                <strong>
                  {Number(
                    selectedStock.volatility_risk ||
                      0
                  ).toFixed(0)}
                  /100
                </strong>
              </div>

              <div className="signal-row">
                <span>
                  Anomaly State
                </span>

                <strong>
                  {selectedStock.anomaly_level ||
                    "N/A"}
                </strong>
              </div>

              <div className="signal-row">
                <span>
                  Behavioral Cluster
                </span>

                <strong>
                  {selectedStock.behavioral_cluster ??
                    "N/A"}
                </strong>
              </div>

            </div>

            <div className="modal-methodology">

              <Brain size={18} />

              <div>

                <strong>
                  How TradeNova calculated this risk
                </strong>

                <p>
                  V5 forecasts expected volatility.
                  V6 evaluates whether recent market
                  behavior is anomalous. V7 identifies
                  the stock's historical behavioral
                  profile. These signals are combined
                  by the deterministic Risk Engine to
                  produce the final risk score.
                </p>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default RiskDashboard;