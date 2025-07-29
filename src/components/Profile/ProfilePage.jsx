import React, { useEffect, useState } from "react";
import DashboardLayout from "../DashboardLayout/DashboardLayout";
import { AddTenant, getTenantById } from "../../APIS/auth";
import { useAppContext } from "../../context/AppContext";
import { useSearchParams } from "react-router-dom";
import { CircularProgress, TextField,  InputAdornment, IconButton } from "@mui/material";
import { toast } from "react-toastify";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const ProfilePage = () => {
  const { loginUser } = useAppContext();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    FirstName: "",
    LastName: "",
    Password: "",
    confirmPassword: ""
  });
  console.log("🚀 ~ ProfilePage ~ formData:", formData)


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
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
        if (formData.Password.length < 6) {
          toast.error("Password must be at least 6 characters");
          return;
        }
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
      console.log("🚀 ~ handleSubmit ~ response:", response)
      if(response) {
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      console.error("Error updating tenant profile:", error);
      toast.error("Error updating profile data");
    }
  };

  useEffect(() => {
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

        const response = await getTenantById(tenantId, user?.token?.data);
        

        if (response?.data && !response.error) {
            setFormData(response.data);
        } else if (response?.error) {
          setError(response.message || "Failed to fetch tenant data");
          toast.error(response.message || "Failed to fetch profile data");
        } else {
          setError("Failed to fetch tenant data");
          toast.error("Failed to fetch profile data");
        }
      } catch (err) {
        console.error("Error fetching tenant profile:", err);
        setError("An unexpected error occurred");
        toast.error("Error loading profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchTenantProfile();
  }, [searchParams, loginUser]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
          <CircularProgress />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="content-body">
        <div className="page-titles">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="javascript:void(0)">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M13.5096 2.53165H7.41104C5.50437 2.52432 3.94146 4.04415 3.89654 5.9499V15.7701C3.85437 17.7071 5.38979 19.3121 7.32671 19.3552C7.35512 19.3552 7.38262 19.3561 7.41104 19.3552H14.7343C16.6538 19.2773 18.1663 17.6915 18.1525 15.7701V7.36798L13.5096 2.53165Z" stroke="#888888" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M13.2688 2.52084V5.18742C13.2688 6.48909 14.3211 7.54417 15.6228 7.54784H18.1482" stroke="#888888" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M13.0974 14.0786H8.1474" stroke="#888888" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M11.2229 10.6388H8.14655" stroke="#888888" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Profile Settings
              </a>
            </li>
          </ol>
        </div>
        <div className="container-fluid">
 
            
              <div className="card">
                <div className="card-body">
              <h4 className="card-title mb-4">Profile Settings</h4>
                  {loading ? (
                    <div className="text-center">
                      <div className="spinner-border" role="status">
                        <span className="visually-hidden"><CircularProgress /></span>
                      </div>
                    </div>
                  ) : (
                    <div className="row">
                      <div className="col-xl-3 mb-3">
                        <label className="form-label">First Name<span className="text-danger">*</span></label>
                        <TextField
                          className="form-control form-control-sm"
                          name="FirstName"
                          value={formData.FirstName}
                          onChange={handleInputChange}
                          size="small"
                        />
                      </div>
                      <div className="col-xl-3 mb-3">
                        <label className="form-label">Last Name<span className="text-danger">*</span></label>
                        <TextField
                          className="form-control form-control-sm"
                          name="LastName"
                          value={formData.LastName}
                          onChange={handleInputChange}
                          size="small"
                        />
                      </div>
                      <div className="col-xl-3 mb-3">
                        <label className="form-label">Email<span className="text-danger">*</span></label>
                        <TextField
                          className="form-control form-control-sm"
                          name="Email"
                          value={formData.Email}
                          onChange={handleInputChange}
                          size="small"
                          disabled
                        />
                      </div>
                      <div className="col-xl-3 mb-3">
                        <label className="form-label">Company Name<span className="text-danger">*</span></label>
                        <TextField
                          className="form-control form-control-sm"
                          name="CompanyName"
                          value={formData.CompanyName}
                          onChange={handleInputChange}
                          size="small"
                          disabled
                        />
                      </div>
                      <div className="col-xl-3 mb-3">
                        <label className="form-label">Mobile<span className="text-danger">*</span></label>
                        <TextField
                          className="form-control form-control-sm"
                          name="PhoneNo"
                          value={formData.PhoneNo}
                          onChange={handleInputChange}
                          size="small"
                          disabled
                        />
                      </div>
                  
                      <div className="col-xl-3 mb-3">
                        <label className="form-label">Username<span className="text-danger">*</span></label>
                        <TextField
                          className="form-control form-control-sm"
                          name="SubDomain"
                          value={formData.SubDomain}
                          onChange={handleInputChange}
                          size="small"
                          disabled
                        />
                      </div>
                    
                      <div className="col-xl-3 mb-3">
                        <label className="form-label">Password<span className="text-danger">*</span></label>
                        <TextField
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
                        <div className="col-xl-3 mb-3">
                        <label className="form-label">Confirm Password<span className="text-danger">*</span></label>
                        <TextField
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
                      <div style={{ textAlign: "end" }}>
                        <button className="btn btn-primary me-1" onClick={handleSubmit}>
                          Update
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title mb-4">Active Package</h4>
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <tbody>
                        <tr>
                          <td><strong>Package Name</strong></td>
                          <td>{formData?.tblUserPackages[0]?.Name}</td>
                        </tr>
                        <tr>
                          <td><strong>Price</strong></td>
                          <td>${formData?.tblUserPackages[0]?.Price}</td>
                        </tr>
                        <tr>
                          <td><strong>Max Companies</strong></td>
                          <td>{formData?.tblUserPackages[0]?.MaxCompanies}</td>
                        </tr>
                        <tr>
                          <td><strong>Max Users</strong></td>
                          <td>{formData?.tblUserPackages[0]?.MaxUsers}</td>
                        </tr>
                        <tr>
                          <td><strong>Max Storage (MB)</strong></td>
                          <td>{formData?.tblUserPackages[0]?.MaxStorageMB}</td>
                        </tr>
                        <tr>
                          <td><strong>Expiry Date</strong></td>
                          <td>{new Date(formData?.tblUserPackages[0]?.ExpiryDate).toLocaleDateString()}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
           
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;