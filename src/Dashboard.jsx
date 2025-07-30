import React, { useEffect, useState } from "react";
import { useAppContext } from "./context/AppContext";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout/DashboardLayout";
import { getTenantById } from "./APIS/auth";
function Dashboard() {
  const { user, logout,loginUser } = useAppContext();
  const navigate = useNavigate();
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


useEffect(() => {
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchTenant = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getTenantById(user?.Data?.TenantId, user.token.data);

      if (!data.error) {
        setTenant(data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (user?.Data?.TenantId) {
    fetchTenant();
  }
}, []);


  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleGetStarted = () => {
    // Example: scroll to tenant info or navigate
    const infoSection = document.getElementById("tenant-info-section");
    if (infoSection) {
      infoSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <DashboardLayout onLogout={handleLogout}>
      <div
        style={{
          minHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          // background: '#f7f7f7',
          padding: "0 0",
        }}
      >
        <div
          style={{
            // background: '#fff',
            borderRadius: "12px",
            // boxShadow: '0 4px 16px rgba(0,0,0,0.07)',
            padding: "40px 32px",
            maxWidth: "600px",
            width: "100%",
            textAlign: "center",
          }}
        >
          <h1 style={{ fontWeight: 600, fontSize: "2rem", marginBottom: 12 }}>
            Welcome to your Dashboard!
          </h1>
          <p style={{ color: "#666", fontSize: "1.1rem", marginBottom: 28 }}>
            Here’s your tenant information:
          </p>
          <div style={{ marginBottom: "12px" }}>
            <strong>Name:</strong> {loginUser?.Data?.CompanyName }
          </div>
          {loginUser?.Data?.SubDomain ? (
            <button
              onClick={() =>
                window.open(
                  `https://${loginUser?.Data?.SubDomain}.earthcoapp.com`,
                  "_blank",
                  "noopener,noreferrer"
                )
              }
              style={{
                background: "#7b9b43",
                color: "#fff",
                border: "none",
                borderRadius: "22px",
                padding: "12px 32px",
                fontSize: "1rem",
                fontWeight: 500,
                cursor: "pointer",
                boxShadow: "0 2px 6px rgba(25, 118, 210, 0.08)",
                marginBottom: 8,
                transition: "background 0.2s",
              }}
            >
              Sub Domain
            </button>
          ) : (
            ""
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
