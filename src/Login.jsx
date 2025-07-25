import React, { useState } from "react";
import { CustomButtonGreen } from "./components/CustomButton";
import { useNavigate } from "react-router-dom";
import { loginUser } from "./APIS/auth";

export const LoginScreen = ({ onClose }) => {
  const [formData, setFormData] = useState({
    Email: "",
    Password: "",
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  const validateForm = () => {
    const newErrors = {};
    if (!formData.Email) {
      newErrors.Email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.Email)) {
      newErrors.Email = "Please enter a valid email address";
    }
    if (!formData.Password) {
      newErrors.Password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setApiError("");
  if (!validateForm()) return;

  setIsSubmitting(true);

  try {
    const response = await loginUser({
      body: {
        Email: formData.Email,
        Password: formData.Password,
      },
    });
    if (response?.error) {
      throw new Error(response.message || "Login failed");
    }
    if (onClose) onClose();
    navigate("/dashboard");

  } catch (error) {
    setApiError(error.message || "Something went wrong");
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <div className="  login-screen" tabIndex="-1" >
      <div className="card" style={{width: "28%",border:"none",boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"}} >
        <div className="text-center">
          <h4 className="pt-2 pb-2 mt-3">Login</h4>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit} className="px-3 pb-3">
            <div className="mb-3">
              <label htmlFor="loginEmail" className="form-label">Email</label>
              <input
                type="test"
                className={`form-control ${errors.Email ? "is-invalid" : ""}`}
                id="loginEmail"
                name="Email"
                value={formData.Email}
                onChange={handleChange}
                placeholder="Enter your email"
                autoFocus
              />
              {errors.Email && <div className="invalid-feedback">{errors.Email}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="loginPassword" className="form-label">Password</label>
              <input
                type="password"
                className={`form-control ${errors.Password ? "is-invalid" : ""}`}
                id="loginPassword"
                name="Password"
                value={formData.Password}
                onChange={handleChange}
                placeholder="Enter your password"
              />
              {errors.Password && <div className="invalid-feedback">{errors.Password}</div>}
            </div>
            {apiError && <div className="alert alert-danger text-center">{apiError}</div>}
            <div className="d-grid gap-2">
              <CustomButtonGreen
                text={isSubmitting ? "Logging in..." : "Login"}
                type="submit"
                disabled={isSubmitting}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
