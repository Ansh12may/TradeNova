const express = require("express");
const {getRisk, getBatchRiskData} = require("../controllers/mlController");
const authMiddleware = require("../middlewares/authMiddleware");
const {getPortfolioRiskData} = require("../controllers/portfolioRiskController");
const router = express.Router();

router.get("/risk/:ticker", authMiddleware,getRisk);
router.get("/risk",authMiddleware,getBatchRiskData);
router.get("/portfolio-risk",authMiddleware,getPortfolioRiskData);

module.exports = router;