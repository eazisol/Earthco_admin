import React, { useState } from "react";
import { CustomButtonGreen } from "./components/CustomButton";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "./APIS/auth";
import { toast } from "react-toastify";
import earthcoLogo from "./assets/img/earthco_logo.png";
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import loginImage from "./assets/img/loginForm.jpg";

export const LoginScreen = ({ onClose }) => {
  const [formData, setFormData] = useState({
    Email: "",
    Password: "",
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  console.log("🚀 ~ LoginScreen ~ apiError:", apiError)
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  // Check for existing token on component mount
  React.useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        if (parsedUser?.token?.data) {
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
      }
    }
  }, [navigate]);

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

  // const handleSubmit = async () => {
  //   // e.preventDefault();
  //   setApiError("");
  //   if (!validateForm()) return;

  //   setIsSubmitting(true);

  //   try {
  //     const response = await loginUser({
  //       body: {
  //         Email: formData.Email,
  //         Password: formData.Password,
  //       },
  //     });
  //     if (response?.status === 'success') {
  //       toast.success(response?.response?.data);
  //       navigate("/dashboard");
  //     } else {
  //       toast.error(response?.response?.data);
  //     }
  //     if (response?.error) {
  //       throw new Error(response.message );
  //     }
  //     // if (onClose) onClose();
  //     // navigate("/dashboard");

  //   } catch (error) {
  //     setApiError(error.message );
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };
  const handleSubmit = async () => {
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
  
      if (response?.status === "success") {
        toast.success(response?.response?.data);
        navigate("/dashboard");
        setApiError("");
      } else {
        // toast.error(response?.response?.data);
        setApiError(response?.response?.data);
      }
  
      if (response?.error) {
        throw new Error(response.message);
      }
    } catch (error) {
      setApiError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <section className="contact" style={{ paddingBottom: "60px" }}>
      <div className="container" data-aos="fade-up">
        <div className="section-title" style={{ marginTop: "9%" }}>

        </div>

        <div
          className="d-flex"
          style={{
            width: "100%",
            alignItems: "stretch",
            boxShadow: "0 0 24px 0 rgba(0, 0, 0, 0.12)",
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
              src={loginImage}
              alt="Login"
              className="img-fluid shadow"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "0",

              }}
            />
          </div>

          <div
            className="php-email-form d-flex flex-column align-items-center justify-content-center"
            style={{
              width: "40%",
              padding: "40px",
              minHeight: "100%",

            }}
          >

            <div
              className="w-100 d-flex flex-column align-items-center"

            >
              <h4 style={{ color: '#6DA34D', textAlign: 'left', width: "100%", fontWeight: "bold", fontSize: "24px" }}>
                Welome Back!
              </h4>

              <p style={{
                fontSize: 12,
                color: "#909090", marginBottom: '24px', textAlign: 'left', width: "100%"
              }}>
                Access your Earthco account to manage your landscaping services, view project updates, and more.
              </p>
{apiError !== "" && (
  <div className="alert alert-danger alert-dismissible fade show" role="alert" style={{width:"100%"}}>
 {apiError}
  <button className="btn-close" onClick={()=>setApiError("")}></button>
</div>
)}
              <div className="mb-3 w-100">
                <input
                  type="email"
                  className={`form-control ${errors.Email ? "is-invalid" : ""}`}
                  id="loginEmail"
                  name="Email"
                  value={formData.Email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  autoFocus
                  style={{
                    background: "#f4f7fa",
                    border: "1px solid #e0e0e0",
                  }}
                />
                {errors.Email && (
                  <div className="invalid-feedback">{errors.Email}</div>
                )}
              </div>
              <div className="position-relative w-100">
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`form-control ${errors.Password ? "is-invalid" : ""}`}
                    id="loginPassword"
                    name="Password"
                    value={formData.Password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    style={{
                      background: "#f4f7fa",
                      border: "1px solid #e0e0e0",
                    }}
                    autoComplete="current-password"
                  />
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "2px",
                        zIndex: "999",
                        height: "100%",
                      }}
                      tabIndex={-1}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                </div>
                {/* Always render the error div to ensure it shows up when needed */}
                <div
                  className="invalid-feedback"
                  style={{
                    display: errors.Password ? "block" : "none",
                  }}
                >
                  {errors.Password}
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-4 w-100">
                <div className="form-check"></div>
                <Link
                  to="/forgot-password"
                  style={{
                    fontSize: 14,
                    color: "#6DA34D",
                    textDecoration: "none",
                    marginLeft: "auto",
                  }}
                >
                  Forgot Password ?
                </Link>
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                className="btn btn-success mb-2 "
                style={{
                  background: "#7a9c3a",
                  border: "none",
                  width: "100%",
                  borderRadius: "50px",
                  // maxWidth: 250,
                  alignSelf: "center",
                  fontSize: "16px",
                }}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing In..." : "Sign In"}
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
