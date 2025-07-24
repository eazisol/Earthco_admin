import React, { useState,useEffect } from "react";
import { CustomButtonGreen } from "./CustomButton";
import { Link } from "react-router-dom";
import { CircularProgress, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { getPackages } from "../APIS/packages";
import { getTenantRole } from "../APIS/auth";
import { RegisterTenant } from "../APIS/auth";

export const LoginForm = () => {
  const [formData, setFormData] = useState({
    FirstName: "",
    LastName: "",
    CompanyName: "",
    PhoneNo: "",
    RoleId: 1,
    PackageId: 0,
    SubDomain: "",
    Email: "",
    Password: "",
    confirmPassword: "",
    SubDomain: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [role, setRole] = useState([]);
  const [packages, setpackegs] = useState([]);
  const [packagesData, setPackagesdata] = useState(null);
 console.log('packagesData',packagesData)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Optional: if you want to save full selected object too
    if (name === "PackageId") {
      const selectedPackage = packages.find((pkg) => pkg.PackageId === value);
      setPackagesdata(selectedPackage);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.Name.trim()) {
      newErrors.Name = "Name is required";
    } else if (formData.Name.trim().length < 2) {
      newErrors.Name = "Name must be at least 2 characters long";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.Email) {
      newErrors.Email = "Email is required";
    } else if (!emailRegex.test(formData.Email)) {
      newErrors.Email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.Password) {
      newErrors.Password = "Password is required";
    } else if (formData.Password.length < 6) {
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
      newErrors.SubDomain = "Entity Name is required";
    } else if (formData.SubDomain.trim().length < 3) {
      newErrors.SubDomain = "Entity Name must be at least 3 characters long";
    } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.SubDomain.trim())) {
      newErrors.SubDomain = "Entity Name can only contain letters, numbers, hyphens, and underscores";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const fetchPackages = async () => {
    const response = await getPackages({
      Search: "",
      DisplayStart: 1,
      DisplayLength: 10,
    });

    setpackegs(response?.Data);
  };
  const getRole = async () => {
    const response = await getTenantRole();
    setRole(response?.data);
  };
  useEffect(() => {
    fetchPackages();
    getRole();
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
console.log('formData',formData)
    // if (!validateForm()) {
    //   return;
    // }

    setIsSubmitting(true);

    try {
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
            UserPackageId:0,
            PackageId:packagesData?.PackageId,
            TenantId: 0,
            Name: packagesData?.Name,
            PackageTypeId: packagesData?.PackageTypeId,
            MaxUsers: packagesData?.MaxUser,
            MaxStorageMB: packagesData?.MaxStorageMB,
            MaxCompanies: packagesData?.MaxCompanies,
            Price: packagesData?.Price,
            
          }
        ]
      };
      const data = await RegisterTenant(obj);
      console.log('data.data',data.data)
if (data?.data?.PaymentLink) {
  window.open(data.data.PaymentLink, '_blank');
}

      // Reset form after successful submission
      setFormData({
        Name: "",
        Email: "",
        Password: "",
        confirmPassword: "",
        SubDomain: "",
      });

    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="contact">
      <div className="container" data-aos="fade-up">
        <div className="section-title " style={{marginTop: "7%"}}> 
          <h2>Create Account</h2>
          <p>
            Join Earthco today and start your journey towards beautiful
            landscaping solutions. Create your account to access exclusive
            features and personalized services.
          </p>
        </div>

        <div
          className="d-flex "
          style={{
            width: "100%",
            alignItems: "stretch",
          }}
        >
          {/* Left side - Image */}

          <div
            className="login-image-container"
            style={{
              width: "40%",
              overflow: "hidden",
            }}
          >
            <img
              src="/src/assets/img/loginForm.jpg"
              alt="Registration"
              className="img-fluid  shadow"
              style={{
                width: "100%",
                height: "100%", // Important
                objectFit: "cover", // Maintain cover look
                borderRadius: "0", // Remove unnecessary radius
              }}
            />
          </div>

          {/* Right side - Form */}

          <form
            
            onSubmit={handleSubmit}
            className="php-email-form"
            style={{
              width: "60%",
              padding: "20px", // Add some space if needed
            }}
          >
            <div className="row">
              <div className="form-group col-md-6">
                <label htmlFor="FirstName">
                  First Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="FirstName"
                  className={`form-control ${errors.FirstName ? "is-invalid" : ""}`}
                  id="FirstName"
                  value={formData.FirstName}
                  onChange={handleInputChange}
                  placeholder="Enter your first name"
                />
                {errors.FirstName && (
                  <div className="invalid-feedback">{errors.FirstName}</div>
                )}
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="LastName">
                  Last Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="LastName"
                  className={`form-control ${errors.LastName ? "is-invalid" : ""}`}
                  id="LastName"
                  value={formData.LastName}
                  onChange={handleInputChange}
                  placeholder="Enter your last name"
                />
                {errors.LastName && (
                  <div className="invalid-feedback">{errors.LastName}</div>
                )}
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="Email">
                  Email <span className="text-danger">*</span>
                </label>
                <input
                  type="email"
                  name="Email"
                  className={`form-control ${errors.Email ? "is-invalid" : ""}`}
                  id="Email"
                  value={formData.Email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                />
                {errors.Email && (
                  <div className="invalid-feedback">{errors.Email}</div>
                )}
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="CompanyName">
                  Company Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="CompanyName"
                  className={`form-control ${errors.CompanyName ? "is-invalid" : ""}`}
                  id="CompanyName"
                  value={formData.CompanyName}
                  onChange={handleInputChange}
                  placeholder="Enter your company name"
                />
                {errors.CompanyName && (
                  <div className="invalid-feedback">{errors.CompanyName}</div>
                )}
              </div>
            </div>
            <div className="row">
              <div className="form-group col-md-6">
                <label htmlFor="PhoneNo">
                  Phone Number <span className="text-danger">*</span>
                </label>
                <input
                  type="tel"
                  name="PhoneNo"
                  className={`form-control ${errors.PhoneNo ? "is-invalid" : ""}`}
                  id="PhoneNo"
                  value={formData.PhoneNo}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                />
                {errors.PhoneNo && (
                  <div className="invalid-feedback">{errors.PhoneNo}</div>
                )}
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="SubDomain">
                  Username <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="SubDomain"
                  className={`form-control ${errors.SubDomain ? "is-invalid" : ""}`}
                  id="SubDomain"
                  value={formData.SubDomain}
                  onChange={handleInputChange}
                  placeholder="Enter your username"
                />
                {errors.SubDomain && (
                  <div className="invalid-feedback">{errors.SubDomain}</div>
                )}
              </div>
            </div>
            <div className="row">
              <div className="col-xl-6 mb-3">
                <FormControl fullWidth>
                  <label className="form-label">
                    Role <span className="text-danger">*</span>
                  </label>
                  <Select
                    name="RoleId"
                    value={formData.RoleId}
                    onChange={handleInputChange}
                    style={{ height: "2.5rem" }}
                  >
                    {role?.map((option) => (
                      <MenuItem
                        key={option.RoleId}
                        value={option.RoleId}
                      >
                        {option.Role}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div className="col-xl-6 mb-3">
                <FormControl fullWidth>
                  <label className="form-label">
                    Package <span className="text-danger">*</span>
                  </label>
                  <Select
                    name="PackageId"
                    value={formData.PackageId}
                    onChange={handleInputChange}
                    style={{ height: "2.5rem" }}
                  >
                    {packages?.map((option) => (
                      <MenuItem
                        key={option.PackageId}
                        value={option.PackageId}
                      >
                        {option.Name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="Password">
                  Password <span className="text-danger">*</span>
                </label>
                <input
                  type="password"
                  name="Password"
                  className={`form-control ${errors.Password ? "is-invalid" : ""}`}
                  id="Password"
                  value={formData.Password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                />
                {errors.Password && (
                  <div className="invalid-feedback">{errors.Password}</div>
                )}
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="confirmPassword">
                  Confirm Password <span className="text-danger">*</span>
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && (
                  <div className="invalid-feedback">{errors.confirmPassword}</div>
                )}
              </div>
            </div>
           
            <p className="mt-2 mb-1 ">&#8226; At least 8 characters</p>
            <p className="mb-1 ">&#8226; At least 1 number</p>
            <p className=" ">&#8226; At least 1 upper case letter</p>
            {/* {registerError && (
              <div className="alert alert-danger mt-3" role="alert">
                {registerError}
              </div>
            )} */}
            <div className="text-center">
              <CustomButtonGreen
                text={
                  isSubmitting 
                  ? "Creating Account..."
                  : "Create Account"
                }
                type="submit"
                disabled={isSubmitting }
              />
             <p className="text-center mt-2">
  Already user? <Link to="/login">Login</Link>
</p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
