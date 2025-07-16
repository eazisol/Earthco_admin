import React, { useState } from "react";
import Box from "@mui/material/Box";
import DashboardIcon from "@mui/icons-material/Dashboard";
import logo from "../../assets/img/favicon.svg";
import "./dashboard.css";

import Sidebar from "../Sidebar";
import Topbar from "../Topbar";
export default function DashboardLayout({ children, onLogout }) {
  const [open, setOpen] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const handleDrawerToggle = () => {
    setOpen(!open);
    setMenuOpen(!menuOpen);
    const wrapper = document.getElementById("main-wrapper-dashboard");
    if (wrapper) {
      wrapper.classList.toggle("menu-toggle");
    }
  };
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", background: "#f4f6f8" }}>
      <div
        id="main-wrapper-dashboard"
        className={`show w-100 ${menuOpen ? "menu-toggle" : ""}`}
      >
        <div className="nav-header">
          <img
            src={menuOpen ? logo : logo}
            alt="logo"
            width={70}
            className="sidebar-logo"
            style={{ marginLeft: "22%", marginTop: "4px" }}
          />

          <div className="nav-control">
            <div
              className={`hamburger ${!open ? "is-active" : ""}`}
              onClick={handleDrawerToggle}
            >
              <span className="line"></span>
              <span className="line"></span>
              <span className="line"></span>
            </div>
          </div>
        </div>
        <Topbar />
        <Sidebar  />

        <div>
      {children}
        </div>
      </div>
    </Box>
  );
}
