import React, { useState } from "react";
import { CustomButtonGreen } from "./components/CustomButton";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "./APIS/auth";
import { toast } from "react-toastify";
import earthcoLogo from "./assets/img/earthco_logo.png";
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export const LoginScreen = ({ onClose }) => {
  const [formData, setFormData] = useState({
    Email: "",
    Password: "",
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
      console.log("🚀 ~ handleSubmit ~ response:", response?.status)
      if(response?.status === 'success'){
        toast.success(response?.response?.data );
        navigate("/dashboard");
      }else{
        toast.error(response?.response?.data );
      }
      if (response?.error) {
        throw new Error(response.message || "Login failed");
      }
      // if (onClose) onClose();
      // navigate("/dashboard");

    } catch (error) {
      setApiError(error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh", background: "#f8f9fa" }}>
      <div className="card" style={{ width: "500px", border: "none", boxShadow: "0 2px 16px rgba(100, 100, 111, 0.2)" }}>
        <div className="text-center mt-4 mb-2">
          <img src={earthcoLogo} alt="earthco logo" style={{ width: 170, marginBottom: 8 }} />
        </div>
        <div className="px-4 pb-4">
          <h5 className="mb-1" style={{ fontWeight: 600 }}>Personal Information</h5>
          <p className="" style={{ color: '#888', fontSize: 14 }}>Enter your e-mail address and your password.</p>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="email"
                className={`form-control ${errors.Email ? "is-invalid" : ""}`}
                id="loginEmail"
                name="Email"
                value={formData.Email}
                onChange={handleChange}
                placeholder="Enter your email"
                autoFocus
                style={{ background: '#f4f7fa', border: '1px solid #e0e0e0' }}
              />
              {errors.Email && <div className="invalid-feedback">{errors.Email}</div>}
            </div>
            <div className="mb-3 position-relative">
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  className={`form-control ${errors.Password ? "is-invalid" : ""}`}
                  id="loginPassword"
                  name="Password"
                  value={formData.Password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  style={{ background: '#f4f7fa', border: '1px solid #e0e0e0' }}
                />
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    style={{position: 'absolute', right: '10px', top:'2px', zIndex: '999', height: '100%'}}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              </div>
              {errors.Password && <div className="invalid-feedback">{errors.Password}</div>}
            </div>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="form-check">
                {/* <input
                  className="form-check-input"
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                <label className="form-check-label" htmlFor="rememberMe" style={{ fontSize: 14 }}>
                  Remember me
                </label> */}
              </div>
              <Link to="/forgot-password" style={{ fontSize: 14, color: '#6DA34D', textDecoration: 'none' }}>Forgot Password ?</Link>
            </div>
            {/* {apiError && <div className="alert alert-danger text-center">{apiError}</div>} */}
            <button
              type="submit"
              className="btn btn-success w-100 mb-2"
              style={{ background: '#7a9c3a', border: 'none', }}
              disabled={isSubmitting}
            >
              {isSubmitting ? "SIGNING IN..." : "SIGN ME IN"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
