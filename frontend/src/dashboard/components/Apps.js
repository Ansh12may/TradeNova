import React from "react";
import "../styles/app.css";
import {
  BarChart3,
  Brain,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const Apps = () => {
  const apps = [
    {
      icon: <Brain size={22} />,
      title: "AI Risk Engine",
      description:
        "Analyze market and portfolio risk using TradeNova's ML-powered risk intelligence.",
      status: "Connected",
    },
    {
      icon: <BarChart3 size={22} />,
      title: "Market Analytics",
      description:
        "Track market data, stock performance, volatility and portfolio insights.",
      status: "Connected",
    },
    {
      icon: <ShieldCheck size={22} />,
      title: "Portfolio Intelligence",
      description:
        "Understand your holdings through portfolio-level risk and exposure analysis.",
      status: "Connected",
    },
    {
      icon: <Zap size={22} />,
      title: "Trading Tools",
      description:
        "Access watchlists, orders, holdings and positions from one unified workspace.",
      status: "Available",
    },
  ];

  return (
    <div className="apps-page">
      {/* Header */}
      <div className="apps-header">
        <div>
          <span className="apps-eyebrow">TRADENOVA PLATFORM</span>

          <h1>Apps & Integrations</h1>

          <p>
            Explore the tools and intelligence powering your TradeNova
            trading workspace.
          </p>
        </div>

        <div className="apps-status">
          <span className="status-dot"></span>
          Platform Online
        </div>
      </div>

      {/* Hero */}
      <section className="apps-hero">
        <div className="apps-hero-content">
          <div className="apps-hero-icon">
            <Brain size={28} />
          </div>

          <div>
            <h2>Everything you need in one workspace</h2>

            <p>
              TradeNova combines market analytics, portfolio intelligence,
              risk analysis and trading tools into a single platform.
            </p>
          </div>
        </div>
      </section>

      {/* Apps */}
      <section className="apps-section">
        <div className="apps-section-heading">
          <div>
            <h2>TradeNova Services</h2>
            <p>Tools currently available in your workspace.</p>
          </div>
        </div>

        <div className="apps-grid">
          {apps.map((app) => (
            <div className="app-card" key={app.title}>
              <div className="app-card-top">
                <div className="app-icon">{app.icon}</div>

                <span
                  className={
                    app.status === "Connected"
                      ? "app-status connected"
                      : "app-status available"
                  }
                >
                  <CheckCircle2 size={13} />
                  {app.status}
                </span>
              </div>

              <h3>{app.title}</h3>

              <p>{app.description}</p>

              <button type="button" className="app-card-button">
                Explore
                <ArrowRight size={16} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Coming Soon */}
      <section className="apps-coming-soon">
        <div>
          <span className="apps-eyebrow">COMING SOON</span>

          <h2>More integrations are on the way</h2>

          <p>
            TradeNova is designed to become a unified trading intelligence
            platform with additional market data and analytics integrations.
          </p>
        </div>

        <div className="coming-soon-badge">
          <Zap size={17} />
          Expanding Platform
        </div>
      </section>
    </div>
  );
};

export default Apps;