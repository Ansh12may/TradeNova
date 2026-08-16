const express = require("express");
const {getRisk, getBatchRiskData} = require("../controllers/mlController");
const authMiddleware = require("../middlewares/authMiddleware");
const {getPortfolioRiskData} = require("../controllers/portfolioRiskController");
const router = express.Router();
const { checkMLHealth } = require("../services/mlService");

router.get("/health", async (req, res) => {
    try {
        const data = await checkMLHealth();
        res.json({
            status: "ok",
            ml: data,
        });
    } catch (error) {
        console.error("ML health check failed:", error.message);
        res.status(503).json({
            status: "unavailable",
            message: "ML service is currently unavailable",
        });
    }
});

router.get("/risk/:ticker", authMiddleware,getRisk);
router.get("/risk",authMiddleware,getBatchRiskData);
router.get("/portfolio-risk",authMiddleware,getPortfolioRiskData);

module.exports = router;