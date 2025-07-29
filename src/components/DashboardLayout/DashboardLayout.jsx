import React, { useState, useEffect, createContext, useContext } from "react";
import Box from "@mui/material/Box";
import DashboardIcon from "@mui/icons-material/Dashboard";
import logo from "../../assets/img/favicon.svg";
import "./dashboard.css";

import Sidebar from "../Sidebar";
import Topbar from "../Topbar";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

// Snackbar context for children
const SnackbarContext = createContext();
export const useSnackbar = () => useContext(SnackbarContext);

export default function DashboardLayout({ children, onLogout }) {
  const [open, setOpen] = useState(true);
  const [menuOpen, setMenuOpen] = useState(null);
  const [isMobile, setIsMobile] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success', duration: 3000 });

  const showSnackbar = (message, severity = 'success', duration = 3000) => {
    setSnackbar({ open: true, message, severity, duration });
  };
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  useEffect(() => {
    // Function to check if screen is mobile/tablet
    const checkMobile = () => {
      if(window.innerWidth <= 900){
        setIsMobile(true);
        setMenuOpen(true);
      }
      if (window.innerWidth > 900) {
        setMenuOpen(false); // Always open on desktop
        setIsMobile(false);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleDrawerToggle = () => {
    setOpen(!open);
    setMenuOpen(!menuOpen);
    const wrapper = document.getElementById("main-wrapper-dashboard");
    if (wrapper) {
      wrapper.classList.toggle("menu-toggle");
    }
  };

  // Example: show a snackbar on mount (remove in production)
  useEffect(() => {
    // showSnackbar('Welcome! This is a demo notification.', 'info');
  }, []);

  return (
    <SnackbarContext.Provider value={showSnackbar}>
      <Box sx={{ display: "flex", minHeight: "100vh", background: "#f4f6f8" }}>
        <div
          id="main-wrapper-dashboard"
          className={`show w-100 ${menuOpen ? "menu-toggle" : ""}`}
        >
          <div className="nav-header position-fixed">
            <img
              src={logo}
              alt="logo"
              width={70}
              className="sidebar-logo"
              style={{ marginLeft: "22%", marginTop: "4px" }}
            />

        {!isMobile&&  <div className="nav-control">
            <div
              className={`hamburger ${menuOpen ? "is-active" : ""}`}
              onClick={handleDrawerToggle}
            >
              <span className="line"></span>
              <span className="line"></span>
              <span className="line"></span>
            </div>
          </div>}
        </div>
        <Topbar />
        <Sidebar />
        {/* Overlay for mobile/tablet when sidebar is open */}
        {isMobile && menuOpen && (
          <div
            className="sidebar-overlay"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0,0,0,0.4)",
              zIndex: 1000,
            }}
            onClick={handleDrawerToggle} // Changed to handleDrawerToggle to close sidebar
          />
        )}
        <div>
          {children}
        </div>
        {/* MUI Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={snackbar.duration}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <MuiAlert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </MuiAlert>
        </Snackbar>
      </div>
    </Box>
    </SnackbarContext.Provider>
  );
}
