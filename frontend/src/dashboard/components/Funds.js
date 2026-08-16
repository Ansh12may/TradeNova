import React, { useState } from "react";
import { ArrowDownToLine, ArrowUpFromLine, WalletCards } from "lucide-react";

const Funds = () => {
  const [notice, setNotice] = useState("");

  const showUnavailable = (action) => {
    setNotice(
      `${action} is not wired to a backend funds/wallet endpoint yet. The current backend exposes order, holdings and positions APIs, but no deposit/withdraw API.`
    );
  };

  return (
    <div className="page-section funds-page">
      <div className="page-section-header">
        <div>
          <span className="page-eyebrow">ACCOUNT</span>
          <h2>Funds</h2>
          <p>Cash and margin management for your trading account.</p>
        </div>
      </div>

      <div className="funds-grid">
        <div className="funds-card">
          <span>Available cash</span>
          <strong>—</strong>
          <small>Waiting for funds API</small>
        </div>
        <div className="funds-card">
          <span>Used margin</span>
          <strong>—</strong>
          <small>Waiting for funds API</small>
        </div>
        <div className="funds-card">
          <span>Available margin</span>
          <strong>—</strong>
          <small>Waiting for funds API</small>
        </div>
      </div>

      <div className="funds-actions">
        <button type="button" className="fund-action" onClick={() => showUnavailable("Add funds")}>
          <ArrowDownToLine size={18} />
          Add funds
        </button>
        <button type="button" className="fund-action secondary" onClick={() => showUnavailable("Withdraw")}> 
          <ArrowUpFromLine size={18} />
          Withdraw
        </button>
      </div>

      {notice && <div className="funds-notice">{notice}</div>}
    </div>
  );
};

export default Funds;
