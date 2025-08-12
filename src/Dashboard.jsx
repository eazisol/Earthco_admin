import React, { useEffect, useState } from "react";
import { useAppContext } from "./context/AppContext";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout/DashboardLayout";
import { getTenantById } from "./APIS/auth";
import TitleBar from "./components/TitleBar";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import { getStats } from "./APIS/settings";
import { DashbaordCard } from "./components/Reuseable/dashbaordCard";
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import PersonOffOutlinedIcon from '@mui/icons-material/PersonOffOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
// Custom styles for the tenant table
const tenantTableStyles = {
  tableHeader: {
    backgroundColor: '#f8f9fa',
    borderBottom: '2px solid #dee2e6',
    fontWeight: '600',
    color: '#495057',
    textTransform: 'uppercase',
    fontSize: '0.875rem',
    letterSpacing: '0.5px'
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
  // valueCell: {
  //   backgroundColor: '#ffffff',
  //   color: '#212529'
  // },
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
  const navigate = useNavigate();
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  console.log("🚀 ~ Dashboard ~ stats:", stats)
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
      <span className={`badge ${isActive ? 'bg-success' : 'bg-danger'} text-white px-3 py-1 rounded-pill`}>
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

            <DashbaordCard total={stats?.TotalTenant} color="info" title="Total Tenant" icon={<GroupOutlinedIcon style={{ color: "white", fontSize: "35px" }} />} />
            <DashbaordCard total={stats?.TotalActiveTenant} color='success' title="Active Tenant" icon={<PermIdentityOutlinedIcon style={{ color: "white", fontSize: "35px" }} />} />
            <DashbaordCard total={stats?.TotalInActiveTenant} color='light' title="InActive Tenant" icon={<PersonOffOutlinedIcon style={{ color: "white", fontSize: "35px" }} />} />
            <DashbaordCard total={`$${stats?.TotalTransactionSum
              }`} title="Total Transaction" icon={<PaidOutlinedIcon style={{ color: "white", fontSize: "35px" }} />} />
</div> :
            <div className="row">
              <DashbaordCard total={stats?.TotalCompanies} color="info" title="Total Companies" icon={<GroupOutlinedIcon style={{ color: "white", fontSize: "35px" }} />} />
              <DashbaordCard total={stats?.TotalActiveCompanies} color='success' title="Active Companies" icon={<PermIdentityOutlinedIcon style={{ color: "white", fontSize: "35px" }} />} />
              <DashbaordCard total={stats?.TotalInActiveCompanies} color='light' title="InActive Companies" icon={<PersonOffOutlinedIcon style={{ color: "white", fontSize: "35px" }} />} />
              <DashbaordCard total={stats?.TotalTransaction} title="Total Transaction" icon={<PaidOutlinedIcon style={{ color: "white", fontSize: "35px" }} />} />
            </div>}

          {/* Tenant Information Table */}
          <div className="row">
            <div className="col-xl-12">
              <div className="card shadow-sm">
                <div className="card-header border-0 pb-0 bg-light">
                  <div className="d-flex align-items-center mb-3" style={{ width: "100%" }}>
                    <h4 className="heading mb-0 me-auto text-dark">
                      <i className="fas fa-building me-2 text-primary"></i>
                      Tenant Information
                    </h4>
                    {loginUser?.Data?.SubDomain && (
                      <button
                        onClick={() =>
                          window.open(
                            `https://${loginUser?.Data?.SubDomain}.earthcoapp.com`,
                            "_blank",
                            "noopener,noreferrer"
                          )
                        }
                        className="btn btn-outline-primary btn-sm ms-auto"
                        style={{
                          borderRadius: "22px",
                          padding: "8px 20px",
                          fontSize: "0.875rem",
                          fontWeight: 500,
                          cursor: "pointer",
                          transition: "background 0.2s",
                        }}
                      >
                        <i className="fas fa-external-link-alt me-1"></i>
                        Visit Sub Domain
                      </button>
                    )}
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
                      <table className="table  mb-0" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
                        <thead className="bg-light">
                          <tr>
                            <th style={{ ...tenantTableStyles.tableHeader, width: '200px' }}>Field</th>
                            <th style={tenantTableStyles.tableHeader}>Value</th>
                            <th style={{ ...tenantTableStyles.tableHeader, width: '150px' }}>Status</th>
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
                            <td style={tenantTableStyles.statusCell}>{getStatusBadge(tenant.data.isActive)}</td>
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
                            <td style={tenantTableStyles.statusCell}>-</td>
                          </tr>

                          {/* Contact Information */}
                          <tr>
                            <td colSpan="3" style={tenantTableStyles.sectionHeader}>
                              <i className="fas fa-address-book me-2"></i>
                              Contact Information
                            </td>
                          </tr>
                          <tr>
                            <td style={tenantTableStyles.fieldName}>Full Name</td>
                            <td className="fw-semibold">{`${tenant.data.FirstName || ''} ${tenant.data.LastName || ''}`.trim() || '-'}</td>
                            <td style={tenantTableStyles.statusCell}>-</td>
                          </tr>
                          <tr>
                            <td style={tenantTableStyles.fieldName}>Email Address</td>
                            <td style={tenantTableStyles.valueCell}>
                              <a style={tenantTableStyles.link}>
                                <i className="fas fa-envelope me-1" style={{ color: '#7b9b43' }}></i>
                                {tenant.data.Email || '-'}
                              </a>
                            </td>
                            <td style={tenantTableStyles.statusCell}>-</td>
                          </tr>
                          <tr>
                            <td style={tenantTableStyles.fieldName}>Phone Number</td>
                            <td style={tenantTableStyles.valueCell}>
                              <a style={tenantTableStyles.link}>
                                <i className="fas fa-phone me-1" style={{ color: '#7b9b43' }}></i>
                                {tenant.data.PhoneNo || '-'}
                              </a>
                            </td>
                            <td style={tenantTableStyles.statusCell}>-</td>
                          </tr>

                          {/* Package Information */}
                          {tenant.data.tblUserPackages && tenant.data.tblUserPackages.length > 0 && (
                            <>
                              <tr>
                                <td colSpan="3" style={tenantTableStyles.sectionHeader}>
                                  <i className="fas fa-box me-2"></i>
                                  Package Information
                                </td>
                              </tr>
                              {tenant.data.tblUserPackages.map((pkg, index) => (
                                <React.Fragment key={index}>
                                  <tr>
                                    <td style={tenantTableStyles.fieldName}>Package Name</td>
                                    <td style={tenantTableStyles.valueCell}>
                                      <span className="badge bg-info text-white px-3 py-2 rounded-pill" style={tenantTableStyles.badge}>
                                        <i className="fas fa-crown me-1"></i>
                                        {pkg.Name || '-'}
                                      </span>
                                    </td>
                                    <td style={tenantTableStyles.statusCell}>{getStatusBadge(pkg.isActive)}</td>
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
                                    <td style={tenantTableStyles.fieldName}>Max Users</td>
                                    <td style={tenantTableStyles.valueCell}>
                                      <span className=" px-2 py-1 fw-semibold" >
                                        {pkg.MaxUsers || '0'} Users
                                      </span>
                                    </td>
                                    <td style={tenantTableStyles.statusCell}>-</td>
                                  </tr>
                                  <tr>
                                    <td style={tenantTableStyles.fieldName}>Max Companies</td>
                                    <td style={tenantTableStyles.valueCell}>
                                      <span className=" px-2 py-1 fw-semibold" >
                                        {pkg.MaxCompanies || '0'} Companies
                                      </span>
                                    </td>
                                    <td style={tenantTableStyles.statusCell}>-</td>
                                  </tr>
                                  <tr>
                                    <td style={tenantTableStyles.fieldName}>Storage Limit</td>
                                    <td>
                                      <span className=" px-2 py-1">
                                        <i className="fas fa-hdd me-1"></i>
                                        {formatStorageSize(pkg.MaxStorageMB || 0)}
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
                                      <span className={`badge ${getExpiryStatus(pkg.ExpiryDate).badge} text-white px-2 py-1`}>
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
                            </>
                          )}

                          {/* System Information */}
                          <tr>
                            <td colSpan="3" style={tenantTableStyles.sectionHeader}>
                              <i className="fas fa-cogs me-2"></i>
                              System Information
                            </td>
                          </tr>
                          <tr>
                            <td style={tenantTableStyles.fieldName}>Tenant ID</td>
                            <td>
                              <span className=" px-2 py-1  fw-semibold" >{tenant.data.TenantId || '-'}</span>
                            </td>
                            <td style={tenantTableStyles.statusCell}>-</td>
                          </tr>
                          <tr>
                            <td style={tenantTableStyles.fieldName}>Role ID</td>
                            <td>
                              <span className=" px-2 py-1 fw-semibold">
                                Role {tenant.data.RoleId || '-'}
                              </span>
                            </td>
                            <td style={tenantTableStyles.statusCell}>-</td>
                          </tr>
                          <tr>
                            <td style={tenantTableStyles.fieldName}>Account Status</td>
                            <td>
                              <span className={`badge ${tenant.data.isActive ? 'bg-success' : 'bg-danger'} text-white px-3 py-2`}>
                                <i className={`fas ${tenant.data.isActive ? 'fa-check-circle' : 'fa-times-circle'} me-1`}></i>
                                {tenant.data.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td style={tenantTableStyles.statusCell}>-</td>
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
          </div>

        </div>
      </div>

    </DashboardLayout>
  );
}

export default Dashboard;
