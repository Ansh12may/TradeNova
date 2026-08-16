const {
  getPortfolioRisk,
} = require("../services/portfolioRiskService");

const getPortfolioRiskData = async (
  req,
  res
) => {
  try {
    const data =
      await getPortfolioRisk();

    return res.status(200).json(data);

  } catch (error) {
    console.error(
      "Portfolio risk controller error:",
      error.message
    );

    return res.status(502).json({
      message:
        "Unable to calculate portfolio risk",
      error: error.message,
    });
  }
};

module.exports = {
  getPortfolioRiskData,
};