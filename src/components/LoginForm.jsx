import React, { useState, useEffect } from "react";
import { CustomButtonGreen } from "./CustomButton";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { CircularProgress, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { getPackageById } from "../APIS/packages";
import { RegisterTenant } from "../APIS/auth";
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { toast } from "react-toastify";
import image from "../assets/img/loginForm.jpg";

export const LoginForm = () => {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    FirstName: "",
    LastName: "",
    CompanyName: "",
    PhoneNo: "",
    RoleId: 2,
    PackageId: "",
    SubDomain: "",
    Email: "",
    Password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPackageDetails, setSelectedPackageDetails] = useState(null);
  const navigate = useNavigate();

  // Fetch package details by ID when component mounts
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);

    const packageId = searchParams.get('packageId');
    if (packageId) {
      fetchPackageById(packageId);
    }
  }, [searchParams]);

  const fetchPackageById = async (packageId) => {
    try {
      const response = await getPackageById(packageId);

      if (response) {
        setSelectedPackageDetails(response);
        setFormData(prev => ({
          ...prev,
          PackageId: response.PackageId
        }));
      }
    } catch (error) {
      console.error('Error fetching package details:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Special validation for FirstName and LastName
    if (name === "FirstName" || name === "LastName") {
      // Only allow letters and spaces and max 50 chars
      if (!/^[a-zA-Z\s]*$/.test(value)) {
        setErrors(prev => ({
          ...prev,
          [name]: "Only letters and spaces are allowed"
        }));
        return;
      }

      if (value.length > 50) {
        setErrors(prev => ({
          ...prev,
          [name]: "Maximum 50 characters allowed"
        }));
        return;
      }

      // Clear error if valid
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }

    // Special validation for SubDomain
    if (name === "SubDomain") {
      // Check if starts with letter and contains only letters, numbers and underscore
      if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(value)) {
        setErrors(prev => ({
          ...prev,
          [name]: "Username must start with a letter and can only contain letters, numbers and underscore"
        }));
        return;
      }

      if (value.length > 50) {
        setErrors(prev => ({
          ...prev,
          [name]: "Maximum 50 characters allowed"
        }));
        return;
      }

      // Clear error if valid
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }

    // Phone number validation
    if (name === "PhoneNo") {
      if (!/^\d*$/.test(value)) {
        setErrors(prev => ({
          ...prev,
          [name]: "Only numbers are allowed"
        }));
        return;
      }

      if (value.length > 15) {
        setErrors(prev => ({
          ...prev,
          [name]: "Phone number cannot exceed 15 digits"
        }));
        return;
      }

      // Clear error if valid
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // FirstName validation
    if (!formData.FirstName.trim()) {
      newErrors.FirstName = "First name is required";
    } else if (formData.FirstName.trim().length < 2) {
      newErrors.FirstName = "First name must be at least 2 characters long";
    } else if (formData.FirstName.trim().length > 50) {
      newErrors.FirstName = "First name cannot exceed 50 characters";
    } else if (!/^[a-zA-Z\s]*$/.test(formData.FirstName)) {
      newErrors.FirstName = "First name can only contain letters and spaces";
    }

    // LastName validation  
    if (!formData.LastName.trim()) {
      newErrors.LastName = "Last name is required";
    } else if (formData.LastName.trim().length < 2) {
      newErrors.LastName = "Last name must be at least 2 characters long";
    } else if (formData.LastName.trim().length > 50) {
      newErrors.LastName = "Last name cannot exceed 50 characters";
    } else if (!/^[a-zA-Z\s]*$/.test(formData.LastName)) {
      newErrors.LastName = "Last name can only contain letters and spaces";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.Email) {
      newErrors.Email = "Email is required";
    } else if (!emailRegex.test(formData.Email)) {
      newErrors.Email = "Please enter a valid email address";
    }

    // Company name validation
    if (!formData.CompanyName.trim()) {
      newErrors.CompanyName = "Company name is required";
    }

    // Phone validation
    if (!formData.PhoneNo) {
      newErrors.PhoneNo = "Phone number is required";
    } else if (formData.PhoneNo.length < 7 || formData.PhoneNo.length > 15) {
      newErrors.PhoneNo = "Phone number must be between 7 and 15 digits";
    } else if (!/^\d+$/.test(formData.PhoneNo)) {
      newErrors.PhoneNo = "Phone number can only contain digits";
    }

    // Password validation
    if (!formData.Password) {
      newErrors.Password = "Password is required";
    } else if (formData.Password.length < 8) {
      newErrors.Password = "Password must be at least 8 characters long";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.Password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // SubDomain validation
    if (!formData.SubDomain.trim()) {
      newErrors.SubDomain = "Username is required";
    } else if (formData.SubDomain.trim().length < 3) {
      newErrors.SubDomain = "Username must be at least 3 characters long";
    } else if (formData.SubDomain.trim().length > 50) {
      newErrors.SubDomain = "Username cannot exceed 50 characters";
    } else if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(formData.SubDomain.trim())) {
      newErrors.SubDomain = "Username must start with a letter and can only contain letters, numbers and underscore";
    }

    // Package validation - only if no package is pre-selected
    if (!formData.PackageId) {
      toast.error("Please select a package");
      newErrors.PackageId = "Please select a package";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const packageToUse = selectedPackageDetails;

      // Prepare data for API call (remove confirmPassword as it's not needed on backend)
      const { confirmPassword, ...registerData } = formData;
      const obj = {
        TenantId: 0,
        FirstName: formData.FirstName,
        LastName: formData.LastName,
        Email: formData.Email,
        Password: formData.Password,
        SubDomain: formData.SubDomain,
        CompanyName: formData.CompanyName,
        PhoneNo: formData.PhoneNo,
        RoleId: formData.RoleId,
        tblUserpackages: [
          {
            UserPackageId: 0,
            PackageId: packageToUse?.PackageId,
            TenantId: 0,
            Name: packageToUse?.Name,
            PackageTypeId: packageToUse?.PackageTypeId,
            MaxUsers: packageToUse?.MaxUser,
            MaxStorageMB: packageToUse?.MaxStorageMB,
            MaxCompanies: packageToUse?.MaxCompanies,
            Price: packageToUse?.Price,
          }
        ]
      };
      const data = await RegisterTenant(obj);
      if (data?.status == 200) {
        toast.success(data?.data?.Message);
        setFormData({
          Email: "",
          Password: "",
          confirmPassword: "",
          SubDomain: "",
          FirstName: "",
          LastName: "",
          CompanyName: "",
          PhoneNo: "",
          RoleId: 2,
        });
      } else if (data?.status == 409) {
        toast.error(data?.response?.data);
      } else {
        toast.error(data?.data?.Message);
      }

      if (data?.data?.PaymentLink) {
        window.open(data.data.PaymentLink, '_blank');
        navigate("/login");
      }
    } catch (error) {
      toast.error(error?.response?.data);
      console.error("Registration error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="contact" >
      <div className="container" >
        <div className="section-title" style={{ marginTop: "11.5%" }}>
          <h2>Create Account</h2>
          <p>
            Join Earthco today and start your journey towards beautiful
            landscaping solutions. Create your account to access exclusive
            features and personalized services.
          </p>
        </div>

        {/* Responsive Flexbox Wrapper */}
        <div
          className="login-flex-wrapper"
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            alignItems: "stretch",
            gap: "0",
            // Responsive styles
            flexWrap: "wrap",
          }}
        >
          {/* Left side - Image */}
          <div
            className="login-image-container"
            style={{
              width: "50%",
              minWidth: "300px",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              // Responsive
              padding: "0",
            }}
          >
            <img
              src={image}
              alt="Registration"
              className="img-fluid shadow"
              style={{
                width: "100%",
                height: "100%",
                minHeight: "250px",
                objectFit: "cover",
                borderRadius: "0",
              }}
            />
          </div>

          {/* Right side - Form */}
          <form
            onSubmit={handleSubmit}
            className="php-email-form"
            style={{
              width: "50%",
              minWidth: "300px",
              padding: "40px",
              background: "#fff",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <h4 style={{ color: '#6DA34D', marginBottom: '24px', textAlign: 'center', fontWeight: "bold", fontSize: "24px" }}>
              Register Now
            </h4>

            {/* Display selected package info if available */}
            {selectedPackageDetails && (
              <div className="mb-4 p-3" style={{ background: '#f8f9fa', borderRadius: '8px', border: '1px solid #e9ecef' }}>
                <h6 style={{ color: '#6DA34D', marginBottom: '8px' }}>Selected Package: {selectedPackageDetails.Name}</h6>
                <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
                  Price: ${selectedPackageDetails.Price}/month
                </p>
                {selectedPackageDetails.Description && (
                  <div style={{ marginTop: '8px', fontSize: '13px', color: '#666' }}>
                    {selectedPackageDetails.Description}
                  </div>
                )}
              </div>
            )}

            <div className="row">
              <div className="form-group col-md-6">
                <input
                  type="text"
                  name="FirstName"
                  className={`form-control ${errors.FirstName ? "is-invalid" : ""}`}
                  id="FirstName"
                  value={formData.FirstName}
                  onChange={handleInputChange}
                  placeholder="First Name"
                  style={{ background: '#f4f7fa', border: '1px solid #e0e0e0' }}
                />
                {errors.FirstName && (
                  <div className="invalid-feedback">{errors.FirstName}</div>
                )}
              </div>
              <div className="form-group col-md-6">
                <input
                  type="text"
                  name="LastName"
                  className={`form-control ${errors.LastName ? "is-invalid" : ""}`}
                  id="LastName"
                  value={formData.LastName}
                  onChange={handleInputChange}
                  placeholder="Last Name"
                  style={{ background: '#f4f7fa', border: '1px solid #e0e0e0' }}
                />
                {errors.LastName && (
                  <div className="invalid-feedback">{errors.LastName}</div>
                )}
              </div>
              <div className="form-group col-md-6">
                <input
                  type="text"
                  name="SubDomain"
                  className={`form-control ${errors.SubDomain ? "is-invalid" : ""} mt-2`}
                  id="SubDomain"
                  value={formData.SubDomain}
                  onChange={handleInputChange}
                  placeholder="Username"
                  style={{ background: '#f4f7fa', border: '1px solid #e0e0e0' }}
                />
                {errors.SubDomain && (
                  <div className="invalid-feedback">{errors.SubDomain}</div>
                )}
              </div>
              <div className="form-group col-md-6">
                <input
                  type="text"
                  name="Email"
                  className={`form-control ${errors.Email ? "is-invalid" : ""} mt-2`}
                  id="Email"
                  value={formData.Email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  style={{ background: '#f4f7fa', border: '1px solid #e0e0e0' }}
                />
                {errors.Email && (
                  <div className="invalid-feedback">{errors.Email}</div>
                )}
              </div>
              <div className="form-group col-md-6">
                <input
                  type="text"
                  name="CompanyName"
                  className={`form-control ${errors.CompanyName ? "is-invalid" : ""} mt-2`}
                  id="CompanyName"
                  value={formData.CompanyName}
                  onChange={handleInputChange}
                  placeholder="Company Name"
                  style={{ background: '#f4f7fa', border: '1px solid #e0e0e0' }}
                />
                {errors.CompanyName && (
                  <div className="invalid-feedback">{errors.CompanyName}</div>
                )}
              </div>
              <div className="form-group col-md-6">
                <input
                  type="tel"
                  name="PhoneNo"
                  className={`form-control ${errors.PhoneNo ? "is-invalid" : ""} mt-2`}
                  id="PhoneNo"
                  value={formData.PhoneNo}
                  onChange={handleInputChange}
                  placeholder="Phone Number"
                  style={{ background: '#f4f7fa', border: '1px solid #e0e0e0' }}
                />
                {errors.PhoneNo && (
                  <div className="invalid-feedback">{errors.PhoneNo}</div>
                )}
              </div>
            </div>

            <div className="row mt-2">
              <div className="form-group col-md-6">
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="Password"
                    className={`form-control ${errors.Password ? "is-invalid" : ""}`}
                    id="Password"
                    value={formData.Password}
                    onChange={e => {
                      const value = e.target.value;
                      handleInputChange(e);

                      // Password validation
                      let errorMsg = "";
                      if (value.length < 8) {
                        errorMsg = "Password must be at least 8 characters.";
                      } else if (!/\d/.test(value)) {
                        errorMsg = "Password must contain at least 1 number.";
                      } else if (!/[A-Z]/.test(value)) {
                        errorMsg = "Password must contain at least 1 upper case letter.";
                      }
                      // Set error for Password field
                      setErrors(prev => ({
                        ...prev,
                        Password: errorMsg
                      }));
                    }}
                    placeholder="Password"
                    style={{ background: '#f4f7fa', border: '1px solid #e0e0e0' }}
                  />
                  <div className="input-group-append">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      style={{ position: 'absolute', right: '18px', zIndex: '999', top: "3px" }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </div>
                </div>
                {errors.Password && (
                  <div className="invalid-feedback" style={{ display: 'block' }}>{errors.Password}</div>
                )}
              </div>
              <div className="form-group col-md-6">
                <div className="input-group">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={e => {
                      const value = e.target.value;
                      handleInputChange(e);

                      // Confirm password validation
                      let errorMsg = "";
                      if (value !== formData.Password) {
                        errorMsg = "Passwords do not match.";
                      }
                      setErrors(prev => ({
                        ...prev,
                        confirmPassword: errorMsg
                      }));
                    }}
                    placeholder="Confirm Password"
                    style={{ background: '#f4f7fa', border: '1px solid #e0e0e0' }}
                  />
                  <div className="input-group-append">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                      style={{ position: 'absolute', right: '18px', zIndex: '999', top: "3px" }}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </div>
                </div>
                {errors.confirmPassword && (
                  <div className="invalid-feedback" style={{ display: 'block' }}>{errors.confirmPassword}</div>
                )}
              </div>
            </div>

            <p className="mt-2 mb-1">&#8226; At least 8 characters</p>
            <p className="mb-1">&#8226; At least 1 number</p>
            <p className=" ">&#8226; At least 1 upper case letter</p>
            <div className="mt-2">
              <CustomButtonGreen
                className="w-100"
                text={
                  isSubmitting
                    ? "Creating Account..."
                    : "Create Account"
                }
                type="submit"
                disabled={isSubmitting}
              />
              <p className="text-center mt-2">
                Already user? <Link
                  to="/login"
                  style={{ color: '#6DA34D', fontWeight: 500, textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseOver={e => e.target.style.color = '#55842A'}
                  onMouseOut={e => e.target.style.color = '#6DA34D'}
                >Login</Link>
              </p>
            </div>
          </form>
        </div>
      
      </div>
    </section>
  );
};