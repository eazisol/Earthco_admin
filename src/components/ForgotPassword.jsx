import React, { useState } from "react";
import { forgotPassword, verifyOTP, resetPassword } from "../APIS/auth";
import { toast } from "react-toastify";
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import earthcoLogo from "../assets/img/earthco_logo.png";

const ForgotPassword = () => {
  const [Email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [otp, setOTP] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showNewPasswordField, setShowNewPasswordField] = useState(false);
  const [showConfirmPasswordField, setShowConfirmPasswordField] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePasswords = () => {
    if (!newPassword) {
      setPasswordError("New password is required");
      return false;
    }
    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return false;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setPasswordError("");
    setIsLoading(true);

    try {
      if (!showOTP && !showNewPassword) {
        if (!Email) {
          setError("Email is required");
          return;
        }
        if (!validateEmail(Email)) {
          setError("Please enter a valid email address");
          return;
        }
        const response = await forgotPassword({Email});
        if(response?.status == 200){
          toast.success(response?.data?.Message);
          setShowOTP(true);
        }else{
          toast.error(response?.response?.data);
        }
      } else if (showOTP && !showNewPassword) {
        const response = await verifyOTP({Email,Code:otp});
        if(response?.status == 200){
          toast.success(response?.data);
          setShowOTP(false);
          setShowNewPassword(true);
        }else{
          toast.error(response?.response?.data);
        }
      } else {
        if (!validatePasswords()) {
          return;
        }
        const response = await resetPassword({
          Email: Email,
          NewPassword: newPassword,
          ConfirmPassword: confirmPassword
        });
        if(response?.status == 200){
          toast.success(response?.data?.Message);
          navigate("/login");
        }else{
          toast.error(response?.response?.data);
        }
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div className="card" style={{ width: "28%", border: "none", boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px" }}>
        <div className="text-center mt-4 mb-2">
          <img src={earthcoLogo} alt="earthco logo" style={{ width: 170, marginBottom: 8 }} />
        </div>
       
        <div className="card-body">
     
          <h4 style={{marginLeft:"15px"}}>
            {!showOTP && !showNewPassword 
              ? "Forgot Password" 
              : showOTP 
                ? "Enter OTP" 
                : "Reset Password"}
          </h4>
      
          <form onSubmit={handleSubmit} className="px-3 pb-3">
            <div className="mb-3">
              {!showOTP && !showNewPassword ? (
                <>
                  <label htmlFor="forgotEmail" className="form-label">Email</label>
                  <input
                    type="type"
                    className={`form-control ${error ? "is-invalid" : ""}`}
                    id="forgotEmail"
                    name="Email"
                    value={Email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    autoFocus
                  />
                  {error && <div className="invalid-feedback">{error}</div>}
                </>
              ) : showOTP ? (
                <>
                  <label htmlFor="otp" className="form-label">Enter OTP</label>
                  <input
                    type="text"
                    className="form-control"
                    id="otp"
                    name="otp"
                    value={otp}
                    onChange={e => setOTP(e.target.value)}
                    placeholder="Enter OTP sent to your email"
                    autoFocus
                  />
                </>
              ) : (
                <>
                  <div className="mb-3">
                    <label htmlFor="newPassword" className="form-label">New Password</label>
                    <div className="input-group">
                      <input
                        type={showNewPasswordField ? "text" : "password"}
                        className={`form-control ${passwordError ? "is-invalid" : ""}`}
                        id="newPassword"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        autoFocus
                      />
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowNewPasswordField(!showNewPasswordField)}
                          edge="end"
                          style={{position: 'absolute', right: '10px',top:'1px', zIndex: '999', height: '100%'}}
                        >
                          {showNewPasswordField ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                    <div className="input-group">
                      <input
                        type={showConfirmPasswordField ? "text" : "password"}
                        className={`form-control ${passwordError ? "is-invalid" : ""}`}
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                      />
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPasswordField(!showConfirmPasswordField)}
                          edge="end"
                          style={{position: 'absolute', right: '10px',top:'1px', zIndex: '999', height: '100%'}}
                        >
                          {showConfirmPasswordField ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    </div>
                    {passwordError && <div className="invalid-feedback">{passwordError}</div>}
                  </div>
                </>
              )}
            </div>
            <div className="d-flex justify-content-between gap-2">
              <button
                type="button"
                className="btn btn-success"
                style={{ background: '#7a9c3a', border: 'none' }}
                onClick={() => window.history.back()}
                disabled={isLoading}
              >
                Back
              </button>
              <button
                type="submit"
                className="btn btn-success"
                style={{ background: '#7a9c3a', border: 'none' }}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : (showNewPassword ? "Update Password" : (showOTP ? "Verify OTP" : "Submit"))}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;