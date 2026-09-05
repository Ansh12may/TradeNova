const ML_SERVICE_URL = process.env.ML_SERVICE_URL;

if (!ML_SERVICE_URL) {
    throw new Error(
        "ML_SERVICE_URL is not defined in environment variables"
    );
}

// Batch ML risk cache
let batchRiskCache = null;
let batchRiskCacheTime = 0;

// Shared in-flight request.
// This prevents multiple simultaneous requests from triggering
// multiple expensive ML batch calculations.
let batchRiskInFlight = null;

const BATCH_RISK_CACHE_TTL = 5 * 60 * 1000; // 5 minutes


const getStockRisk = async (ticker) => {
    const response = await fetch(
        `${ML_SERVICE_URL}/api/risk/${encodeURIComponent(ticker)}`
    );

    if (!response.ok) {
        const text = await response.text();

        throw new Error(
            `ML service error (${response.status}): ${text}`
        );
    }

    return await response.json();
};


const getBatchRisk = async () => {
    const now = Date.now();

    // 1. Return cached result if it is still valid
    if (
        batchRiskCache !== null &&
        now - batchRiskCacheTime < BATCH_RISK_CACHE_TTL
    ) {
        return batchRiskCache;
    }

    // 2. If another request is already fetching batch data,
    //    wait for that same request instead of starting another one.
    if (batchRiskInFlight !== null) {
        return await batchRiskInFlight;
    }

    // 3. Start a new batch request
    batchRiskInFlight = (async () => {
        try {
            const response = await fetch(
                `${ML_SERVICE_URL}/api/risk`
            );

            if (!response.ok) {
                const text = await response.text();

                throw new Error(
                    `ML service error (${response.status}): ${text}`
                );
            }

            const data = await response.json();

            // 4. Store successful result in cache
            batchRiskCache = data;
            batchRiskCacheTime = Date.now();

            return data;
        } finally {
            // 5. Always clear the in-flight request,
            //    even if ML service fails.
            batchRiskInFlight = null;
        }
    })();

    return await batchRiskInFlight;
};


const checkMLHealth = async () => {
    const response = await fetch(
        `${ML_SERVICE_URL}/health`
    );

    if (!response.ok) {
        throw new Error(
            `ML health check failed (${response.status})`
        );
    }

    return await response.json();
};


module.exports = {
    getStockRisk,
    getBatchRisk,
    checkMLHealth,
};