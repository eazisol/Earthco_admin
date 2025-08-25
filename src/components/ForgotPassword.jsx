import React, { useState } from "react";
import { forgotPassword, verifyOTP, resetPassword } from "../APIS/auth";
import { toast } from "react-toastify";
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate, Link } from "react-router-dom";
import earthcoLogo from "../assets/img/earthco_logo.png";
import forgotPasswordImage from "../assets/img/loginForm.jpg";

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
      // toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="contact" style={{paddingBottom:"85px"}}>
      <div className="container" data-aos="fade-up">
        <div className="section-title" style={{marginTop: "11.5%"}}> 
          {/* <h2>
            {!showOTP && !showNewPassword 
              ? "Forgot Password" 
              : showOTP 
                ? "Enter OTP" 
                : "Reset Password"}
          </h2>
          <p>
            {!showOTP && !showNewPassword 
              ? "Enter your email address to receive a password reset code." 
              : showOTP 
                ? "Enter the verification code sent to your email." 
                : "Create your new password."}
          </p> */}
        </div>

        <div
          className="d-flex"
          style={{
            width: "100%",
            alignItems: "stretch",
          }}
        >
          {/* Left side - Image */}
          <div
            className="login-image-container"
            style={{
              width: "60%",
              overflow: "hidden",
            }}
          >
            <img
              src={forgotPasswordImage}
              alt="Forgot Password"
              className="img-fluid shadow"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "0",
              }}
            />
          </div>

          {/* Right side - Form */}
         
            

              <form onSubmit={handleSubmit} className="php-email-form"  s style={{
                  width: "40%",
                  padding: "40px",
                  minHeight: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}>
                  <div  className="w-100 d-flex flex-column align-items-center justify-content-center"
                >
                  <h4 style={{ color: '#6DA34D',  textAlign: 'left',width:"100%",fontWeight:"bold",fontSize:"24px" }}>
                  {!showOTP && !showNewPassword 
              ? "Forgot Password" 
              : showOTP 
                ? "Enter OTP" 
                : "Reset Password"}
                   </h4>
                    <p style={{ color: '#909090', marginBottom: '24px', textAlign: 'left',width:"100%",fontSize:"12px" }}>
            {!showOTP && !showNewPassword 
              ? "Enter your email address to receive a password reset code." 
              : showOTP 
                ? "Enter the verification code sent to your email." 
                : "Create your new password."}
          </p>
                <div className="mb-3 w-100">
                  {!showOTP && !showNewPassword ? (
                    <>
                     
                      <input
                        type="email"
                        className={`form-control ${error ? "is-invalid" : ""}`}
                        id="forgotEmail"
                        name="Email"
                        value={Email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        autoFocus
                        style={{ background: '#f4f7fa', border: '1px solid #e0e0e0' }}
                      />
                      {error && <div className="invalid-feedback">{error}</div>}
                    </>
                  ) : showOTP ? (
                    <>
                     
                      <input
                        type="text"
                        className="form-control"
                        id="otp"
                        name="otp"
                        value={otp}
                        onChange={e => setOTP(e.target.value)}
                        placeholder="Enter Verification Code"
                        autoFocus
                        style={{ background: '#f4f7fa', border: '1px solid #e0e0e0' }}
                      />
                    </>
                  ) : (
                    <>
                      <div className="mb-3">
                     
                        <div className="input-group">
                          <input
                            type={showNewPasswordField ? "text" : "password"}
                            className={`form-control ${passwordError ? "is-invalid" : ""}`}
                            id="newPassword"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            placeholder="Enter New Password"
                            autoFocus
                            style={{ background: '#f4f7fa', border: '1px solid #e0e0e0' }}
                          />
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowNewPasswordField(!showNewPasswordField)}
                              edge="end"
                              style={{position: 'absolute', right: '18px',top:'1px', zIndex: '999', height: '100%'}}
                            >
                              {showNewPasswordField ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        </div>
                      </div>
                      <div className="mb-3">
                      
                        <div className="input-group">
                          <input
                            type={showConfirmPasswordField ? "text" : "password"}
                            className={`form-control ${passwordError ? "is-invalid" : ""}`}
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            placeholder="Confirm New Password"
                            style={{ background: '#f4f7fa', border: '1px solid #e0e0e0' }}
                          />
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowConfirmPasswordField(!showConfirmPasswordField)}
                              edge="end"
                              style={{position: 'absolute', right: '18px',top:'1px', zIndex: '999', height: '100%'}}
                            >
                              {showConfirmPasswordField ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        </div>
                        {passwordError && <div className="invalid-feedback" style={{display: 'block'}}>{passwordError}</div>}
                      </div>
                    </>
                  )}
                </div>
                  <button
                    type="submit"
                    className="btn btn-success"
                    style={{
                      background: "#7a9c3a",
                      border: "none",
                      width: "100%",
                      alignSelf: "center",
                      fontSize: "16px",
                    }}
                    disabled={isLoading}
                  >
                    {isLoading ? "Loading..." : (showNewPassword ? "Update Password" :'Submit')}
                  </button>
              
                <div className="text-center mt-3">
                  <p>Remember your password? <Link to="/login" style={{ color: '#6DA34D' }}>Login</Link></p>
                </div>
                </div>
              </form>
            
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;