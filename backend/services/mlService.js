
const ML_SERVICE_URL = process.env.ML_SERVICE_URL;

if (!ML_SERVICE_URL) {
    throw new Error(
        "ML_SERVICE_URL is not defined in environment variables"
    );
}

const getStockRisk = async (ticker) => {
    if (!ticker) {
        throw new Error("Ticker is required");
    }
    const response = await fetch(
        `${ML_SERVICE_URL}/api/risk/${encodeURIComponent(ticker)}`
    );
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
            `ML service error (${response.status}): ${errorText}`
        );
    }
    return await response.json();
};



const getBatchRisk = async () => {
    const response = await fetch(
        `${ML_SERVICE_URL}/api/risk`
    );

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
            `ML service error (${response.status}): ${errorText}`
        );

    }
    return await response.json();

};

const checkMLHealth = async () => {
    const response = await fetch(
        `${ML_SERVICE_URL}/health`
    );
    if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
            `ML health check failed (${response.status}): ${errorText}`
        );
    }

    return await response.json();
};

module.exports = {getStockRisk,getBatchRisk,checkMLHealth};