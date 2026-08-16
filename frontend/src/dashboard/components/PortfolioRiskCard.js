import React from "react";
import {
  AlertTriangle,
  ShieldCheck,
  TrendingUp,
  Activity,
} from "lucide-react";

const PortfolioRiskCard = ({
  portfolioRisk,
  loading,
  error,
}) => {
  if (loading) {
    return (
      <section className="portfolio-risk-section">
        <div className="portfolio-risk-loading">
          <div className="portfolio-spinner" />

          <div>
            <strong>Analyzing your portfolio</strong>
            <p>
              Mapping your holdings against the AI risk engine...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="portfolio-risk-section">
        <div className="portfolio-risk-error">
          <AlertTriangle size={22} />

          <div>
            <strong>Portfolio Risk Unavailable</strong>
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  const portfolio = portfolioRisk?.portfolio;

  if (!portfolio) {
    return (
      <section className="portfolio-risk-section">
        <div className="portfolio-empty">
          <ShieldCheck size={24} />

          <h3>No Portfolio Risk Data</h3>

          <p>
            Add holdings to calculate personalized portfolio risk.
          </p>
        </div>
      </section>
    );
  }

  const riskScore = Number(portfolio.riskScore || 0);

  const riskLevel =
    portfolio.riskLevel || "UNKNOWN";

  const portfolioValue =
    Number(portfolio.portfolioValue || 0);

  const totalPnl =
    Number(portfolio.totalPnL || 0);

  const highRiskExposure =
    Number(portfolio.highRiskExposure || 0);

  const holdings =
    portfolioRisk?.holdings || [];

  const getRiskClass = (level) => {
    switch (level) {
      case "VERY HIGH":
        return "portfolio-risk-critical";

      case "HIGH":
        return "portfolio-risk-high";

      case "MODERATE":
        return "portfolio-risk-moderate";

      case "LOW":
        return "portfolio-risk-low";

      default:
        return "";
    }
  };

  const getRiskIcon = (level) => {
    switch (level) {
      case "VERY HIGH":
        return <AlertTriangle size={18} />;

      case "HIGH":
        return <TrendingUp size={18} />;

      case "MODERATE":
        return <Activity size={18} />;

      case "LOW":
        return <ShieldCheck size={18} />;

      default:
        return <Activity size={18} />;
    }
  };

  return (
    <section className="portfolio-risk-section">

      {/* HEADER */}

      <div className="portfolio-risk-header">

        <div>
          <span className="portfolio-eyebrow">
            PERSONALIZED RISK
          </span>

          <h2>
            My Portfolio Risk
          </h2>

          <p>
            Risk exposure calculated from your actual
            holdings and TradeNova's ML risk engine.
          </p>
        </div>

        <div
          className={`portfolio-risk-status ${getRiskClass(
            riskLevel
          )}`}
        >
          {getRiskIcon(riskLevel)}
          {riskLevel}
        </div>

      </div>


      {/* SUMMARY */}

      <div className="portfolio-risk-summary">

        {/* SCORE */}

        <div className="portfolio-score-card">

          <div className="portfolio-score-label">
            Portfolio Risk Score
          </div>

          <div className="portfolio-score-value">
            {riskScore}
            <span>/100</span>
          </div>

          <div className="portfolio-score-bar">

            <div
              className={`portfolio-score-fill ${getRiskClass(
                riskLevel
              )}`}
              style={{
                width: `${Math.min(
                  Math.max(riskScore, 0),
                  100
                )}%`,
              }}
            />

          </div>

          <div
            className={`portfolio-score-level ${getRiskClass(
              riskLevel
            )}`}
          >
            {getRiskIcon(riskLevel)}
            {riskLevel}
          </div>

        </div>


        {/* VALUE */}

        <div className="portfolio-metric-card">

          <span>
            Portfolio Value
          </span>

          <strong>
            ₹
            {portfolioValue.toLocaleString(
              "en-IN",
              {
                maximumFractionDigits: 0,
              }
            )}
          </strong>

          <small>
            Current market value
          </small>

        </div>


        {/* PNL */}

        <div className="portfolio-metric-card">

          <span>
            Total P&L
          </span>

          <strong
            className={
              totalPnl >= 0
                ? "pnl-positive"
                : "pnl-negative"
            }
          >
            {totalPnl >= 0 ? "+" : "-"}₹
            {Math.abs(totalPnl).toLocaleString(
              "en-IN",
              {
                maximumFractionDigits: 0,
              }
            )}
          </strong>

          <small>
            Overall portfolio performance
          </small>

        </div>


        {/* EXPOSURE */}

        <div className="portfolio-metric-card">

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

      <div className="portfolio-holdings">

        <div className="portfolio-holdings-header">

          <div>
            <h3>
              Risk of My Holdings
            </h3>

            <p>
              ML risk mapped against your actual
              portfolio exposure.
            </p>
          </div>

          <ShieldCheck size={20} />

        </div>


        {holdings.length === 0 ? (

          <div className="portfolio-empty-holdings">
            No holdings available.
          </div>

        ) : (

          <div className="portfolio-holdings-list">

            {holdings.map((holding) => {

              const score =
                Number(
                  holding.riskScore ||
                  holding.risk_score ||
                  0
                );

              const level =
                holding.riskLevel ||
                holding.risk_level ||
                "UNKNOWN";

              const weight =
                Number(
                  holding.portfolioWeight ||
                  holding.portfolio_weight ||
                  0
                );

              const value =
                Number(
                  holding.currentValue ||
                  holding.current_value ||
                  0
                );

              const quantity =
                Number(
                  holding.quantity ||
                  holding.qty ||
                  0
                );

              const ticker =
                holding.Ticker ||
                holding.ticker ||
                holding.symbol ||
                holding.name;

              return (
                <div
                  className="portfolio-holding-row"
                  key={ticker}
                >

                  <div className="holding-stock">

                    <strong>
                      {ticker}
                    </strong>

                    <span>
                      {quantity} shares
                    </span>

                  </div>


                  <div className="holding-value">

                    <span>
                      Current Value
                    </span>

                    <strong>
                      ₹
                      {value.toLocaleString(
                        "en-IN",
                        {
                          maximumFractionDigits: 0,
                        }
                      )}
                    </strong>

                  </div>


                  <div className="holding-weight">

                    <span>
                      Portfolio Weight
                    </span>

                    <strong>
                      {weight.toFixed(1)}%
                    </strong>

                  </div>


                  <div className="holding-risk-score">

                    <span>
                      Risk Score
                    </span>

                    <strong>
                      {score}
                    </strong>

                  </div>


                  <div
                    className={`holding-risk-badge ${getRiskClass(
                      level
                    )}`}
                  >

                    {getRiskIcon(level)}

                    {level}

                  </div>

                </div>
              );
            })}

          </div>

        )}

      </div>

    </section>
  );
};

export default PortfolioRiskCard;