import React, { useState } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { ConfirmationModal } from '../Reuseable/ConfirmationModal';
import { toast } from 'react-toastify';
import { cancelSubscription } from '../../APIS/transactions';
const tenantTableStyles = {
    tableHeader: {
        // backgroundColor: '#f8f9fa',
        borderBottom: '2px solid #dee2e6',
        fontWeight: '600',
        color: '#495057',
        textTransform: 'uppercase',
        fontSize: '0.875rem',
        letterSpacing: '0.5px',

    },
    sectionHeader: {
        // backgroundColor: '#e3f2fd',
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

}


// Helper function to get status badge
const getStatusBadge = (isActive) => {

    return (
        <span className={`badge ${isActive ? 'bg-success' : 'bg-danger'} text-white px-3 py-1`}>
            {isActive ? 'Active' : 'Inactive'}
        </span>
    );
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

export const AccountInfo = ({ loading, error, tenant, loginUser, password, setPassword, passwordElement, setPasswordElement }) => {
 
    return (
        <>
    
        <div className={` ${loginUser?.Data?.RoleId == 1 ? 'col-lg-12' : 'col-lg-6'}`}>
            <div className="card shadow-sm" style={{ borderRadius: "13px", border: "none" }}>
                <div className="card-header border-0 pb-0 " >
                    <div className="d-flex align-items-center " style={{ width: "100%" }}>
                        <h4 className="heading mb-0 me-auto " >

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
                            <table className="table mb-0" >
                                <thead className="bg-light">
                                    <tr>
                                        <th style={{ ...tenantTableStyles.tableHeader, width: '200px' }}>Field</th>
                                        <th style={tenantTableStyles.tableHeader}>Credentials</th>
                                        <th style={{ ...tenantTableStyles.tableHeader, width: '150px', textAlign: 'center' }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Company Information */}

                                    <tr>
                                        <td style={tenantTableStyles.fieldName}>Company Name</td>
                                        <td className="fw-semibold">{tenant.data.CompanyName || '-'}</td>
                                        <td style={tenantTableStyles.statusCell}>
                                            <span>
                                                {/* {getStatusBadge(tenant.data.isActive)} */}-
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
                                            <span id="password" >{password}</span>

                                        </td>
                                        <td style={tenantTableStyles.statusCell}>
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
        </>
    )
}


export const PackageInfo = ({ loading, error, tenant, loginUser, password, setPassword, passwordElement, setPasswordElement }) => {
    const [modalConfig, setModalConfig] = useState({
        title: "",
        description: "",
        onConfirm: () => { },
        confirmText: "Confirm",
        cancelText: "Cancel"
      });
      const [modalOpen, setModalOpen] = useState(false);
      const [transactionId, setTransactionId] = useState(null);
      
      const handleCancelSubscription = async () => {
        // if (transactionId?.Status == 'incomplete_expired') {
        //   const response = await resumeSubscription(transactionId?.SubscriptionId, loginUser?.token?.data);
        //   if (response) {
        //     toast.success("Subscription resumed successfully");
        //     setModalOpen(false);
        //   }
        // } else {
          const response = await cancelSubscription(transactionId?.SubscriptionId, loginUser?.token?.data);
          if (response) {
            toast.success("Subscription cancelled successfully");
            setModalOpen(false);
          }
        // }
    
      }
    return loginUser?.Data?.RoleId != 1 &&
    <>
    <ConfirmationModal
    modalOpen={modalOpen}
    setModalOpen={setModalOpen}
    title={modalConfig.title}
    description={modalConfig.description}
    onConfirm={modalConfig.onConfirm}
    confirmText={modalConfig.confirmText}
    cancelText={modalConfig.cancelText}
  />
        <div className="col-xl-6">
            <div className="card shadow-sm">
                <div className="card-header border-0 pb-0 " >
                    <div className="d-flex align-items-center justify-content-between mb-3" style={{ width: "100%" }}>
                        <div className="d-flex align-items-center mb-3" style={{ width: "100%" }}>
                            <h4 className="heading mb-0 me-auto " >

                                Package Information
                            </h4>
                            <button
                                className={`btn btn-danger btn-sm`}
                                onClick={() => {
                                    setModalOpen(true);
                                    setModalConfig({
                                      title: "Cancel Subscription",
                                      description: "Are you sure you want to cancel your subscription?",
                                      onConfirm: () => {
                                        handleCancelSubscription()
                                      }
                                    });
                                  }}
                            >
                                Cancel Subscription
                            </button>
                        </div>
                        {/* <button
                    className={`btn btn-danger btn-sm`}
                  // onClick={() => {
                  //   setModalOpen(true);
                  //   setModalConfig({
                  //     title: "Cancel Subscription",
                  //     description: "Are you sure you want to cancel your subscription?",
                  //     onConfirm: () => {
                  //    handleCancelSubscription()
                  //     }
                  //   });
                  // }}
                  >
                    {"Cancel Subscription"}
                  </button> */}
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
                                    {tenant.data.tblUserPackages.map((pkg, index) => {
                                        return (<React.Fragment key={index}>
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
                                                    <span className=" px-2 py-1 fw-semibold">
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
                                                <td style={tenantTableStyles.statusCell}>-
                                                    {/* <span className={`badge ${getExpiryStatus(pkg.ExpiryDate).badge} text-white px-3 py-1 `}>
            {getExpiryStatus(pkg.ExpiryDate).status}
        </span> */}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style={tenantTableStyles.fieldName}>Subscription Date</td>
                                                <td className="fw-semibold">{formatDate(pkg.CreatedDate)}</td>
                                                <td style={tenantTableStyles.statusCell}>-</td>
                                            </tr>

                                        </React.Fragment>);
                                    })}
                                </tbody>

                            </table>

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
        </div>
        </>

}
export const AccountInfoChart = ({ loading, error, tenant, loginUser, password, setPassword, passwordElement, setPasswordElement }) => {
    const totalCompanies = 10;
    const totalUsers = 5;
    const usedUsers = 3;
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

    return (
        <div className="col-xl-6">
            <div className="card shadow-sm" style={{ borderRadius: "13px", border: "none" }}>
                <div className="card-header border-0 pb-0 " >
                    <div className="d-flex align-items-center mb-3" style={{ width: "100%" }}>
                        <h4 className="heading mb-0 me-auto " >
                            Package Overview
                        </h4>
                    </div>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive  style-1">
                        <tr>

                            <td >


                                <div style={{ width: "500px", margin: "auto" }}>
                                    <HighchartsReact highcharts={Highcharts} options={options} />
                                </div>

                            </td>
                        </tr>
                    </div>
                </div>
            </div>
        </div>
    )
}

export const WelcomeCard = ({ userName = "Mr. Dianne Russell" }) => {
    // Theme colors for gradient
    const gradientStyle = {
        background: "linear-gradient(90deg,rgb(150, 184, 92) 0%,rgb(125, 158, 75) 100%)",
        borderRadius: "13px",
        border: "none",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        padding: "1rem 2.5rem",
        boxShadow: "0 0.5rem 1.5rem rgba(44, 62, 80, 0.08)"
    };

    return (
        // <div className="col-xl-3">
        //     <div className="card shadow-sm" style={gradientStyle}>
        //         <div style={{ width: "100%" }}>
        //             <div  style={{ fontSize: "18px", fontWeight: 700,}}>
        //                 Good Evening,
        //             </div>
        //             <div  style={{ fontSize: "18px", fontWeight: 700 }}>
        //                 {userName}
        //             </div>
        //             {/* <div style={{ fontSize: "13px", color: "#fff" }}>
        //                 Welcome to Earthco
        //             </div> */}
        //         </div>
        //     </div>
        // </div>
        <div className={`col-xl-3 col-lg-6 col-sm-6 `}>
        <div className={`card`} style={{ borderRadius: "10px", background: "linear-gradient(90deg,rgb(150, 184, 92) 0%,rgb(125, 158, 75) 100%)", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", cursor: "pointer" }}>
          <div className="card-body" style={{ padding: "20px" }}>
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <div className="d-flex align-items-center mb-1">
                  <h5 style={{ fontSize: "18px", fontWeight: 700, color: '#fff' }}>Good Evening,</h5>
                </div>
                <h4 style={{ fontSize: "18px", fontWeight: 700, color: '#fff' }}>{userName}</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}