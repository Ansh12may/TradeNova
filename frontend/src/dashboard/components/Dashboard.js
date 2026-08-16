import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import WatchList from "./WatchList";
import Summary from "./Summary";
import Orders from "./Orders";
import Holdings from "./Holdings";
import Positions from "./Positions";
import Funds from "./Funds";
import Apps from "./Apps";
import RiskDashboard from "./RiskDashboard";
import TopBar from "./TopBar";
import { GeneralContextProvider } from "./GeneralContext";
import "../styles/dashboard.css";

const Dashboard = () => {
  const location = useLocation();
  const isRiskPage = location.pathname.startsWith("/dashboard/risk");

  return (
    <GeneralContextProvider>
      <div className="dashboard-page">
        <TopBar />

        {isRiskPage ? (
          <main className="risk-page-container">
            <Routes>
              <Route path="risk" element={<RiskDashboard />} />
            </Routes>
          </main>
        ) : (
          <div className="dashboard-container">
            <WatchList />

            <main className="content">
              <Routes>
                <Route index element={<Summary />} />
                <Route path="orders" element={<Orders />} />
                <Route path="holdings" element={<Holdings />} />
                <Route path="positions" element={<Positions />} />
                <Route path="funds" element={<Funds />} />
                <Route path="apps" element={<Apps />} />
                <Route path="*" element={<Summary />} />
              </Routes>
            </main>
          </div>
        )}
      </div>
    </GeneralContextProvider>
  );
};

export default Dashboard;
