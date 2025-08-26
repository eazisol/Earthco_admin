import DashboardLayout from "../DashboardLayout/DashboardLayout";
import { CircularProgress, FormControl, MenuItem, Select, TextField, IconButton, InputAdornment, Alert, AlertTitle } from "@mui/material";
import { useEffect, useState } from "react";
import { addEmailSetting, getEmailSetting } from "../../APIS/settings";
import { toast } from "react-toastify";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import TitleBar from "../TitleBar";

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
    if (!clientId) return "Client ID is required";
    return "";
  };
  const validateClientSecret = (clientSecret) => {
    if (!clientSecret) return "Client Secret is required";
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
    if (name === "EmailClientSecret") {
      setErrors(prev => ({
        ...prev,
        EmailClientSecret: validateClientSecret(value)
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
      EmailMode: response?.data?.EmailMode || 1,
      TermsAndCondition: undefined,
      PrivacyPolicy: undefined
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
      TermsAndCondition: undefined,
      PrivacyPolicy: undefined
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
        <TitleBar title="Email Settings" />
       

        <div className="container-fluid">
          <div className="row table-space">
            <div className="col-xl-6">
              <div className="card shadow-sm rounded-card">
                <div className="card-body">
                  <div className="row">
                    <h4 className="card-title mb-4 col-xl-8">Mail Server Setup</h4>
                    <div className="col-xl-4 mb-3 ml-2 d-flex justify-content-end align-items-center" style={{ position: "relative" }}>
                      {/* <div className="form-check form-switch d-flex align-items-center" style={{ width: "fit-content" }}>
                        <label 
                          className="form-check-label mb-0 me-2" 
                          style={{ whiteSpace: "nowrap", cursor: "pointer" }}
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              EmailMode: formData.EmailMode == 2 ? 1 : 2
                            }))
                          }}
                        >
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
                      </div> */}
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
                      <TextField
                      label="Email Address"
                      variant="outlined"
                      required
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
                      <TextField
                      label="Password"
                      variant="outlined"
                      required
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

                    <div className="col-xl-6 mb-3 mt-3">
                      <TextField
                      label="Port"
                      variant="outlined"
                      required
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

                    <div className="col-xl-6 mb-3 mt-3">
                     <FormControl fullWidth>
                      <TextField
                    id="outlined-select-type"
                    select
                    label="SSL/TLS"
                    variant="outlined"
                    required
                      name="EmailSSL"
                    value={formData.EmailSSL ? "true" : "false"}
                    onChange={handleInputChange}
                    size="small"
                    error={!!errors.EmailSSL}
                    defaultValue={formData.EmailSSL ? "true" : "false"}
                    // helperText="Please select your type"
                    helperText={errors.EmailSSL}
                  >
                    <MenuItem value="true">Yes</MenuItem>
                    <MenuItem value="false">No</MenuItem>
                  </TextField>
                  </FormControl>
                      </div>

                    <div className="col-xl-6 mb-3 mt-3">
                      <TextField
                      label="SMTP Host"
                      variant="outlined"
                      required
                        name="EmailHost"
                        value={formData.EmailHost}
                        onChange={handleInputChange}
                        size="small"
                        fullWidth
                        error={!!errors.EmailHost}
                        helperText={errors.EmailHost}
                        // placeholder="e.g., smtp.gmail.com"
                      />
                    </div>
                    <div className="col-xl-12 mt-3">
                    <Alert
                        severity="info"
                        className="mb-4"
                        style={{ width: "100%" }}
                      >
                        <AlertTitle>Info</AlertTitle>
                        <strong>How to set up your email settings:</strong>
                        <p>If you are using OAuth (advanced), you need to provide <b>Client ID</b> and <b>Client Secret</b>.</p>
                        <ol style={{ marginTop: -10 }}>
                          <li>
                            <span style={{ fontSize: "0.95em" }}>
                              To get your Client ID and Client Secret for Gmail:
                              <ul style={{ marginLeft: 16,listStyle: "disc" }}>
                                <li> Go to <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer">Google Cloud Console</a>.</li>
                                <li> Create a new project or select an existing one.</li>
                                <li> Enable the Gmail API for your project.</li>
                                <li> Go to "Credentials" and click "Create Credentials" &rarr; "OAuth client ID".</li>
                                <li> Configure the consent screen if prompted.</li>
                                <li> Select "Web application" and set the authorized redirect URIs as needed.</li>
                                <li> After creation, you will see your <b>Client ID</b> and <b>Client Secret</b>.</li>
                              </ul>
                            </span>
                          </li>
                          {/* <li>
                            Choose the <b>Email Mode</b> (1 for SMTP, 2 for OAuth).
                          </li> */}
                          <li>
                            Click <b>Update Settings</b> to apply your settings.
                          </li>
                        </ol>
                      </Alert>
                      </div>
                    <div className="col-xl-12 mb-3 mt-3">
                      <TextField
                      label="Client ID"
                      variant="outlined"
                      required
                        name="EmailClientId"
                        value={formData.EmailClientId}
                        onChange={handleInputChange}
                        size="small"
                        fullWidth
                        error={!!errors.EmailClientId}
                        helperText={errors.EmailClientId}
                        // placeholder="Enter alphanumeric client ID"
                      />
                    </div>

                    <div className="col-xl-12 mb-3 mt-3">
                      <TextField
                      label="Client Secret"
                      variant="outlined"
                      required
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
                    <button className="btn btn-primary btn-sm" onClick={handleSubmit} disabled={loading}>
                
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
