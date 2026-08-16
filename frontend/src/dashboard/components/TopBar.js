import React from "react";
import Menu from "./Menu";

const TopBar = () => (
  <div className="topbar-container">
    <div className="indices-container">
      <div className="nifty">
        <p className="index">NIFTY 50</p>
        <p className="index-points">—</p>
        <p className="percent">Market feed</p>
      </div>
      <div className="sensex">
        <p className="index">SENSEX</p>
        <p className="index-points">—</p>
        <p className="percent">Market feed</p>
      </div>
    </div>
    <Menu />
  </div>
);

export default TopBar;
