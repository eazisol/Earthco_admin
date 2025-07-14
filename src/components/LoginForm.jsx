import React, { useState } from "react";
import { CustomButtonGreen } from "./CustomButton";
import useApi from "../hooks/useApi";

export const LoginForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    dbName: "",
  });
  console.log("🚀 ~ LoginForm ~ formData:", formData)

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Register API hook
  const { execute: registerUser, loading: registerLoading, error: registerError } = useApi('/api/auth/register', {
    method: 'POST',
    immediate: false
  });

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters long";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Database name validation
    if (!formData.dbName.trim()) {
      newErrors.dbName = "Database name is required";
    } else if (formData.dbName.trim().length < 3) {
      newErrors.dbName = "Database name must be at least 3 characters long";
    } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.dbName.trim())) {
      newErrors.dbName = "Database name can only contain letters, numbers, hyphens, and underscores";
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
      const response = await registerUser('/api/auth/register', {
        method: 'POST',
        body: registerData
      });

      console.log("Registration successful:", response);

      // Reset form after successful submission
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        dbName: "",
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

        <div className="row">
          {/* Left side - Image */}
          <div className="col-lg-6 d-flex align-items-center justify-content-center">
            <div className="login-image-container">
              <img
                src="/src/assets/img/loginForm.jpg"
                alt="Registration"
                className="img-fluid rounded shadow"
                style={{
                  maxWidth: "100%",
                  height: "465px",
                  // borderRadius: "20px !important",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                }}
              />
            </div>
          </div>

          {/* Right side - Form */}
          <div className="col-lg-6">
            <form onSubmit={handleSubmit} className="registration-form">
                              <div className="row">
                  <div className="form-group col-md-6">
                  <label htmlFor="name" className="form-label-input fw-bold">
                    Full Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    className={`form-control ${
                      errors.name ? "is-invalid" : ""
                    }`}
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <div className="invalid-feedback">{errors.name}</div>
                  )}
                </div>

                <div className="form-group col-md-6">
                  <label htmlFor="email" className="form-label-input fw-bold">
                    Email Address <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>

                <div className="form-group col-md-6">
                  <label htmlFor="dbName" className="form-label-input fw-bold">
                    Database Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="dbName"
                    className={`form-control ${
                      errors.dbName ? "is-invalid" : ""
                    }`}
                    id="dbName"
                    value={formData.dbName}
                    onChange={handleChange}
                    placeholder="Enter database name"
                  />
                  {errors.dbName && <div className="invalid-feedback">{errors.dbName}</div>}
                  {/* {errors.dbName && <div className="invalid-feedback">{errors.dbName}</div>}
                  <small className="form-text text-muted">
                    Use only letters, numbers, hyphens, and underscores
                  </small> */}
                </div>

                <div className="form-group col-md-6">
                  <label htmlFor="password" className="form-label-input fw-bold">
                    Password <span className="text-danger">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    className={`form-control ${
                      errors.password ? "is-invalid" : ""
                    }`}
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                  />
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
                 
                </div>

                <div className="form-group col-md-6">
                  <label
                    htmlFor="confirmPassword"
                    className="form-label-input fw-bold"
                  >
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
              <p className="mt-2 mb-1 footer">&#8226; At least 8 characters</p>
              <p className="mb-1 footer">&#8226; At least 1 number</p>
              <p className=" footer">&#8226; At least 1 upper case letter</p>
              
              {/* Display API errors */}
              {registerError && (
                <div className="alert alert-danger mt-3" role="alert">
                  {registerError}
                </div>
              )}
              <div className="text-center">
                <CustomButtonGreen
                  text={isSubmitting || registerLoading ? "Creating Account..." : "Create Account"}
                  type="submit"
                  disabled={isSubmitting || registerLoading}
                />
              </div>

              {/* <div className="text-center mt-3">
                <p className="mb-0">
                  Already have an account?{" "}
                  <a
                    href="#"
                    className="text-decoration-none"
                    style={{ color: "#3A7D0E" }}
                  >
                    Sign in here
                  </a>
                </p>
              </div> */}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
