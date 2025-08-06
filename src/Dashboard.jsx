import React, { useEffect, useState } from "react";
import { useAppContext } from "./context/AppContext";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout/DashboardLayout";
import { getTenantById } from "./APIS/auth";
import TitleBar from "./components/TitleBar";

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
  const { user, logout,loginUser } = useAppContext();
  const navigate = useNavigate();
  const [tenant, setTenant] = useState(null);
  console.log("🚀 ~ Dashboard ~ tenant:", tenant?.data)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


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


  const handleLogout = () => {
    logout();
    navigate("/");
  };

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

 
  return (
    <DashboardLayout onLogout={handleLogout}>
        <div class="content-body">
      <TitleBar icon={	<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M2.125 6.375L8.5 1.41667L14.875 6.375V14.1667C14.875 14.5424 14.7257 14.9027 14.4601 15.1684C14.1944 15.4341 13.8341 15.5833 13.4583 15.5833H3.54167C3.16594 15.5833 2.80561 15.4341 2.53993 15.1684C2.27426 14.9027 2.125 14.5424 2.125 14.1667V6.375Z" stroke="#2C2C2C" stroke-linecap="round" stroke-linejoin="round"/>
							<path d="M6.375 15.5833V8.5H10.625V15.5833" stroke="#2C2C2C" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>} title={'Dashboard'}/>
      <div className="container-fluid">
        
            {/* <div className="row">
              <div className="col-xl-3 col-sm-6">
                <div className="card chart-grd same-card">
                  <div className="card-body depostit-card p-0">
                    <div className="depostit-card-media d-flex justify-content-between pb-0">
                      <div>
                        <h6>Total Deposit</h6>
                        <h3>$1200.00</h3>
                      </div>
                      <div className="icon-box ">
                        <svg width="12" height="20" viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M11.4642 13.7074C11.4759 12.1252 10.8504 10.8738 9.60279 9.99009C8.6392 9.30968 7.46984 8.95476 6.33882 8.6137C3.98274 7.89943 3.29927 7.52321 3.29927 6.3965C3.29927 5.14147 4.93028 4.69493 6.32655 4.69493C7.34341 4.69493 8.51331 5.01109 9.23985 5.47964L10.6802 3.24887C9.73069 2.6333 8.43112 2.21342 7.14783 2.0831V0H4.49076V2.22918C2.12884 2.74876 0.640949 4.29246 0.640949 6.3965C0.640949 7.87005 1.25327 9.03865 2.45745 9.86289C3.37331 10.4921 4.49028 10.83 5.56927 11.1572C7.88027 11.8557 8.81873 12.2813 8.80805 13.691L8.80799 13.7014C8.80799 14.8845 7.24005 15.3051 5.89676 15.3051C4.62786 15.3051 3.248 14.749 2.46582 13.9222L0.535522 15.7481C1.52607 16.7957 2.96523 17.5364 4.4907 17.8267V20.0001H7.14783V17.8735C9.7724 17.4978 11.4616 15.9177 11.4642 13.7074Z" fill="var(--primary)"/>
                        </svg>
                      </div>
                    </div>
                    <div id="NewCustomers"></div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-sm-6">
                <div className="card chart-grd same-card">
                  <div className="card-body depostit-card p-0">
                    <div className="depostit-card-media d-flex justify-content-between pb-0">
                      <div>
                        <h6>Total Expenses</h6>
                        <h3>$1200.00</h3>
                      </div>
                      <div className="icon-box ">
                        <svg width="12" height="20" viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M11.4642 13.7074C11.4759 12.1252 10.8504 10.8738 9.60279 9.99009C8.6392 9.30968 7.46984 8.95476 6.33882 8.6137C3.98274 7.89943 3.29927 7.52321 3.29927 6.3965C3.29927 5.14147 4.93028 4.69493 6.32655 4.69493C7.34341 4.69493 8.51331 5.01109 9.23985 5.47964L10.6802 3.24887C9.73069 2.6333 8.43112 2.21342 7.14783 2.0831V0H4.49076V2.22918C2.12884 2.74876 0.640949 4.29246 0.640949 6.3965C0.640949 7.87005 1.25327 9.03865 2.45745 9.86289C3.37331 10.4921 4.49028 10.83 5.56927 11.1572C7.88027 11.8557 8.81873 12.2813 8.80805 13.691L8.80799 13.7014C8.80799 14.8845 7.24005 15.3051 5.89676 15.3051C4.62786 15.3051 3.248 14.749 2.46582 13.9222L0.535522 15.7481C1.52607 16.7957 2.96523 17.5364 4.4907 17.8267V20.0001H7.14783V17.8735C9.7724 17.4978 11.4616 15.9177 11.4642 13.7074Z" fill="#FF5E5E"/>
                        </svg>
                      </div>
                    </div>
                    <div id="NewExperience"></div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-sm-6 same-card">
                <div className="card">
                  <div className="card-body depostit-card">
                    <div className="depostit-card-media d-flex justify-content-between style-1">
                      <div>
                        <h6>Total Deposit</h6>
                        <h3>20</h3>
                      </div>
                      <div className="icon-box ">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M16.3787 1.875H15.625V1.25C15.625 1.08424 15.5592 0.925268 15.4419 0.808058C15.3247 0.690848 15.1658 0.625 15 0.625C14.8342 0.625 14.6753 0.690848 14.5581 0.808058C14.4408 0.925268 14.375 1.08424 14.375 1.25V1.875H10.625V1.25C10.625 1.08424 10.5592 0.925268 10.4419 0.808058C10.3247 0.690848 10.1658 0.625 10 0.625C9.83424 0.625 9.67527 0.690848 9.55806 0.808058C9.44085 0.925268 9.375 1.08424 9.375 1.25V1.875H5.625V1.25C5.625 1.08424 5.55915 0.925268 5.44194 0.808058C5.32473 0.690848 5.16576 0.625 5 0.625C4.83424 0.625 4.67527 0.690848 4.55806 0.808058C4.44085 0.925268 4.375 1.08424 4.375 1.25V1.875H3.62125C2.99266 1.87599 2.3901 2.12614 1.94562 2.57062C1.50114 3.0151 1.25099 3.61766 1.25 4.24625V17.0037C1.25099 17.6323 1.50114 18.2349 1.94562 18.6794C2.3901 19.1239 2.99266 19.374 3.62125 19.375H16.3787C17.0073 19.374 17.6099 19.1239 18.0544 18.6794C18.4989 18.2349 18.749 17.6323 18.75 17.0037V4.24625C18.749 3.61766 18.4989 3.0151 18.0544 2.57062C17.6099 2.12614 17.0073 1.87599 16.3787 1.875ZM17.5 17.0037C17.499 17.3008 17.3806 17.5854 17.1705 17.7955C16.9604 18.0056 16.6758 18.124 16.3787 18.125H3.62125C3.32418 18.124 3.03956 18.0056 2.8295 17.7955C2.61944 17.5854 2.50099 17.3008 2.5 17.0037V4.24625C2.50099 3.94918 2.61944 3.66456 2.8295 3.4545C3.03956 3.24444 3.32418 3.12599 3.62125 3.125H4.375V3.75C4.375 3.91576 4.44085 4.07473 4.55806 4.19194C4.67527 4.30915 4.83424 4.375 5 4.375C5.16576 4.375 5.32473 4.30915 5.44194 4.19194C5.55915 4.07473 5.625 3.91576 5.625 3.75V3.125H9.375V3.75C9.375 3.91576 9.44085 4.07473 9.55806 4.19194C9.67527 4.30915 9.83424 4.375 10 4.375C10.1658 4.375 10.3247 4.30915 10.4419 4.19194C10.5592 4.07473 10.625 3.91576 10.625 3.75V3.125H14.375V3.75C14.375 3.91576 14.4408 4.07473 14.5581 4.19194C14.6753 4.30915 14.8342 4.375 15 4.375C15.1658 4.375 15.3247 4.30915 15.4419 4.19194C15.5592 4.07473 15.625 3.91576 15.625 3.75V3.125H16.3787C16.6758 3.12599 16.9604 3.24444 17.1705 3.4545C17.3806 3.66456 17.499 3.94918 17.5 4.24625V17.0037Z" fill="var(--primary)"/>
                          <path d="M7.68311 7.05812L6.24999 8.49125L5.44186 7.68312C5.38421 7.62343 5.31524 7.57581 5.23899 7.54306C5.16274 7.5103 5.08073 7.49306 4.99774 7.49234C4.91475 7.49162 4.83245 7.50743 4.75564 7.53886C4.67883 7.57028 4.60905 7.61669 4.55037 7.67537C4.49168 7.73406 4.44528 7.80384 4.41385 7.88065C4.38243 7.95746 4.36661 8.03976 4.36733 8.12275C4.36805 8.20573 4.3853 8.28775 4.41805 8.364C4.45081 8.44025 4.49842 8.50922 4.55811 8.56687L5.80811 9.81687C5.92532 9.93404 6.08426 9.99986 6.24999 9.99986C6.41572 9.99986 6.57466 9.93404 6.69186 9.81687L8.56686 7.94187C8.68071 7.82399 8.74371 7.66612 8.74229 7.50224C8.74086 7.33837 8.67513 7.18161 8.55925 7.06573C8.44337 6.94985 8.28661 6.88412 8.12274 6.8827C7.95887 6.88127 7.80099 6.94427 7.68311 7.05812Z" fill="var(--primary)"/>
                          <path d="M15 8.125H10.625C10.4592 8.125 10.3003 8.19085 10.1831 8.30806C10.0658 8.42527 10 8.58424 10 8.75C10 8.91576 10.0658 9.07473 10.1831 9.19194C10.3003 9.30915 10.4592 9.375 10.625 9.375H15C15.1658 9.375 15.3247 9.30915 15.4419 9.19194C15.5592 9.07473 15.625 8.91576 15.625 8.75C15.625 8.58424 15.5592 8.42527 15.4419 8.30806C15.3247 8.19085 15.1658 8.125 15 8.125Z" fill="var(--primary)"/>
                          <path d="M7.68311 12.6831L6.24999 14.1162L5.44186 13.3081C5.38421 13.2484 5.31524 13.2008 5.23899 13.1681C5.16274 13.1353 5.08073 13.1181 4.99774 13.1173C4.91475 13.1166 4.83245 13.1324 4.75564 13.1639C4.67883 13.1953 4.60905 13.2417 4.55037 13.3004C4.49168 13.3591 4.44528 13.4288 4.41385 13.5056C4.38243 13.5825 4.36661 13.6648 4.36733 13.7477C4.36805 13.8307 4.3853 13.9127 4.41805 13.989C4.45081 14.0653 4.49842 14.1342 4.55811 14.1919L5.80811 15.4419C5.92532 15.559 6.08426 15.6249 6.24999 15.6249C6.41572 15.6249 6.57466 15.559 6.69186 15.4419L8.56686 13.5669C8.68071 13.449 8.74371 13.2911 8.74229 13.1272C8.74086 12.9634 8.67513 12.8066 8.55925 12.6907C8.44337 12.5749 8.28661 12.5091 8.12274 12.5077C7.95887 12.5063 7.80099 12.5693 7.68311 12.6831Z" fill="var(--primary)"/>
                          <path d="M15 13.75H10.625C10.4592 13.75 10.3003 13.8158 10.1831 13.9331C10.0658 14.0503 10 14.2092 10 14.375C10 14.5408 10.0658 14.6997 10.1831 14.8169C10.3003 14.9342 10.4592 15 10.625 15H15C15.1658 15 15.3247 14.9342 15.4419 14.8169C15.5592 14.6997 15.625 14.5408 15.625 14.375C15.625 14.2092 15.5592 14.0503 15.4419 13.9331C15.3247 13.8158 15.1658 13.75 15 13.75Z" fill="var(--primary)"/>
                        </svg>
                      </div>
                    </div>
                    <div className="progress-box mt-0">
                      <div className="d-flex justify-content-between">
                        <p className="mb-0">Tasks Not Finished</p>
                        <p className="mb-0">20/28</p>
                      </div>
                      <div className="progress">
                        <div className="progress-bar bg-primary" style={{width: "50%", height: "5px", borderRadius: "4px"}} role="progressbar"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}

            {/* Tenant Information Table */}
            <div className="row ">
              <div className="col-xl-12">
                <div className="card">
                  <div className="card-header border-0 pb-0">
                    <div className="d-flex align-items-center mb-3" style={{width:"100%"}}>
                      <h4 className="heading mb-0 me-auto">
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
                          className="btn btn-primary btn-sm ms-auto"
                          style={{
                            background: "#7b9b43",
                            border: "none",
                            borderRadius: "22px",
                            padding: "8px 20px",
                            fontSize: "0.875rem",
                            fontWeight: 500,
                            cursor: "pointer",
                            boxShadow: "0 2px 6px rgba(25, 118, 210, 0.08)",
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
                        <table className="table table-hover mb-0" style={{borderCollapse: 'separate', borderSpacing: 0}}>
                          <thead>
                            <tr>
                              <th style={{...tenantTableStyles.tableHeader, width: '200px'}}>Field</th>
                              <th style={tenantTableStyles.tableHeader}>Value</th>
                              <th style={{...tenantTableStyles.tableHeader, width: '150px'}}>Status</th>
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
                              <td style={tenantTableStyles.fieldName}>Database Name</td>
                              <td style={tenantTableStyles.valueCell}>
                                <code style={tenantTableStyles.code}>{tenant.data.DatabaseName || '-'}</code>
                              </td>
                              <td style={tenantTableStyles.statusCell}>-</td>
                            </tr>
                            <tr>
                              <td style={tenantTableStyles.fieldName}>Sub Domain</td>
                              <td style={tenantTableStyles.valueCell}>
                                {tenant.data.SubDomain ? (
                                  <span style={{color: '#7b9b43', fontWeight: '600'}}>
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
                                <a  style={tenantTableStyles.link}>
                                  <i className="fas fa-envelope me-1" style={{color: '#7b9b43'}}></i>
                                  {tenant.data.Email || '-'}
                                </a>
                              </td>
                              <td style={tenantTableStyles.statusCell}>-</td>
                            </tr>
                            <tr>
                              <td style={tenantTableStyles.fieldName}>Phone Number</td>
                              <td style={tenantTableStyles.valueCell}>
                                <a  style={tenantTableStyles.link}>
                                  <i className="fas fa-phone me-1" style={{color: '#7b9b43'}}></i>
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
                                      <td  style={tenantTableStyles.statusCell}>-</td>
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
                                      <td style={tenantTableStyles.fieldName}>Created Date</td>
                                      <td className="fw-semibold">{formatDate(pkg.CreatedDate)}</td>
                                      <td  style={tenantTableStyles.statusCell}>-</td>
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
                              <td  style={tenantTableStyles.statusCell}>-</td>
                            </tr>
                            <tr>
                              <td style={tenantTableStyles.fieldName}>Role ID</td>
                              <td>
                                <span className=" px-2 py-1 fw-semibold">
                                  Role {tenant.data.RoleId || '-'}
                                </span>
                              </td>
                              <td  style={tenantTableStyles.statusCell}>-</td>
                            </tr>
                            <tr>
                              <td style={tenantTableStyles.fieldName}>Account Status</td>
                              <td>
                                <span className={`badge ${tenant.data.isActive ? 'bg-success' : 'bg-danger'} text-white px-3 py-2`}>
                                  <i className={`fas ${tenant.data.isActive ? 'fa-check-circle' : 'fa-times-circle'} me-1`}></i>
                                  {tenant.data.isActive ? 'Active' : 'Inactive'}
                                </span>
                              </td>
                              <td  style={tenantTableStyles.statusCell}>-</td>
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
