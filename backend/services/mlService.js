const ML_SERVICE_URL = process.env.ML_SERVICE_URL;

if (!ML_SERVICE_URL) {
    throw new Error(
        "ML_SERVICE_URL is not defined in environment variables"
    );
};

// Batch ML risk cache

let batchRiskCache = null;
let batchRiskCacheTime = 0;

// Cache batch ML results for 5 minutes.
const BATCH_RISK_CACHE_TTL = 5 * 60 * 1000;


// Single stock risk

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


// Batch risk

const getBatchRisk = async () => {
    const now = Date.now();

    // Return cached result if it is still fresh.
    if (
        batchRiskCache !== null &&
        now - batchRiskCacheTime < BATCH_RISK_CACHE_TTL
    ) {
        return batchRiskCache;
    }

    // Cache expired or doesn't exist → call ML service.
    const response = await fetch(
        `${ML_SERVICE_URL}/api/risk`
    );

    if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
            `ML service error (${response.status}): ${errorText}`
        );
    }

    const data = await response.json();

    // Store fresh result in cache.
    batchRiskCache = data;
    batchRiskCacheTime = Date.now();

    return data;
};

// ML health


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