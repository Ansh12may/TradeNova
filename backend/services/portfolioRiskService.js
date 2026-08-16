const { HoldingModel } = require("../models/HoldingModel");
const { getBatchRisk } = require("./mlService");

const normalizeTicker = (name) => {
  if (!name) return null;

  const ticker = String(name).trim().toUpperCase();

  // Already contains exchange suffix
  if (ticker.includes(".")) {
    return ticker;
  }

  return `${ticker}.NS`;
};

const getRiskLevel = (score) => {
  if (score >= 75) return "VERY HIGH";
  if (score >= 50) return "HIGH";
  if (score >= 25) return "MODERATE";
  return "LOW";
};

const getPortfolioRisk = async () => {
  // ---------------------------------------------------------
  // 1. Get user's holdings
  // ---------------------------------------------------------

  const holdings = await HoldingModel.find({});

  // ---------------------------------------------------------
  // 2. Get ML risk data
  // ---------------------------------------------------------

  const mlData = await getBatchRisk();

  const riskStocks = mlData.stocks || [];

  // ---------------------------------------------------------
  // 3. Create quick ML lookup
  // ---------------------------------------------------------

  const riskMap = new Map();

  riskStocks.forEach((stock) => {
    if (stock.Ticker) {
      riskMap.set(
        String(stock.Ticker).toUpperCase(),
        stock
      );
    }
  });

  // ---------------------------------------------------------
  // 4. Match holdings with ML risk
  // ---------------------------------------------------------

  const portfolioHoldings = holdings.map((holding) => {
    const ticker = normalizeTicker(holding.name);

    const mlRisk = riskMap.get(ticker);

    const quantity = Number(holding.qty) || 0;
    const currentPrice = Number(holding.price) || 0;
    const averagePrice = Number(holding.avg) || 0;

    const currentValue = quantity * currentPrice;
    const investedValue = quantity * averagePrice;

    const riskScore = mlRisk
      ? Number(mlRisk.risk_score) || 0
      : 0;

    const riskLevel = mlRisk
      ? mlRisk.risk_level
      : "UNKNOWN";

    return {
      ticker,
      name: holding.name,

      quantity,

      averagePrice,
      currentPrice,

      investedValue,
      currentValue,

      riskScore,
      riskLevel,

      volatilityForecast:
        mlRisk?.volatility_forecast ?? null,

      volatilityRisk:
        mlRisk?.volatility_risk ?? null,

      anomalyLevel:
        mlRisk?.anomaly_level ?? null,

      anomalyScore:
        mlRisk?.anomaly_score ?? null,

      behavioralType:
        mlRisk?.behavioral_type ?? null,

      behavioralCluster:
        mlRisk?.behavioral_cluster ?? null,

      mlAvailable: Boolean(mlRisk),
    };
  });

  // ---------------------------------------------------------
  // 5. Calculate total portfolio value
  // ---------------------------------------------------------

  const totalCurrentValue = portfolioHoldings.reduce(
    (sum, holding) =>
      sum + holding.currentValue,
    0
  );

  const totalInvestedValue = portfolioHoldings.reduce(
    (sum, holding) =>
      sum + holding.investedValue,
    0
  );

  // ---------------------------------------------------------
  // 6. Calculate portfolio weights
  // ---------------------------------------------------------

  const enrichedHoldings = portfolioHoldings.map(
    (holding) => {
      const portfolioWeight =
        totalCurrentValue > 0
          ? (holding.currentValue /
              totalCurrentValue) *
            100
          : 0;

      return {
        ...holding,

        portfolioWeight,

        weightedRiskContribution:
          (holding.riskScore *
            portfolioWeight) /
          100,
      };
    }
  );

  // ---------------------------------------------------------
  // 7. Calculate weighted portfolio risk
  // ---------------------------------------------------------

  const portfolioRiskScore =
    totalCurrentValue > 0
      ? enrichedHoldings.reduce(
          (sum, holding) =>
            sum +
            holding.weightedRiskContribution,
          0
        )
      : 0;

  // ---------------------------------------------------------
  // 8. Risk exposure
  // ---------------------------------------------------------

  const highRiskExposure =
    totalCurrentValue > 0
      ? enrichedHoldings
          .filter(
            (holding) =>
              holding.riskScore >= 50
          )
          .reduce(
            (sum, holding) =>
              sum + holding.portfolioWeight,
            0
          )
      : 0;

  const veryHighRiskExposure =
    totalCurrentValue > 0
      ? enrichedHoldings
          .filter(
            (holding) =>
              holding.riskScore >= 75
          )
          .reduce(
            (sum, holding) =>
              sum + holding.portfolioWeight,
            0
          )
      : 0;

  // ---------------------------------------------------------
  // 9. Portfolio P&L
  // ---------------------------------------------------------

  const totalPnL =
    totalCurrentValue -
    totalInvestedValue;

  const pnlPercentage =
    totalInvestedValue > 0
      ? (totalPnL /
          totalInvestedValue) *
        100
      : 0;

  // ---------------------------------------------------------
  // 10. Final response
  // ---------------------------------------------------------

  return {
    portfolio: {
      riskScore: Number(
        portfolioRiskScore.toFixed(2)
      ),

      riskLevel:
        getRiskLevel(
          portfolioRiskScore
        ),

      totalCurrentValue: Number(
        totalCurrentValue.toFixed(2)
      ),

      totalInvestedValue: Number(
        totalInvestedValue.toFixed(2)
      ),

      totalPnL: Number(
        totalPnL.toFixed(2)
      ),

      pnlPercentage: Number(
        pnlPercentage.toFixed(2)
      ),

      holdingsCount:
        enrichedHoldings.length,

      highRiskExposure: Number(
        highRiskExposure.toFixed(2)
      ),

      veryHighRiskExposure:
        Number(
          veryHighRiskExposure.toFixed(2)
        ),
    },

    holdings: enrichedHoldings,
  };
};

module.exports = {
  getPortfolioRisk,
};