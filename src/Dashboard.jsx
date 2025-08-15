import React, { useEffect, useState } from "react";
import { useAppContext } from "./context/AppContext";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout/DashboardLayout";
import { getTenantById } from "./APIS/auth";
import TitleBar from "./components/TitleBar";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import { getStats } from "./APIS/settings";
import { DashbaordCardCompany, DashbaordCardTransaction } from "./components/Reuseable/dashbaordCard";
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import PersonOffOutlinedIcon from '@mui/icons-material/PersonOffOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import StoreOutlinedIcon from '@mui/icons-material/StoreOutlined';
import DomainDisabledOutlinedIcon from '@mui/icons-material/DomainDisabledOutlined';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
// Custom styles for the tenant table
const tenantTableStyles = {
  tableHeader: {
    backgroundColor: '#f8f9fa',
    borderBottom: '2px solid #dee2e6',
    fontWeight: '600',
    color: '#495057',
    textTransform: 'uppercase',
    fontSize: '0.875rem',
    letterSpacing: '0.5px',

  },
  sectionHeader: {
    backgroundColor: '#e3f2fd',
    borderLeft: '4px solid #7b9b43',
    fontWeight: '600',
    color: '#7b9b43',
    fontSize: '1rem'
  },
  fieldName: {
    fontWeight: '600',
    color: '#495057',
    backgroundColor: '#f8f9fa',
    borderRight: '1px solid #dee2e6'
  },
  statusCell: {
    textAlign: 'center',
    verticalAlign: 'middle'
  },
  badge: {
    fontSize: '0.75rem',
    fontWeight: '500',
    padding: '0.375rem 0.75rem'
  },
  code: {
    backgroundColor: '#f1f3f4',
    color: '#d73a49',
    padding: '0.25rem 0.5rem',
    borderRadius: '0.25rem',
    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
    fontSize: '0.875rem'
  },
  link: {
    color: '#7b9b43',
    textDecoration: 'none',
    fontWeight: '500'
  },
  linkHover: {
    color: '#0056b3',
    textDecoration: 'underline'
  }
};

