import React, { useState } from "react";
import { forgotPassword, verifyOTP, resetPassword } from "../APIS/auth";
import { toast } from "react-toastify";
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate, Link } from "react-router-dom";
import earthcoLogo from "../assets/img/earthco_logo.png";
import forgotPasswordImage from "../assets/img/loginForm.jpg";
import OtpInput from 'react-otp-input';
const ForgotPassword = () => {
  const [Email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [otp, setOTP] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showNewPasswordField, setShowNewPasswordField] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showConfirmPasswordField, setShowConfirmPasswordField] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  // Scrolls a bit above the contact section for better visibility
  const scrollToContact = () => {
    navigate('/', { replace: true });
    // const contactSection = document.getElementsByClassName('contact');
    // if (contactSection) {
    //   contactSection.scrollIntoView({ behavior: 'smooth' });
    // }
  };
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePasswords = () => {
    if (!newPassword) {
      setPasswordError("New password is required");
      return false;
    }
    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return false;
    }
    if (!/[A-Z]/.test(newPassword)) {
      setPasswordError("Must contain at least one uppercase letter");
      return false;
    }
    if (!/\d/.test(newPassword)) {
      setPasswordError("Must contain at least one number");
      return false;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
      setPasswordError("Must contain at least one special character");
      return false;
    }
   

   
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setPasswordError("");
    setConfirmPasswordError("");
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
        const response = await forgotPassword({ Email });
        if (response?.status == 200) {
          toast.success(response?.data?.Message);
          setApiError("");
          setShowOTP(true);
        } else {
          // toast.error(response?.response?.data);
          setApiError(response?.response?.data);
        }
      } else if (showOTP && !showNewPassword) {
        const response = await verifyOTP({ Email, Code: otp });
        if (response?.status == 200) {
          toast.success(response?.data);
          setApiError("");
          setShowOTP(false);
          setShowNewPassword(true);
        } else {
          // toast.error(response?.response?.data);
          setApiError(response?.response?.data);
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
        if (response?.status == 200) {
          toast.success(response?.data?.Message);
          setApiError("");
          window.location.href = "/login";
        } else {
          // toast.error(response?.response?.data);
          setApiError(response?.response?.data);
        }
      }
    } catch (error) {
      setApiError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  const handlePaste = (event) => {
    const data = event.clipboardData.getData('text');
    console.log(data)
  };
  return (
    <section className="contact" style={{ paddingBottom: "60px" }}>
      <div className="container">
        <div className="section-title" style={{ marginTop: "9%" }}>
        </div>

        <div
          className="forgot-password-flex-wrapper d-flex"
          style={{
            width: "100%",
            alignItems: "stretch",
            boxShadow: "0 0 24px 0 rgba(0, 0, 0, 0.12)",
            flexDirection: "row",
            flexWrap: "wrap",
          }}
        >
          <div
            className="login-image-container"
            style={{
              width: "60%",
              overflow: "hidden",
              minWidth: "300px",
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
                minHeight: "180px",
              }}
            />
          </div>

          <form
            onSubmit={handleSubmit}
            className="php-email-form"
            style={{
              width: "40%",
              minWidth: "300px",
              padding: "40px",
              minHeight: "100%",
              display: "flex",
              justifyContent: "center",
              background: "#fff",
            }}
          >
            <div className="w-100 d-flex flex-column align-items-center justify-content-center">
              <h4 style={{ color: '#6DA34D', textAlign: 'left', width: "100%", fontWeight: "bold", fontSize: "24px" }}>
                {!showOTP && !showNewPassword
                  ? "Forgot Password"
                  : showOTP
                    ? "Enter OTP"
                    : "Reset Password"}
              </h4>
              <p style={{ color: '#909090', marginBottom: '24px', textAlign: 'left', width: "100%", fontSize: "12px" }}>
                {!showOTP && !showNewPassword
                  ? "Enter your email address to receive a password reset code."
                  : showOTP
                    ? (
                      <>
                        Please enter the verification code we sent to your email. If you haven’t received the email, first check your spam or junk folder. If it’s not there, then contact us for further assistance.
                      </>
                    )
                    : "Create your new password."}
              </p>
              {apiError !== "" && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert" style={{ width: "100%" }}>
                  {apiError}
                  <button className="btn-close" onClick={() => setApiError("")}></button>
                </div>
              )}
              <div className="mb-3 w-100">
                {!showOTP && !showNewPassword ? (
                  <>
                    <input
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSubmit();
                        }
                      }}
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
                    <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "20px" }}>
                      <OtpInput
                        value={otp}
                        onChange={setOTP}
                        numInputs={8}
                        shouldAutoFocus={true}
                        onPaste={handlePaste}
                        renderInput={(props) => <input {...props} />}
                        inputStyle={{ width: "35px", marginRight: "10px" }}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mb-3">
                      <div className="input-group">
                        <input
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleSubmit();
                            }
                          }}
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
                            style={{ position: 'absolute', right: '18px', top: '1px', zIndex: '999', height: '100%' }}
                          >
                            {showNewPasswordField ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      </div>
                      {passwordError && <div className="invalid-feedback" style={{ display: 'block' }}>{passwordError}</div>}
                    </div>
                    <div className="mb-3">
                      <div className="input-group">
                        <input
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleSubmit();
                            }
                          }}
                            type={showConfirmPasswordField ? "text" : "password"}
                          className={`form-control ${confirmPasswordError ? "is-invalid" : ""}`}
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
                            style={{ position: 'absolute', right: '18px', top: '1px', zIndex: '999', height: '100%' }}
                          >
                            {showConfirmPasswordField ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      </div>
                      {confirmPasswordError && <div className="invalid-feedback" style={{ display: 'block' }}>{confirmPasswordError}</div>}
                    </div>
                  </>
                )}
              </div>
              <button
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSubmit();
                  }
                }}
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
                {isLoading ? "Loading..." : (showNewPassword ? "Update Password" : 'Submit')}
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