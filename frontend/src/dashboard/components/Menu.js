import React, { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LogOut, UserCircle, Settings, Shield } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Menu = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const close = (event) => {
      if (!menuRef.current?.contains(event.target)) setOpen(false);
    };

    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const name = user?.full_name || user?.name || "User";
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("") || "U";

  const menuItems = [
    { label: "Dashboard", path: "/dashboard", end: true },
    { label: "Orders", path: "/dashboard/orders" },
    { label: "Holdings", path: "/dashboard/holdings" },
    { label: "Positions", path: "/dashboard/positions" },
    { label: "Funds", path: "/dashboard/funds" },
    { label: "Risk", path: "/dashboard/risk" },
    { label: "Apps", path: "/dashboard/apps" },
  ];

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/login", { replace: true });
  };

  return (
    <div className="menu-container">
      <NavLink to="/dashboard" className="dashboard-logo-link" aria-label="TradeNova dashboard">
        <img src="/logo.png" alt="TradeNova" className="logo" />
      </NavLink>

      <div className="menus">
        <ul>
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  isActive ? "menu-link active" : "menu-link"
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <hr />

        <div className="profile" ref={menuRef}>
          <button
            type="button"
            className="profile-trigger"
            onClick={() => setOpen((current) => !current)}
            aria-expanded={open}
          >
            <div className="avatar">{initials}</div>
            <div className="profile-copy">
              <p className="username">{name}</p>
              <span>Account</span>
            </div>
          </button>

          {open && (
            <div className="profile-dropdown">
              <button type="button" onClick={() => setOpen(false)}>
                <UserCircle size={16} />
                Profile
              </button>
              <button type="button" onClick={() => setOpen(false)}>
                <Settings size={16} />
                Settings
              </button>
              <NavLink to="/dashboard/risk" onClick={() => setOpen(false)}>
                <Shield size={16} />
                Risk Intelligence
              </NavLink>
              <div className="profile-dropdown-divider" />
              <button type="button" className="logout-item" onClick={handleLogout}>
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;
