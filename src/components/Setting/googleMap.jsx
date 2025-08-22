import DashboardLayout from "../DashboardLayout/DashboardLayout";
  import { CircularProgress, TextField, FormControl, MenuItem, Select, Alert, AlertTitle, IconButton, InputAdornment } from "@mui/material";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { addEmailSetting, getEmailSetting } from "../../APIS/settings";
import TitleBar from "../TitleBar";
import { Visibility, VisibilityOff } from '@mui/icons-material';
export const GoogleSetting = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    GoogelClientId: "",
    GoogleClientSecret: "",
    GoogleMapKey:"",
    SettingId: 0
  });
  const [errors, setErrors] = useState({
    GoogelClientId: "",
    GoogleClientSecret: "",
  });
  const [showClientSecret, setShowClientSecret] = useState(false);
  const [googleMapKey, setGoogleMapKey] = useState(false);
  const validateInput = (name, value) => {
    if (!value) {
      return "This field is required";
    }
    
    return "";
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    
    setErrors(prev => ({
      ...prev,
      [name]: ""
    }));
  };

  const validateForm = () => {
    const newErrors = {
        GoogelClientId: validateInput("GoogelClientId", formData.GoogelClientId),
      GoogleClientSecret: validateInput("GoogleClientSecret", formData.GoogleClientSecret),
    
    };
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const getSettings = async () => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem('user'));
    try {
      const response = await getEmailSetting(user?.Data?.TenantId);
      setFormData({
        ...response?.data,
      });
    } catch (error) {
    
    } finally {
      setLoading(false);
    } 
  };

  useEffect(() => {
    getSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // if (!validateForm()) {
    //   return;
    // }
    
    setLoading(true);
    const formDataToSend = new FormData();
    formDataToSend.append('Files', null);
    const settingDataToSend = {
      ...formData,
      TermsAndCondition: undefined,
      PrivacyPolicy: undefined
    };

    formDataToSend.append('SettingData', JSON.stringify(settingDataToSend));
    try {
      const response = await addEmailSetting(formDataToSend);
      if(response) {
        toast.success(response?.Message);
        getSettings();
      }
    } catch (error) {
      console.error("Error adding google settings:", error);
      toast.error("Failed to update settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="content-body">
      <TitleBar  title="Google Settings" />
        <div className="container-fluid">
          <div className="row table-space">
            <div className="col-xl-6">
              <div className="card shadow-sm rounded-card">
                <div className="card-body">
                  <h4 className="card-title mb-4">Google Settings</h4>
                  {loading ? (
                    <div className="text-center">
                      <div className="spinner-border" role="status">
                        <span className="visually-hidden"><CircularProgress /></span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="row">
                        <div style={{ width: "100%" }}>
                        <Alert   severity="info"
                        className="mb-4"
                        style={{ width: "100%" }}>
                          <AlertTitle style={{ fontSize: "1.1rem",}}>Info</AlertTitle>
                          <strong>How to set up your Google settings:</strong>
                          <p>   You need to provide your <b>Google Client ID</b> and <b>Google Client Secret</b>.</p>
                          <ol style={{ marginTop: -10 }}>
                            <li>
                              <span style={{ fontSize: "0.95em" }}>
                                To get your credentials:
                                <ul style={{ marginLeft: 5, listStyle: "none" }}>
                                  <li>&#8226; Go to <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer">Google Cloud Console</a>.</li>
                                  <li>&#8226; Create a new project or select an existing one.</li>
                                  <li>&#8226; Enable the relevant Google API (e.g., Maps, Places, etc.) for your project.</li>
                                  <li>&#8226; Go to "Credentials" and click "Create Credentials" &rarr; "OAuth client ID".</li>
                                  <li>&#8226; Configure the consent screen if prompted.</li>
                                  <li>&#8226; Select "Web application" and set the authorized redirect URIs as needed.</li>
                                  <li>After creation, you will see your <b>Client ID</b> and <b>Client Secret</b>.</li>
                                </ul>
                              </span>
                            </li>
                            <li>
                              Click <b>Update Settings</b> to apply your changes.
                            </li>
                          </ol>
                        </Alert>
                        </div>
                      
                        <div className="col-xl-12 mb-3">
                          <TextField
                          variant="outlined"
                          label="Client ID"
                          required
                            name="GoogelClientId"
                            value={formData.GoogelClientId}
                            onChange={handleInputChange}
                            size="small"
                            fullWidth
                            error={!!errors.GoogelClientId}
                            helperText={errors.GoogelClientId}
                          />
                        </div>
                        <div className="col-xl-12 mb-3 mt-3">
                            <TextField
                            variant="outlined"
                            label="Client Secret"
                            required
                             type={showClientSecret ? "text" : "password"}
                              name="GoogleClientSecret"
                              value={formData.GoogleClientSecret}
                              onChange={handleInputChange}
                              size="small"
                              fullWidth
                              error={!!errors.GoogleClientSecret}
                              helperText={errors.GoogleClientSecret}
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
                          {loading ? "Updating..." : "Update Settings"}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="col-xl-6">
              <div className="card shadow-sm rounded-card">
                <div className="card-body">
                  <h4 className="card-title mb-4">Map Settings</h4>
                  {loading ? (
                    <div className="text-center">
                      <div className="spinner-border" role="status">
                        <span className="visually-hidden"><CircularProgress /></span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="row">
                        <div style={{ width: "100%" }}>
                        <Alert severity="info"
                        className="mb-4"
                        style={{ width: "100%" }}>
                          <AlertTitle style={{ fontSize: "1.1rem",}}>Info</AlertTitle>
                          <strong>How to set up your Google Map Keys:</strong>
                          <p>   You need to provide your <b>Google Maps API Key</b>.</p>
                          <ol style={{ marginTop: -10 }}>
                            <li>
                             
                              <span style={{ fontSize: "0.95em" }}>
                                To get your API key:
                                  <ul style={{ marginLeft: 5, listStyle: "none" }}>
                                  <li>&#8226; Go to <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer">Google Cloud Console</a>.</li>
                                  <li>&#8226; Create a new project or select an existing one.</li>
                                  <li>&#8226; Enable the Google Maps API for your project.</li>
                                  <li>&#8226; Go to "Credentials" and click "Create Credentials" &rarr; "API key".</li>
                                  <li>&#8226; Restrict your API key to prevent unauthorized use.</li>
                                  <li>&#8226; After creation, you will see your <b>API Key</b>.</li>
                                </ul>
                              </span>
                            </li>
                            <li>
                              Click <b>Update Settings</b> to apply your changes.
                            </li>
                          </ol>
                        </Alert>
                        </div>
                      
                        <div className="col-xl-12 mb-3">
                            <TextField
                            variant="outlined"
                            label="Google Map Key"
                            required
                             type={googleMapKey ? "text" : "password"}
                              name="GoogleMapKey"
                              value={formData.GoogleMapKey}
                              onChange={handleInputChange}
                              size="small"
                              fullWidth
                              error={!!errors.GoogleMapKey}
                              helperText={errors.GoogleMapKey}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton
                                      onClick={() => setGoogleMapKey(!googleMapKey)}
                                      edge="end"
                                    >
                                      {googleMapKey ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </div>
                        </div>
                     
                    
                      <div className="mt-3 d-flex justify-content-end">
                        <button className="btn btn-primary btn-sm" onClick={handleSubmit} disabled={loading}>
                          {loading ? "Updating..." : "Update Settings"}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default GoogleSetting;
