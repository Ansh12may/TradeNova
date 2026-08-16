# TradeNova — ML-Powered Portfolio Risk Engine

TradeNova is an AI/ML-powered portfolio analytics and risk analysis platform designed to evaluate stock and portfolio risk using quantitative market features and machine learning models.

The project focuses on building and deploying an end-to-end **ML inference system**, rather than simply creating a stock trading UI.

##  Key Features

-  Stock-level risk analysis
-  Portfolio-level risk assessment
-  Machine learning based risk prediction
-  Technical and statistical market features
-  Dedicated FastAPI ML inference service
-  Node.js backend acting as an API gateway
-  React dashboard for visualizing ML results
-  Production deployment with independent services

---

##  AI / ML Engineering

The core of TradeNova is a separate ML service responsible for risk analysis and inference.

### ML Pipeline

```text
Market Data
    ↓
Data Preprocessing
    ↓
Feature Engineering
    ↓
Statistical / Technical Features
    ↓
ML Risk Model
    ↓
Risk Score / Classification
    ↓
FastAPI Inference API
    ↓
TradeNova Backend
    ↓
Dashboard
