import React, { useEffect, useState } from "react";
import { useAppContext } from "./context/AppContext";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout/DashboardLayout";
import { getTenantById } from "./APIS/auth";
import TitleBar from "./components/TitleBar";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import { getStats } from "./APIS/settings";
import { DashbaordCardTenant, DashbaordCardTenantCard } from "./components/Reuseable/dashbaordCard";
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import PersonOffOutlinedIcon from '@mui/icons-material/PersonOffOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import RequestQuoteOutlinedIcon from '@mui/icons-material/RequestQuoteOutlined';

import StoreOutlinedIcon from '@mui/icons-material/StoreOutlined';
import DomainDisabledOutlinedIcon from '@mui/icons-material/DomainDisabledOutlined';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import { CircularProgress, Tooltip } from "@mui/material";
import { RecentTransactionTable } from "./components/DashboardLayout/recentTransactionTable";
import { AccountInfo, AccountInfoChart, PackageInfo } from "./components/DashboardLayout/accountInfo";
import { RecentRegisteredTable } from "./components/DashboardLayout/recentTransactionTable";



function Dashboard() {
  const { user, setLoginUser, loginUser } = useAppContext();
  const navigate = useNavigate();
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [passwordElement, setPasswordElement] = useState(false);
  const [password, setPassword] = useState('•••');


  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    const fetchTenant = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getTenantById(user?.Data?.TenantId);
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


  // Helper function to format storage size
  const formatStorageSize = (sizeInMB) => {
    if (sizeInMB >= 1024) {
      return `${(sizeInMB / 1024).toFixed(1)} GB`;
    }
    return `${sizeInMB} MB`;
  };





  const fetchStats = async () => {
    const response = await getStats();
    setStats(response?.data);
  };
  useEffect(() => {
    fetchStats();
  }, []);
  return (
    <DashboardLayout>
      <div class="content-body">
        <TitleBar icon={<HomeOutlinedIcon />} title={'Dashboard'} />
        <div className="container-fluid">

          {loginUser?.Data?.RoleId == 1 ? <div className="row">


            <DashbaordCardTenant total={stats?.TotalTenant} onClick={() => navigate('/tenant')} color="info" title="Total Tenant" icon={<GroupOutlinedIcon style={{ color: "#fff", fontSize: "25px" }} />} />
            <DashbaordCardTenant total={stats?.TotalActiveSubscriptions} onClick={() => navigate('/transaction')} color="dark" textColor="#fff" title="Total Subscriptions" icon={<RequestQuoteOutlinedIcon style={{ color: "#fff", fontSize: "25px" }} />} />
            <DashbaordCardTenant total={`$${stats?.TotalTransactionSum
              }`} onClick={() => navigate('/transaction')} color="success" title="Total Transaction" icon={<PaidOutlinedIcon style={{ color: "#fff", fontSize: "25px" }} />} />
            <DashbaordCardTenantCard total={stats?.TotalTenant} active={stats?.TotalActiveTenant} inactive={stats?.TotalInActiveTenant} title="Total Tenant" icon={<GroupOutlinedIcon style={{ color: "#fff", fontSize: "25px" }} />} />

          </div> :
            <div className="row">
              <DashbaordCardTenant total={stats?.TotalCompanies} onClick={() => navigate('/companies')} color="info" title="Total Companies" icon={<StoreOutlinedIcon style={{ color: "#fff", fontSize: "25px" }} />} />

              <DashbaordCardTenant total={`$${stats?.TotalTransactionSum}`} onClick={() => navigate('/transaction')} color="dark" textColor="#fff" title="Total Transactions" icon={<PaidOutlinedIcon style={{ color: "#fff", fontSize: "25px" }} />} />
            </div>}
          <div className="row">
            <AccountInfo
              loading={loading}
              error={error}
              tenant={tenant}
              loginUser={loginUser}
              password={password}
              setPassword={setPassword}
              passwordElement={passwordElement}
              setPasswordElement={setPasswordElement}
            />
            <RecentTransactionTable
              loading={loading}
              stats={stats}
            />

            {loginUser?.Data?.RoleId == 1 && <RecentRegisteredTable
              loading={loading}
              stats={stats}
            />}
          </div>

          {/* Tenant and Package Information Side by Side */}
          <div className="row">
            <PackageInfo
              loading={loading}
              error={error}
              tenant={tenant}
              loginUser={loginUser}
              password={password}
              setPassword={setPassword}
              passwordElement={passwordElement}
              setPasswordElement={setPasswordElement}
            />
            {loginUser?.Data?.RoleId != 1 && <AccountInfoChart
              loading={loading}
              error={error}
              tenant={tenant}
              loginUser={loginUser}
              password={password}
              setPassword={setPassword}
              passwordElement={passwordElement}
              setPasswordElement={setPasswordElement}
            />}


          </div>

        </div>
      </div>

    </DashboardLayout>
  );
}

export default Dashboard;
