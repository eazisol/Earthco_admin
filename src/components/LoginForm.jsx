import React, { useState } from "react";
import { CustomButtonGreen } from "./CustomButton";
import useApi from "../hooks/useApi";
import { Link } from "react-router-dom";

export const LoginForm = () => {
  const [formData, setFormData] = useState({
    Name: "",
    Email: "",
    Password: "",
    confirmPassword: "",
    SubDomain: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Register API hook
  const { execute: registerUser, loading: registerLoading, error: registerError } = useApi('https://admin.earthcoapp.com/admin/api/Accounts/RegisterTenant', {
    method: 'POST',
    immediate: false
  });

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

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data for API call (remove confirmPassword as it's not needed on backend)
      const { confirmPassword, ...registerData } = formData;
      
      // Make API call using useApi hook
      const response = await registerUser('https://admin.earthcoapp.com/admin/api/Accounts/RegisterTenant', {
        method: 'POST',
        body: registerData
      });

      console.log("Registration successful:", response);

      // Reset form after successful submission
      setFormData({
        Name: "",
        Email: "",
        Password: "",
        confirmPassword: "",
        SubDomain: "",
      });

      alert("Registration successful! Please check your email to verify your account.");
    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="contact">
      <div className="container" data-aos="fade-up">
        <div className="section-title">
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
                <label htmlFor="name">
                  Your Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="Name"
                  className={`form-control ${errors.Name ? "is-invalid" : ""}`}
                  id="name"
                  value={formData.Name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />
                {errors.Name && (
                  <div className="invalid-feedback">{errors.Name}</div>
                )}
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="email">
                  Your Email <span className="text-danger">*</span>
                </label>
                <input
                  type="email"
                  name="Email"
                  className={`form-control ${errors.Email ? "is-invalid" : ""}`}
                  id="email"
                  value={formData.Email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                />
                {errors.Email && (
                  <div className="invalid-feedback">{errors.Email}</div>
                )}
              </div>
            </div>
            <div className="row">
              <div className="form-group col-md-6">
                <label htmlFor="password">
                  Password <span className="text-danger">*</span>
                </label>
                <input
                  type="password"
                  name="Password"
                  className={`form-control ${
                    errors.Password ? "is-invalid" : ""
                  }`}
                  id="password"
                  value={formData.Password}
                  onChange={handleChange}
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
                  className={`form-control ${
                    errors.confirmPassword ? "is-invalid" : ""
                  }`}
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && (
                  <div className="invalid-feedback">
                    {errors.confirmPassword}
                  </div>
                )}
              </div>
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="dbName">
                Entity Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="SubDomain"
                className={`form-control ${errors.SubDomain ? "is-invalid" : ""}`}
                id="dbName"
                value={formData.SubDomain}
                onChange={handleChange}
                placeholder="Enter Entity name"
              />
              {errors.SubDomain && (
                <div className="invalid-feedback">{errors.SubDomain}</div>
              )}
            </div>
            <p className="mt-2 mb-1 ">&#8226; At least 8 characters</p>
            <p className="mb-1 ">&#8226; At least 1 number</p>
            <p className=" ">&#8226; At least 1 upper case letter</p>
            {registerError && (
              <div className="alert alert-danger mt-3" role="alert">
                {registerError}
              </div>
            )}
            <div className="text-center">
              <CustomButtonGreen
                text={
                  isSubmitting || registerLoading
                  ? "Creating Account..."
                  : "Create Account"
                }
                type="submit"
                disabled={isSubmitting || registerLoading}
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
