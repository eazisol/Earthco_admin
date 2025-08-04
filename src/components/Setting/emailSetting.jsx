import DashboardLayout from "../DashboardLayout/DashboardLayout";
import { CircularProgress, FormControl, MenuItem, Select, TextField, IconButton, InputAdornment, Alert, AlertTitle } from "@mui/material";
import { useEffect, useState } from "react";
import { addEmailSetting, getEmailSetting } from "../../APIS/settings";
import { toast } from "react-toastify";
import { Visibility, VisibilityOff } from '@mui/icons-material';

export const EmailScreen = () => {
  const [settingData, setSettingData] = useState({});
  const [formData, setFormData] = useState({
    Email: "",
    EmailPassword: "",
    EmailPort: 0,
    EmailSSL: false,
    EmailHost: "",
    EmailClientId: "",
    EmailClientSecret: "",
    EmailMode: 1
  });

  const [errors, setErrors] = useState({
    Email: "",
    EmailPassword: "",
    EmailHost: "",
    EmailClientId: "",
    EmailPort: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showClientSecret, setShowClientSecret] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    if (!email) {
      return "Email is required";
    }
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const validatePassword = (password) => {
    if (!password) {
      return "Password is required";
    }
    if (password.length < 8) {
      return "Password must be at least 8 characters";
    }
    return "";
  };

  const validateHost = (host) => {
    if (!host) {
      return "SMTP Host is required";
    }
    const hostRegex = /^(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,})|(?:\d{1,3}(?:\.\d{1,3}){3}))$/;
    if (!hostRegex.test(host)) {
      return "Please enter a valid domain or IP address";
    }
    return "";
  };

  const validateClientId = (clientId) => {
    if (!clientId) return "";
    const clientIdRegex = /^[a-zA-Z0-9-_.]+$/;
    if (!clientIdRegex.test(clientId)) {
      return "Client ID must contain only letters, numbers, hyphens, underscores and periods";
    }
    return "";
  };

  const validatePort = (port) => {
    if (!port) {
      return "Port is required";
    }
    const portNum = Number(port);
    if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
      return "Port must be a number between 1 and 65535";
    }
    return "";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "Email") {
      setErrors(prev => ({
        ...prev,
        Email: validateEmail(value)
      }));
    }

    if (name === "EmailPassword") {
      setErrors(prev => ({
        ...prev,
        EmailPassword: validatePassword(value)
      }));
    }

    if (name === "EmailHost") {
      setErrors(prev => ({
        ...prev,
        EmailHost: validateHost(value)
      }));
    }

    if (name === "EmailClientId") {
      setErrors(prev => ({
        ...prev,
        EmailClientId: validateClientId(value)
      }));
    }

    if (name === "EmailPort") {
      setErrors(prev => ({
        ...prev,
        EmailPort: validatePort(value)
      }));
    }
  };

  const getSetting = async () => {
    setLoading(true);
    const user=JSON.parse(localStorage.getItem('user'));
    const response = await getEmailSetting(user?.Data?.TenantId);
    setSettingData(response?.data);
    setFormData({
      Email: response?.data?.Email || "",
      EmailPassword: response?.data?.EmailPassword || "",
      EmailPort: response?.data?.EmailPort || 0,
      EmailSSL: response?.data?.EmailSSL || false,
      EmailHost: response?.data?.EmailHost || "",
      EmailClientId: response?.data?.EmailClientId || "",
      EmailClientSecret: response?.data?.EmailClientSecret || "",
      EmailMode: response?.data?.EmailMode || 1
    });
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const emailError = validateEmail(formData.Email);
    const passwordError = validatePassword(formData.EmailPassword);
    const hostError = validateHost(formData.EmailHost);
    const clientIdError = validateClientId(formData.EmailClientId);
    const portError = validatePort(formData.EmailPort);
    
    setErrors(prev => ({
      ...prev,
      Email: emailError,
      EmailPassword: passwordError,
      EmailHost: hostError,
      EmailClientId: clientIdError,
      EmailPort: portError
    }));

    if (emailError || passwordError || hostError || clientIdError || portError) {
      setLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('Files', null);
    
    const settingDataToSend = {
      ...settingData,
      Email: formData.Email,
      EmailPassword: formData.EmailPassword,
      EmailPort: Number(formData.EmailPort),
      EmailSSL: formData.EmailSSL,
      EmailHost: formData.EmailHost,
      EmailClientId: formData.EmailClientId,
      EmailClientSecret: formData.EmailClientSecret,
      EmailMode: formData.EmailMode,
    };

    if (!formData.Email || !formData.EmailPassword || !formData.EmailPort || !formData.EmailHost) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      formDataToSend.append('SettingData', JSON.stringify(settingDataToSend));
      const response = await addEmailSetting(formDataToSend);
      
      if(response) {
        toast.success(response?.Message);
        getSetting();
      }
    } catch (error) {
      setLoading(false);
      toast.error("Failed to save email settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSetting();
  }, []);

  return (
    <DashboardLayout>
      <div className="content-body">
        <div className="page-titles">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="javascript:void(0)">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M13.5096 2.53165H7.41104C5.50437 2.52432 3.94146 4.04415 3.89654 5.9499V15.7701C3.85437 17.7071 5.38979 19.3121 7.32671 19.3552C7.35512 19.3552 7.38262 19.3561 7.41104 19.3552H14.7343C16.6538 19.2773 18.1663 17.6915 18.1525 15.7701V7.36798L13.5096 2.53165Z" stroke="#888888" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M13.2688 2.52084V5.18742C13.2688 6.48909 14.3211 7.54417 15.6228 7.54784H18.1482" stroke="#888888" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M13.0974 14.0786H8.1474" stroke="#888888" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M11.2229 10.6388H8.14655" stroke="#888888" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Email Settings
              </a>
            </li>
          </ol>
        </div>

        <div className="container-fluid">
          <div className="row table-space">
            <div className="col-xl-6">
              <div className="card">
                <div className="card-body">
                  <div className="row">
                    <h4 className="card-title mb-4 col-xl-8">Email Settings</h4>
                    <div className="col-xl-4 mb-3 ml-2 d-flex justify-content-end align-items-center" style={{ position: "relative" }}>
                      <div className="form-check form-switch d-flex align-items-center" style={{ width: "fit-content" }}>
                        <label className="form-check-label mb-0 me-2" style={{ whiteSpace: "nowrap" }}>
                          {formData.EmailMode == 2 ? "Production" : "Sandbox"}
                        </label>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="EmailMode"
                          checked={formData.EmailMode == 2}
                          onChange={(e) => {
                            setFormData((prev) => ({
                              ...prev,
                              EmailMode: e.target.checked ? 2 : 1
                            }))
                          }}
                          style={{ marginLeft: "12px" }}
                        />
                      </div>
                    </div>
                
                  </div>
             
              {/* {loading ? <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden"><CircularProgress /></span>
            </div>
           </div> 
           :   */}
           <>
                 <div className="row">
                    <div className="col-xl-6 mb-3">
                      <label className="form-label">Email Address<span className="text-danger">*</span></label>
                      <TextField
                        name="Email"
                        value={formData.Email}
                        onChange={handleInputChange}
                        size="small"
                        fullWidth
                        error={!!errors.Email}
                        helperText={errors.Email}
                      />
                    </div>

                    <div className="col-xl-6 mb-3">
                      <label className="form-label">Password<span className="text-danger">*</span></label>
                      <TextField
                        name="EmailPassword"
                        type={showPassword ? "text" : "password"}
                        value={formData.EmailPassword}
                        onChange={handleInputChange}
                        size="small"
                        fullWidth
                        error={!!errors.EmailPassword}
                        helperText={errors.EmailPassword}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </div>

                    <div className="col-xl-6 mb-3">
                      <label className="form-label">Port<span className="text-danger">*</span></label>
                      <TextField
                        name="EmailPort"
                        value={formData.EmailPort}
                        onChange={handleInputChange}
                        size="small"
                        fullWidth
                        type="number"
                        error={!!errors.EmailPort}
                        helperText={errors.EmailPort}
                        inputProps={{
                          min: 1,
                          max: 65535
                        }}
                      />
                    </div>

                    <div className="col-xl-6 mb-3">
                      <FormControl fullWidth>
                        <label className="form-label">SSL/TLS<span className="text-danger">*</span></label>
                        <Select
                          name="EmailSSL"
                          value={formData.EmailSSL ? "true" : "false"}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              EmailSSL: e.target.value === "true",
                            }))
                          }
                          style={{ height: "2.5rem" }}
                        >
                          <MenuItem value="true">Yes</MenuItem>
                          <MenuItem value="false">No</MenuItem>
                        </Select>
                      </FormControl>
                    </div>

                    <div className="col-xl-6 mb-3">
                      <label className="form-label">SMTP Host<span className="text-danger">*</span></label>
                      <TextField
                        name="EmailHost"
                        value={formData.EmailHost}
                        onChange={handleInputChange}
                        size="small"
                        fullWidth
                        error={!!errors.EmailHost}
                        helperText={errors.EmailHost}
                        placeholder="e.g., smtp.gmail.com"
                      />
                    </div>
                    <div style={{ width: "100%" }}>
                      <Alert
                        severity="info"
                        className="mb-4"
                        style={{ width: "100%" }}
                      >
                        <AlertTitle>Info</AlertTitle>
                        <strong>How to set up your email settings:</strong>
                        <ol style={{ marginLeft: 16 }}>
                          <li>
                            If you are using OAuth (advanced), you need to provide <b>Client ID</b> and <b>Client Secret</b>.<br />
                            <span style={{ fontSize: "0.95em" }}>
                              To get your Client ID and Client Secret for Gmail:
                              <ol style={{ marginLeft: 16 }}>
                                <li>Go to <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer">Google Cloud Console</a>.</li>
                                <li>Create a new project or select an existing one.</li>
                                <li>Enable the Gmail API for your project.</li>
                                <li>Go to "Credentials" and click "Create Credentials" &rarr; "OAuth client ID".</li>
                                <li>Configure the consent screen if prompted.</li>
                                <li>Select "Web application" and set the authorized redirect URIs as needed.</li>
                                <li>After creation, you will see your <b>Client ID</b> and <b>Client Secret</b>.</li>
                              </ol>
                            </span>
                          </li>
                          {/* <li>
                            Choose the <b>Email Mode</b> (1 for SMTP, 2 for OAuth).
                          </li> */}
                          <li>
                            Click <b>Save</b> to apply your settings.
                          </li>
                        </ol>
                      </Alert>
                    </div>
                    <div className="col-xl-12 mb-3">
                      <label className="form-label">Client ID</label>
                      <TextField
                        name="EmailClientId"
                        value={formData.EmailClientId}
                        onChange={handleInputChange}
                        size="small"
                        fullWidth
                        error={!!errors.EmailClientId}
                        helperText={errors.EmailClientId}
                        placeholder="Enter alphanumeric client ID"
                      />
                    </div>

                    <div className="col-xl-12 mb-3">
                      <label className="form-label">Client Secret</label>
                      <TextField
                        name="EmailClientSecret"
                        type={showClientSecret ? "text" : "password"}
                        value={formData.EmailClientSecret}
                        onChange={handleInputChange}
                        size="small"
                        fullWidth
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowClientSecret(!showClientSecret)}
                                edge="end"
                              >
                                {showClientSecret ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </div>

                  
                  </div>
                    <div className="mt-3 d-flex justify-content-end">
                    <button className="btn btn-primary btn-sm" onClick={handleSubmit}>
                
                    {/* {loading ? "Updating..." : "Update Settings"} */}
                     Update Settings
                  </button>
                </div></>
                {/* } */}

                
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