function Dashboard() {
  const { user, setLoginUser, loginUser } = useAppContext();
  console.log("🚀 ~ Dashboard ~ loginUser:", loginUser)
  const navigate = useNavigate();
  const [tenant, setTenant] = useState(null);
  console.log("🚀 ~ Dashboard ~ tenant:", tenant)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const totalUsers = 5;
  const usedUsers = 3;
  const [passwordElement, setPasswordElement] = useState(false);
  const [password, setPassword] = useState('•••');
  const totalCompanies = 10;
  const usedCompanies = 7;

  const maxStorage = 100; // GB
  const usedStorage = 65; // GB

  const options = {
    chart: {
      type: "bar",
      height: 300
    },
    title: {
      text: "Overall Usage Overview",
      style: { fontSize: "14px" }
    },
    xAxis: {
      categories: ["Users", "Companies", "Storage (GB)"],
      title: { text: null }
    },
    yAxis: {
      min: 0,
      max: 100, // Force y-axis to end at 100
      tickPositions: [0, 20, 40, 60, 80, 100], // Only these ticks will show
      title: { text: "Usage", align: "high" },
      labels: { overflow: "justify" }
    },
    tooltip: {
      pointFormat: "<b>{series.name}</b>: {point.y}"
    },
    plotOptions: {
      series: {
        stacking: "normal",
        dataLabels: {
          enabled: false // remove numbers on bars
        }
      }
    },
    legend: {
      reversed: false
    },
    series: [
      {
        name: "Used",
        data: [usedUsers, usedCompanies, usedStorage],
        color: "#7b9b43"
      },
      {
        name: "Remaining",
        data: [
          totalUsers - usedUsers,
          totalCompanies - usedCompanies,
          maxStorage - usedStorage
        ],
        color: "#FFBF00"
      }
    ]
  };


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

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Helper function to format storage size
  const formatStorageSize = (sizeInMB) => {
    if (sizeInMB >= 1024) {
      return `${(sizeInMB / 1024).toFixed(1)} GB`;
    }
    return `${sizeInMB} MB`;
  };

  // Helper function to get status badge
  const getStatusBadge = (isActive) => {
    return (
      <span className={`badge ${isActive ? 'bg-success' : 'bg-danger'} text-white px-3 py-1`}>
        {isActive ? 'Active' : 'Inactive'}
      </span>
    );
  };

  // Helper function to get expiry status
  const getExpiryStatus = (expiryDate) => {
    if (!expiryDate) return { status: 'unknown', badge: 'bg-secondary' };

    const now = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) {
      return { status: 'Expired', badge: 'bg-danger' };
    } else if (daysUntilExpiry <= 7) {
      return { status: 'Expiring Soon', badge: 'bg-warning' };
    } else {
      return { status: 'Active', badge: 'bg-success' };
    }
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

            <DashbaordCardCompany total={stats?.TotalTenant} activeAmount={stats?.TotalActiveTenant} inactiveAmount={stats?.TotalInActiveTenant}
              onClick={() => navigate('/tenant')} color="info" title=" Tenant" icon={<GroupOutlinedIcon style={{ color: "white", fontSize: "25px" }} />}
              activeIcon={<PermIdentityOutlinedIcon style={{ color: "white", fontSize: "25px" }} />} inactiveIcon={<PersonOffOutlinedIcon style={{ color: "white", fontSize: "25px" }} />} />

            <DashbaordCardTransaction total={`$${stats?.TotalTransactionSum
              }`} onClick={() => navigate('/transaction')} color='dark' title="Total Transaction" icon={<PaidOutlinedIcon style={{ color: "white", fontSize: "35px" }} />} />
          </div> :
            <div className="row">
              <DashbaordCardCompany total={stats?.TotalCompanies} activeAmount={stats?.TotalActiveCompanies} inactiveAmount={stats?.TotalInActiveCompanies} onClick={() => navigate('/companies')} color="info" title="Companies" icon={<StoreOutlinedIcon style={{ color: "white", fontSize: "25px" }} />} activeIcon={<BusinessOutlinedIcon style={{ color: "white", fontSize: "25px" }} />} inactiveIcon={<DomainDisabledOutlinedIcon style={{ color: "white", fontSize: "25px" }} />} />

              <DashbaordCardTransaction total={stats?.TotalTransaction} onClick={() => navigate('/transaction')} color="dark" title="Total Transaction" icon={<PaidOutlinedIcon style={{ color: "white", fontSize: "35px" }} />} />
            </div>}

          {/* Tenant and Package Information Side by Side */}
          <div className="row">
            <div className="col-xl-6">
              <div className="card shadow-sm">
                <div className="card-header border-0 pb-0 " style={{ backgroundColor: "#7b9b43", color: "white" }}>
                  <div className="d-flex align-items-center mb-3" style={{ width: "100%" }}>
                    <h4 className="heading mb-0 me-auto " style={{ color: "white" }}>
                      <i className="fas fa-building me-2 "></i>
                      Account Information
                    </h4>
                  </div>
                </div>
                <div className="card-body p-0">
                  {loading ? (
                    <div className="text-center py-5">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="mt-2 text-muted">Loading tenant information...</p>
                    </div>
                  ) : error ? (
                    <div className="text-center py-5">
                      <div className="alert alert-danger mx-3" role="alert">
                        <i className="fas fa-exclamation-triangle me-2"></i>
                        {error}
                      </div>
                    </div>
                  ) : tenant?.data ? (
                    <div className="table-responsive">
                      <table className="table mb-0" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
                        <thead className="bg-light">
                          <tr>
                            <th style={{ ...tenantTableStyles.tableHeader, width: '200px' }}>Field</th>
                            <th style={tenantTableStyles.tableHeader}>Value</th>
                            <th style={{ ...tenantTableStyles.tableHeader, width: '150px', textAlign: 'center' }}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* Company Information */}
                          <tr>
                            <td colSpan="3" style={tenantTableStyles.sectionHeader}>
                              <i className="fas fa-info-circle me-2"></i>
                              Company Information
                            </td>
                          </tr>
                          <tr>
                            <td style={tenantTableStyles.fieldName}>Company Name</td>
                            <td className="fw-semibold">{tenant.data.CompanyName || '-'}</td>
                            <td style={tenantTableStyles.statusCell}>
                              <span>
                                {getStatusBadge(tenant.data.isActive)}
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td style={tenantTableStyles.fieldName}>Sub Domain</td>
                            <td style={tenantTableStyles.valueCell}>
                              {tenant.data.SubDomain ? (
                                <span style={{ color: '#7b9b43', fontWeight: '600' }}>
                                  {tenant.data.SubDomain}.earthcoapp.com
                                </span>
                              ) : '-'}
                            </td>
                            <td style={tenantTableStyles.statusCell}>{loginUser?.Data?.SubDomain && (
                              <a
                                href={`https://${loginUser?.Data?.SubDomain}.earthcoapp.com`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: "#a5adb5" }}
                                onMouseEnter={(e) => e.currentTarget.style.color = "#7b9b43"}
                                onMouseLeave={(e) => e.currentTarget.style.color = "#a5adb5"}
                              >
                                <i className="fas fa-external-link-alt me-1"></i>
                                Visit Sub Domain
                              </a>
                            )}</td>
                          </tr>
                          <tr>
                            <td style={tenantTableStyles.fieldName}>Admin Email</td>
                            <td className="fw-semibold">admin@gmail.com</td>
                            <td style={tenantTableStyles.statusCell}>
                              -
                            </td>
                          </tr>
                          <tr>
                            <td style={tenantTableStyles.fieldName}>Password</td>
                            <td className="fw-semibold">
                              <span id="password" style={{ display: 'inline-block', marginRight: '10px' }}>{password}</span>
                              <button
                                onClick={() => {
                                  const passwordElement = document.getElementById('password');
                                  if (passwordElement.textContent === '•••') {
                                    setPassword('123');
                                    setPasswordElement(true);
                                  } else {
                                    passwordElement.textContent = '•••';
                                    setPassword('•••');
                                    setPasswordElement(false);
                                  }
                                }}
                                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                              >
                                {!passwordElement ? <Visibility /> : <VisibilityOff />}
                              </button>
                            </td>
                            <td style={tenantTableStyles.statusCell}>
                              -
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-5">
                      <div className="alert alert-info mx-3" role="alert">
                        <i className="fas fa-info-circle me-2"></i>
                        No tenant information available
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {loginUser?.Data?.RoleId != 1 && <div className="col-xl-6">
              <div className="card shadow-sm">
                <div className="card-header border-0 pb-0 " style={{ backgroundColor: "#7b9b43" }}>
                  <div className="d-flex align-items-center justify-content-between mb-3" style={{ width: "100%" }}>
                    <div style={{color:'white'}}>
                      <i className="fas fa-box me-2 " style={{ color: "white" }}></i>
                      Package Information
                   
                    </div>
                   
                  </div>
                </div>
                <div className="card-body p-0">
                  {tenant?.data?.tblUserPackages && tenant.data.tblUserPackages.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table mb-0" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
                        <thead className="bg-light">
                          <tr>
                            <th style={{ ...tenantTableStyles.tableHeader, width: '200px' }}>Field</th>
                            <th style={tenantTableStyles.tableHeader}>Value</th>
                            <th style={{ ...tenantTableStyles.tableHeader, width: '150px', textAlign: 'center' }}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tenant.data.tblUserPackages.map((pkg, index) => (
                            <React.Fragment key={index}>
                              <tr>
                                <td style={tenantTableStyles.fieldName}>Package Name</td>
                                <td style={tenantTableStyles.valueCell}>
                                  <span className="badge bg-info text-white px-3 py-2 " style={tenantTableStyles.badge}>
                                    <i className="fas fa-crown me-1"></i>
                                    {pkg.Name || '-'}
                                  </span>
                                </td>
                                <td style={tenantTableStyles.statusCell}>

                                  <span>
                                    {getStatusBadge(pkg.isActive)}
                                  </span>


                                </td>
                              </tr>
                              <tr>
                                <td style={tenantTableStyles.fieldName}>Package Price</td>
                                <td style={tenantTableStyles.valueCell}>
                                  <span className=" px-2 py-1 fw-semibold" >
                                    ${pkg.Price || '0.00'}
                                  </span>
                                </td>
                                <td style={tenantTableStyles.statusCell}>-</td>
                              </tr>
                              <tr>
                                <td style={tenantTableStyles.fieldName}>Expiry Date</td>
                                <td>
                                  <span className="fw-semibold">
                                    {formatDate(pkg.ExpiryDate)}
                                  </span>
                                </td>
                                <td style={tenantTableStyles.statusCell}>
                                  <span className={`badge ${getExpiryStatus(pkg.ExpiryDate).badge} text-white px-3 py-1 `}>
                                    {getExpiryStatus(pkg.ExpiryDate).status}
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td style={tenantTableStyles.fieldName}>Subscription Date</td>
                                <td className="fw-semibold">{formatDate(pkg.CreatedDate)}</td>
                                <td style={tenantTableStyles.statusCell}>-</td>
                              </tr>

                            </React.Fragment>
                          ))}
                        </tbody>

                      </table>
                      <tr>

                        <td style={tenantTableStyles.valueCell}>
                          {/* <span className=" px-2 py-1 fw-semibold" >
                                   {pkg.MaxUsers || '0'} Users
                                 </span> */}

                          <div style={{ width: "500px", margin: "auto" }}>
                            <HighchartsReact highcharts={Highcharts} options={options} />
                          </div>

                        </td>
                      </tr>
                    </div>
                  ) : (
                    <div className="text-center py-5">
                      <div className="alert alert-info mx-3" role="alert">
                        <i className="fas fa-info-circle me-2"></i>
                        No package information available
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>}
          </div>

        </div>
      </div>

    </DashboardLayout>
  );
}

export default Dashboard;
