const {getStockRisk,getBatchRisk} = require("../services/mlService");

const getRisk = async (req, res) => {
    try {
        const { ticker } = req.params;
        if (!ticker) {
            return res.status(400).json({
                message: "Ticker is required",
            });
        }
        const riskData = await getStockRisk(ticker);
        return res.status(200).json(riskData);
    } catch (error) {
        console.error(
            "ML risk controller error:",
            error.message
        );
        return res.status(502).json({
            message: "ML service unavailable",
            error: error.message,
        });
    }
};




const getBatchRiskData = async (req, res) => {
    try {
        const riskData = await getBatchRisk();
        return res.status(200).json(riskData);

    } catch (error) {
        console.error(
            "ML batch risk controller error:",
            error.message
        );
        return res.status(502).json({
            message: "ML service unavailable",
            error: error.message,
        });

    }

};

module.exports = {getRisk,getBatchRiskData};