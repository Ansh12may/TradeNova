import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Menu = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [selectedMenu, setSelectedMenu] = useState(0);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const handleMenuClick = (index) => setSelectedMenu(index);

  // was passing setIsProfileDropdownOpen instead of the boolean value
  const handleProfileClick = () => {
    setIsProfileDropdownOpen((prev) => !prev);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuClass = "menu";
  const activeMenuClass = "menu selected";

  // Show first 2 letters of name as avatar (e.g. "Zaid Ullah" → "ZU")
  const avatarText = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <div className="menu-container">
      <img src="logo.png" style={{ width: "50px" }} alt="logo" />
      <div className="menus">
        <ul>
          {[
            { label: "Dashboard", path: "/" },
            { label: "Orders", path: "/orders" },
            { label: "Holdings", path: "/holdings" },
            { label: "Positions", path: "/positions" },
            { label: "Funds", path: "/funds" },
            { label: "Apps", path: "/apps" },
          ].map((item, index) => (
            <li key={index}>
              <Link
                style={{ textDecoration: "none" }}
                to={item.path}
                onClick={() => handleMenuClick(index)}
              >
                <p className={selectedMenu === index ? activeMenuClass : menuClass}>
                  {item.label}
                </p>
              </Link>
            </li>
          ))}
        </ul>

        <hr />

        <div className="profile" onClick={handleProfileClick} style={{ position: "relative" }}>
          <div className="avatar">{avatarText}</div>
          <p className="username">{user?.name || "User"}</p>

          {/*  NEW: Profile dropdown with logout */}
          {isProfileDropdownOpen && (
            <div
              style={{
                position: "absolute",
                top: "40px",
                right: 0,
                background: "#fff",
                border: "1px solid #eee",
                borderRadius: "4px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                zIndex: 100,
                minWidth: "140px",
                padding: "8px 0",
              }}
            >
              <p
                style={{
                  padding: "8px 16px",
                  fontSize: "0.8rem",
                  color: "#666",
                  margin: 0,
                  borderBottom: "1px solid #f1f1f1",
                }}
              >
                {user?.email}
              </p>
              <p
                onClick={handleLogout}
                style={{
                  padding: "10px 16px",
                  fontSize: "0.85rem",
                  color: "#e53935",
                  margin: 0,
                  cursor: "pointer",
                }}
              >
                Logout
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;