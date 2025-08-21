import React, { useEffect, useState } from "react";
import DashboardLayout from "../DashboardLayout/DashboardLayout";
import { AddTenant, getTenantById, updateTenantStatus } from "../../APIS/auth";
import { useAppContext } from "../../context/AppContext";
import { useSearchParams } from "react-router-dom";
import { CircularProgress, TextField, InputAdornment, IconButton, Tooltip } from "@mui/material";
import { toast } from "react-toastify";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { cancelSubscription, getTransactionById, resumeSubscription } from "../../APIS/transactions";
import { ConfirmationModal } from "../Reuseable/ConfirmationModal";
import TitleBar from "../TitleBar";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
const ProfilePage = () => {
  const { loginUser } = useAppContext();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transactionId, setTransactionId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    FirstName: "",
    LastName: "",
    Password: "",
    confirmPassword: "",
    tblUserPackages: []
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: "",
    description: "",
    onConfirm: () => { },
    confirmText: "Confirm",
    cancelText: "Cancel"
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Validate required fields
      if (!formData.FirstName || !formData.LastName) {
        toast.error("First name and last name are required");
        return;
      }

      // Validate password fields if provided
      if (formData.Password || formData.confirmPassword) {
        if (formData.Password !== formData.confirmPassword) {
          toast.error("Passwords do not match");
          return;
        }
        if (formData.Password.length < 8) {
          toast.error("Password must be at least 8 characters");
          return;
        }
        if (!/[A-Z]/.test(formData.Password)) {
          toast.error("Password must contain at least one uppercase letter");
          return;
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.Password)) {
          toast.error("Password must contain at least one special character");
          return;
        }

      }
      if (!formData.PhoneNo || formData.PhoneNo.length < 7 || formData.PhoneNo.length > 15) {
        toast.error("Phone number is required and must be between 7 to 15 digits");
        return;
      }
      // Keep existing data and only update first name, last name and password
      const updatedData = {
        ...formData,
        FirstName: formData.FirstName,
        LastName: formData.LastName,
        Password: formData.Password
      };

      // Remove confirmPassword as it's not needed for API
      delete updatedData.confirmPassword;
      const response = await AddTenant(updatedData);
      if (response) {
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      console.error("Error updating tenant profile:", error);
      // toast.error("Error updating profile data");
    } finally {
      setLoading(false);
    }
  };
  const handleCancelSubscription = async () => {
    if (transactionId?.Status == 'incomplete_expired') {
      const response = await resumeSubscription(transactionId?.SubscriptionId, loginUser?.token?.data);
      if (response) {
        toast.success("Subscription resumed successfully");
        setModalOpen(false);
      }
    } else {
      const response = await cancelSubscription(transactionId?.SubscriptionId, loginUser?.token?.data);
      if (response) {
        toast.success("Subscription cancelled successfully");
        setModalOpen(false);
      }
    }

  }
  const fetchTenantProfile = async () => {
    setLoading(true);
    setError(null);

    try {
      const tenantId = searchParams.get('id') || loginUser?.Data?.TenantId;
      const user = JSON.parse(localStorage.getItem("user"));

      if (!tenantId) {
        setError("Tenant ID not found");
        return;
      }

      const response = await getTenantById(tenantId);


      if (response?.data && !response.error) {
        setFormData(response.data);
      } else if (response?.error) {
        setError(response.message);
        toast.error(response.message);
      } else {
        setError("Failed to fetch tenant data");
        // toast.error("Failed to fetch profile data");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      // toast.error("Error loading profile data");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {



    fetchTenantProfile();

  }, [searchParams, loginUser]);
  useEffect(() => {
    const fetchTransactionId = async () => {
      if (formData?.tblUserPackages?.length > 0) {
        const response = await getTransactionById(formData.tblUserPackages[0].UserPackagesId, loginUser?.token?.data);

        if (response) {
          setTransactionId(response);
        }
      }
    }
    fetchTransactionId()
  }, [formData?.tblUserPackages])
  // if (loading) {
  //   return (
  //     <DashboardLayout>
  //       <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
  //         <CircularProgress />
  //       </div>
  //     </DashboardLayout>
  //   );
  // }

  return (
    <DashboardLayout>
      <ConfirmationModal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        title={modalConfig.title}
        description={modalConfig.description}
        onConfirm={modalConfig.onConfirm}
        confirmText={modalConfig.confirmText}
        cancelText={modalConfig.cancelText}
      />
      <div className="content-body">
        <TitleBar title="Profile Settings" />
        <div className="container-fluid">


          <div className="card table-space">
            <div className="card-body">
              <h4 className="card-title mb-4">Profile Settings</h4>
              {/* {loading ? (
                    <div className="text-center">
                      <div className="spinner-border" role="status">
                        <span className="visually-hidden"><CircularProgress /></span>
                      </div>
                    </div>
                  ) : ( */}
              <div className="row">
                <div className="col-xl-3 mb-3">

                  <TextField
                    variant="outlined"
                    label="First Name"
                    required
                    className="form-control form-control-sm"
                    name="FirstName"
                    value={formData.FirstName}
                    onChange={handleInputChange}
                    size="small"
                  />
                </div>
                <div className="col-xl-3 mb-3">

                  <TextField
                    variant="outlined"
                    label="Last Name"
                    required
                    className="form-control form-control-sm"
                    name="LastName"
                    value={formData.LastName}
                    onChange={handleInputChange}
                    size="small"
                  />
                </div>
                <div className="col-xl-3 mb-3">

                  <TextField
                    variant="outlined"
                    label="Email"
                    
                    className="form-control form-control-sm"
                    name="Email"
                    value={formData.Email}
                    // onChange={handleInputChange}
                    size="small"
                    disabled
                    InputLabelProps={{ shrink: true }}

                  />
                </div>
                <div className="col-xl-3 mb-3">

                  <TextField
                    variant="outlined"
                    label="Company Name"
                    
                    className="form-control form-control-sm"
                    name="CompanyName"
                    value={formData.CompanyName}
                    // onChange={handleInputChange}
                    size="small"
                    disabled
                    InputLabelProps={{ shrink: true }}

                  />
                </div>
                <div className="col-xl-3 mb-3 mt-3">

                  <TextField
                    variant="outlined"
                    label="Phone no."
                    
                    className="form-control form-control-sm"
                    name="PhoneNo"
                    value={formData.PhoneNo}
                    // onChange={handleInputChange}
                    size="small"
                    disabled
                    InputLabelProps={{ shrink: true }}

                  />
                </div>

                <div className="col-xl-3 mb-3 mt-3">

                  <TextField
                    variant="outlined"
                    label="Username"
                    
                    className="form-control form-control-sm"
                    name="SubDomain"
                    value={formData.SubDomain}
                    // onChange={handleInputChange}
                    size="small"
                    disabled
                    InputLabelProps={{ shrink: true }}

                  />
                </div>

                <div className="col-xl-3 mb-3 mt-3">

                  <TextField
                    variant="outlined"
                    label="Password"
                    required
                    className="form-control form-control-sm"
                    name="Password"
                    value={formData.Password}
                    onChange={handleInputChange}
                    size="small"
                    type={showPassword ? "text" : "password"}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>
                <div className="col-xl-3 mb-3 mt-3">

                  <TextField
                    variant="outlined"
                    label="Confirm Password"
                    required
                    className="form-control form-control-sm"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    size="small"
                    type={showConfirmPassword ? "text" : "password"}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            edge="end"
                          >
                            {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>
                {formData?.TenantId == loginUser?.Data?.TenantId ? null : <div className="form-check form-switch d-flex align-items-center justify-content-center mb-4" style={{ width: "fit-content", paddingLeft: "1%" }}>
                  <Tooltip title={formData.isActive ? "Activate Admin" : "Inactivate Admin"} arrow>
                    <label
                      className="form-check-label mb-0"
                      style={{ whiteSpace: "nowrap", cursor: "pointer" }}
                      onClick={() => {
                        setModalOpen(true);
                        setModalConfig({
                          title: "Confirmation",
                          description: `Are you sure you want to ${formData.isActive ? "Inactivate" : "activate"} this tenant?`,
                          onConfirm: async () => {
                            const data = await updateTenantStatus({ id: formData.TenantId, Active: formData.isActive ? false : true });

                            if (data?.status == 200) {
                              toast.success(data?.data?.Message);
                              fetchTenantProfile();
                              setModalOpen(false);
                              // Do not close the modal here
                            } else {
                              toast.error(data?.Message);
                            }
                          },
                          confirmText: formData.isActive ? "Inactivate" : "Activate",
                          cancelText: "Cancel",
                        });
                      }}

                    >
                      {formData.isActive ? "Active" : "Inactive"}
                    </label>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={formData.isActive}
                      readOnly
                      onChange={() => {
                        setModalOpen(true);
                        setModalConfig({
                          title: "Confirmation",
                          description: `Are you sure you want to ${formData.isActive ? "Inactivate" : "activate"} this tenant?`,
                          onConfirm: async () => {
                            const data = await updateTenantStatus({ id: formData.TenantId, Active: formData.isActive ? false : true });
                            if (data?.status == 200) {
                              toast.success(data?.data?.Message);
                              fetchTenantProfile();
                              setModalOpen(false);
                            } else {
                              toast.error(data?.Message);
                            }
                          },
                          confirmText: formData.isActive ? "Inactivate" : "Activate",
                          cancelText: "Cancel",
                        });
                      }}
                      style={{ marginLeft: "12px" }}
                    />
                  </Tooltip>
                </div>}
              </div>
              <div className="row align-items-center">
                <div className="col-xl-6 d-flex align-items-center " style={{ textAlign: "start", paddingLeft: "25px" }}>
                  <IconButton
                    onClick={() => window.history.back()}
                    edge="start"
                    style={{
                      marginRight: "10px",
                      border: "1px solid rgb(182, 180, 180)",
                      borderRadius: "10%",
                      padding: "5px 15px"
                    }}
                  >
                    <KeyboardBackspaceIcon />
                  </IconButton>
                </div>
                <div className="col-xl-6 " style={{ textAlign: "end", paddingRight: "10px" }}>
                  <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
                    {loading ? "Updating..." : "Update"}
                  </button>
                </div>
              </div>
              {/* )} */}
            </div>
          </div>
          {loginUser?.Data?.RoleId != 1 && <div className="card table-space shadow-sm rounded-card">
            <div className="card-body">
              <h4 className="card-title mb-4 " style={{ marginLeft: "8px" }}>Active Package</h4>
              <div className="table-responsive">
                <table className="table table-responsive-md">
                  <thead>
                    <tr>
                      <th >Package Name</th>
                      <th style={{ textAlign: "center" }}>Price</th>
                      <th style={{ textAlign: "center" }}>Max Companies</th>
                      <th style={{ textAlign: "center" }}>Max Users</th>
                      <th style={{ textAlign: "center" }}>Max Storage (MB)</th>
                      <th style={{ textAlign: "center" }}>Expiry Date</th>
                      <th style={{ textAlign: "center" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td >{formData?.tblUserPackages[0]?.Name ?? 'No Package'}</td>
                      <td style={{ textAlign: "center" }}>${formData?.tblUserPackages[0]?.Price ?? 0}</td>
                      <td style={{ textAlign: "center" }}>{formData?.tblUserPackages[0]?.MaxCompanies ?? 0}</td>
                      <td style={{ textAlign: "center" }}>{formData?.tblUserPackages[0]?.MaxUsers ?? 0}</td>
                      <td style={{ textAlign: "center" }}>{formData?.tblUserPackages[0]?.MaxStorageMB ?? 0}</td>
                      <td style={{ textAlign: "center" }}>{new Date(formData?.tblUserPackages[0]?.ExpiryDate).toLocaleDateString() ?? 0}</td>
                      <td style={{ textAlign: "center" }}>
                        <button
                          className={`btn ${transactionId?.Status == 'incomplete_expired' ? "btn-primary" : "btn-danger"} btn-sm`}
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
                          {transactionId?.Status == 'incomplete_expired' ? "Resume Subscription" : "Cancel Subscription"}
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>}

        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;