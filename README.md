# TradeNova — ML-Powered Portfolio Risk Engine

TradeNova is an AI/ML-powered portfolio risk analysis platform that uses historical market data, quantitative feature engineering, statistical volatility analysis, and machine learning to estimate stock and portfolio risk.

The primary focus of this project is the **ML risk engine and its production deployment**. The trading dashboard provides the interface through which users interact with the deployed ML system.

##  Live Demo

**TradeNova Frontend:**  
https://tradenova-frontend-b2qs.onrender.com

**Backend API:**  
https://tradenova-backend-7ovk.onrender.com

**ML Service:**  
https://tradenova-ml-service.onrender.com

> The system is deployed as separate frontend, backend, and ML services.

---

##  AI / ML Pipeline

TradeNova follows an end-to-end machine learning pipeline:

```text
Historical Market Data
        ↓
Data Cleaning & Preprocessing
        ↓
Feature Engineering
        ↓
Statistical Volatility Analysis
        ↓
Feature Preparation
        ↓
LightGBM Risk Model
        ↓
Risk Prediction
        ↓
FastAPI Inference Service
        ↓
Backend API
        ↓
Risk Dashboard

