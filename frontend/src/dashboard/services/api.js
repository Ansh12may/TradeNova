import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";
console.log("TradeNova API URL:", API_URL);
console.log("TradeNova API timeout:", 60000);

const api = axios.create({
  baseURL: API_URL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the current JWT to every protected request.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// A 401 means the session is no longer valid.
// AuthContext listens for this event and clears the session.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      window.dispatchEvent(new Event("auth:logout"));
    }

    return Promise.reject(error);
  }
);

export const getBatchRisk = async () => {
  const response = await api.get("/api/ml/risk");
  return response.data;
};

export const checkMLHealth = async () => {
  const response = await api.get("/api/ml/health");
  return response.data;

};

export const getStockRisk = async (ticker) => {
  if (!ticker) throw new Error("Ticker is required");

  const response = await api.get(
    `/api/ml/risk/${encodeURIComponent(ticker)}`
  );

  return response.data;
};

export const getPortfolioRisk = async () => {
  const response = await api.get("/api/ml/portfolio-risk");
  return response.data;
};

export const getHoldings = async () => {
  const response = await api.get("/allHoldings");
  return response.data;
};

export const getPositions = async () => {
  const response = await api.get("/allPositions");
  return response.data;
};

export const createOrder = async ({ name, qty, price, mode }) => {
  const response = await api.post("/newOrder", {
    name,
    qty: Number(qty),
    price: Number(price),
    mode,
  });

  return response.data;
};

export const getOrders = async () => {
  const response = await api.get("/orders");
  return response.data;
};
export default api;