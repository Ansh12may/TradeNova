import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./landing_page/home/HomePage";
import Signup from "./landing_page/sign_up/Signup";
import AboutPage from "./landing_page/about/AboutPage";
import SupportPage from "./landing_page/support/SupportPage";
import ProductPage from "./landing_page/products/ProductPage";
import PricingPage from "./landing_page/pricing/PricingPage";
import Navbar from "./landing_page/Navbar";
import Footer from "./landing_page/Footer";
import NotFound from "./landing_page/NotFound";
import Dashboard from "./dashboard/components/Dashboard";
import { AuthProvider } from "./dashboard/context/AuthContext.js";
import Login from "./dashboard/components/Login";
import ProtectedRoute from "./dashboard/components/ProtectedRoute.js";


// Landing page layout
function LandingLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}


const root = ReactDOM.createRoot(
  document.getElementById("root")
);

root.render(
  <BrowserRouter>
  <AuthProvider>
    <Routes>

      {/* Landing page */}
      <Route
        path="/"
        element={
          <LandingLayout>
            <HomePage />
          </LandingLayout>
        }
      />

      {/* Signup */}
      <Route
        path="/signup"
        element={
          <LandingLayout>
            <Signup />
          </LandingLayout>
        }
      />



      {/* Login */}
      <Route
      path="/login"
      element={<Login />}
      />



      {/* About */}
      <Route
        path="/about"
        element={
          <LandingLayout>
            <AboutPage />
          </LandingLayout>
        }
      />

      {/* Products */}
      <Route
        path="/products"
        element={
          <LandingLayout>
            <ProductPage />
          </LandingLayout>
        }
      />

      {/* Pricing */}
      <Route
        path="/pricing"
        element={
          <LandingLayout>
            <PricingPage />
          </LandingLayout>
        }
      />

      {/* Support */}
      <Route
        path="/support"
        element={
          <LandingLayout>
            <SupportPage />
          </LandingLayout>
        }
      />

      {/* Dashboard */}
      <Route
        path="/dashboard/*"
        element={
        <ProtectedRoute>
        <Dashboard />
        </ProtectedRoute>
      }
      />

      {/* 404 */}
      <Route
        path="*"
        element={<NotFound />}
      />

    </Routes>
    </AuthProvider>
  </BrowserRouter>
);

export default root;