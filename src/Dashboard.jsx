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
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import RequestQuoteOutlinedIcon from '@mui/icons-material/RequestQuoteOutlined';
import StoreOutlinedIcon from '@mui/icons-material/StoreOutlined';
import { RecentTransactionTable } from "./components/DashboardLayout/recentTransactionTable";
import { AccountInfo, AccountInfoChart, PackageInfo, WelcomeCard   } from "./components/DashboardLayout/accountInfo";
import { RecentRegisteredTable } from "./components/DashboardLayout/recentTransactionTable";
function Dashboard() {
  const { user, setLoginUser, loginUser } = useAppContext();
  const navigate = useNavigate();
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [passwordElement, setPasswordElement] = useState(false);
  const [password, setPassword] = useState('***');
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
  const formatStorageSize = (sizeInMB) => {
    if (sizeInMB >= 1024) {
      return `${(sizeInMB / 1024).toFixed(1)} GB`;
    }
    return `${sizeInMB} MB`;
  };const fetchStats = async () => {
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
              <WelcomeCard userName={`${loginUser?.Data?.FirstName}!`} />
            <DashbaordCardTenantCard total={stats?.TotalTenant} active={stats?.TotalActiveTenant} inactive={stats?.TotalInActiveTenant} title="Total Tenant" icon={<GroupOutlinedIcon style={{ color: "#7b9b43", fontSize: "25px" }} />} />
            <DashbaordCardTenantCard total={`$${stats?.TotalTransactionSum
                }`} active={stats?.TotalActiveTenant} Active="Paid" Inactive="Unpaid" inactive={stats?.TotalInActiveTenant} title="Transactions" icon={<PaidOutlinedIcon style={{ color: "#7b9b43", fontSize: "25px" }} />} />

          </div> :
            <div className="row">
              <WelcomeCard userName={`${loginUser?.Data?.FirstName}!`} />
              <DashbaordCardTenantCard total={stats?.TotalCompanies} onClick={() => navigate('/companies')} color="info" textColor="#fff" title="Total Companies" icon={<StoreOutlinedIcon style={{ color: "#7b9b43", fontSize: "25px" }} />} />
              <DashbaordCardTenantCard total={`$${stats?.TotalTransactionSum}`} onClick={() => navigate('/transaction')} color="dark" textColor="#fff" title="Transactions" icon={<PaidOutlinedIcon style={{ color: "#7b9b43", fontSize: "25px" }} />} />
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
