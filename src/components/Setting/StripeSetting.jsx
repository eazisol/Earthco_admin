import DashboardLayout from "../DashboardLayout/DashboardLayout";
import { CircularProgress, TextField, Alert, AlertTitle, IconButton, InputAdornment } from "@mui/material";
import { useState, useEffect } from "react";
import { getEmailSetting, addEmailSetting } from "../../APIS/settings";
import { toast } from "react-toastify";
import TitleBar from "../TitleBar";
import { Visibility, VisibilityOff } from '@mui/icons-material';
export const StripeSetting = () => {
  const [settingData, setSettingData] = useState({});
  const [formData, setFormData] = useState({
    StripeProductionClientId: "",
    StripeProductionSecretId: "",
    StripeSandboxClientId: "",
    StripeSandboxSecretId: "",
    StripeMode: 2 // 2= Production, 1= Sandbox
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showProductionSecret, setShowProductionSecret] = useState(false);
  const [showSandboxSecret, setShowSandboxSecret] = useState(false);
  // Helper to determine if current mode is production
  const isProduction = parseInt(formData.StripeMode) === 2;

  // Validation function, now mode-aware
  const validateField = (name, value) => {
    // Only validate fields relevant to the current mode
    if (isProduction) {
      if (
        name === "StripeProductionClientId" ||
        name === "StripeProductionSecretId"
      ) {
        if (!value || value.trim() === "") {
          return "This field is required in Production mode";
        }
      }
    } else {
      if (
        name === "StripeSandboxClientId" ||
        name === "StripeSandboxSecretId"
      ) {
        if (!value || value.trim() === "") {
          return "This field is required in Sandbox mode";
        }
      }
    }

    // General validation for all keys
    if (
      [
        "StripeProductionClientId",
        "StripeProductionSecretId",
        "StripeSandboxClientId",
        "StripeSandboxSecretId"
      ].includes(name)
    ) {
      
    }

    // Uncomment for stricter key format validation
    // if (name === "StripeProductionClientId" && value && !value.startsWith("pk_live_")) {
    //   return "Live publishable key must start with 'pk_live_'";
    // }
    // if (name === "StripeProductionSecretId" && value && !value.startsWith("sk_live_")) {
    //   return "Live secret key must start with 'sk_live_'";
    // }
    // if (name === "StripeSandboxClientId" && value && !value.startsWith("pk_test_")) {
    //   return "Test publishable key must start with 'pk_test_'";
    // }
    // if (name === "StripeSandboxSecretId" && value && !value.startsWith("sk_test_")) {
    //   return "Test secret key must start with 'sk_test_'";
    // }

    return "";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value)
    }));
  };

  const getSettings = async () => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem('user'));
    try {
      const response = await getEmailSetting(user?.Data?.TenantId);
      setSettingData(response?.data || {});
      setFormData({
        StripeProductionClientId: response?.data?.StripeProductionClientId || "",
        StripeProductionSecretId: response?.data?.StripeProductionSecretId || "",
        StripeSandboxClientId: response?.data?.StripeSandboxClientId || "",
        StripeSandboxSecretId: response?.data?.StripeSandboxSecretId || "",
        StripeMode: response?.data?.StripeMode !== undefined ? response?.data?.StripeMode : 2
      });
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate only relevant fields based on mode
    let newErrors = {};
    if (isProduction) {
      newErrors = {
        StripeProductionClientId: validateField("StripeProductionClientId", formData.StripeProductionClientId),
        StripeProductionSecretId: validateField("StripeProductionSecretId", formData.StripeProductionSecretId)
      };
    } else {
      newErrors = {
        StripeSandboxClientId: validateField("StripeSandboxClientId", formData.StripeSandboxClientId),
        StripeSandboxSecretId: validateField("StripeSandboxSecretId", formData.StripeSandboxSecretId)
      };
    }

    setErrors(newErrors);

    if (Object.values(newErrors).some(error => error !== "")) {
      setLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('Files', null);

    const settingDataToSend = {
      ...settingData,
      Email: settingData?.Email || null,
      EmailPassword: settingData?.EmailPassword || null,
      EmailPort: settingData?.EmailPort || null,
      EmailSSL: settingData?.EmailSSL || null,
      EmailHost: settingData?.EmailHost || null,
      EmailClientId: settingData?.EmailClientId || null,
      EmailClientSecret: settingData?.EmailClientSecret || null,
      EmailMode: settingData?.EmailMode || null,
      QBProductionClientId: settingData?.QBProductionClientId || null,
      QBProductionClientSecret: settingData?.QBProductionClientSecret || null,
      QBSandBoxClientId: settingData?.QBSandBoxClientId || null,
      QBSandBoxClientSecret: settingData?.QBSandBoxClientSecret || null,
      QBMode: settingData?.QBMode || null,
      GoogelClientId: settingData?.GoogelClientId || null,
      GoogleClientSecret: settingData?.GoogleClientSecret || null,
      StripeProductionClientId: formData.StripeProductionClientId,
      StripeProductionSecretId: formData.StripeProductionSecretId,
      StripeSandboxClientId: formData.StripeSandboxClientId,
      StripeSandboxSecretId: formData.StripeSandboxSecretId,
      StripeMode: formData.StripeMode,
      PrimeryColor: settingData?.PrimeryColor || null,
      SecondaryColor: settingData?.SecondaryColor || null
    };

    try {
      formDataToSend.append('SettingData', JSON.stringify(settingDataToSend));
      const response = await addEmailSetting(formDataToSend);

      if (response) {
        toast.success(response?.Message);
        getSettings();
      }
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="content-body">
      <TitleBar  title="Stripe Settings" />

        <div className="container-fluid">
          <div className="row table-space">
            <div className="col-xl-6">
              <div className="card shadow-sm rounded-card">
                <div className="card-body">
                  <div className="row">
                    <h4 className="card-title mb-4 col-xl-9">Stripe Settings</h4>
                    <div className="col-xl-3 mb-3 d-flex justify-content-end align-items-center" style={{ position: "relative" }}>
                    <div className="form-check form-switch d-flex align-items-center" style={{ width: "fit-content", cursor: "pointer" }} onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          StripeMode: formData.StripeMode == 2 ? 1 : 2
                        }))
                      }}>
                          <label className="form-check-label mb-0 me-2" style={{ whiteSpace: "nowrap" }}>
                                  {formData.StripeMode == 2 ? "Production" : "Sandbox"}
                              </label>
                              <input
                                className="form-check-input"
                                type="checkbox"
                                name="StripeMode" 
                                  checked={formData.StripeMode == 2}  
                                readOnly
                                 
                                style={{ marginLeft: "12px" }}
                              />
                          
                            </div>
                    </div>
                  </div>
                 
                 
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
                          <strong>How to set up your Stripe settings:</strong>
                          <p>   If you are using <b>Production</b> mode, you need to provide <b>Live Publishable Key</b> and <b>Live Secret Key</b>.</p>
                          <ol style={{ marginTop: -10 }}>
                            <li>
                     
                              <span style={{ fontSize: "0.95em" }}>
                                To get your Production credentials:
                                <ol style={{ marginLeft: 5 }}>
                                  <li>&#8226; Go to <a href="https://dashboard.stripe.com/apikeys" target="_blank" rel="noopener noreferrer">Stripe Dashboard</a>.</li>
                                  <li>&#8226; Sign in and navigate to "Developers" &gt; "API keys".</li>
                                  <li>&#8226; Use the "Standard keys" section to view your <b>Live Publishable Key</b> and <b>Live Secret Key</b>.</li>
                                </ol>
                              </span>
                            </li>
                            </ol> 
                            <p>   If you are using <b>Sandbox</b> mode, you need to provide <b>Test Publishable Key</b> and <b>Test Secret Key</b>.</p>
                            <ol style={{ marginTop: -10 }}>
                            <li>
                             
                              <span style={{ fontSize: "0.95em" }}>
                                To get your Sandbox credentials:
                                  <ol style={{ marginLeft: 5 }}>
                                  <li>&#8226; Go to <a href="https://dashboard.stripe.com/test/apikeys" target="_blank" rel="noopener noreferrer">Stripe Dashboard (Test Mode)</a>.</li>
                                  <li>&#8226; Sign in and navigate to "Developers" &gt; "API keys".</li>
                                  <li>&#8226; Use the "Standard keys" section to view your <b>Test Publishable Key</b> and <b>Test Secret Key</b>.</li>
                                </ol>
                              </span>
                            </li>
                            <li>
                              Click <b>Update Settings</b> to apply your settings.
                            </li>
                          </ol>
                        </Alert>
                        </div>
                        {/* Mode Switch */}
                      

                        {/* Production Fields */}
                        {isProduction && (
                          <>
                            <div className="col-xl-12 mb-3">
                             
                              <TextField 
                              label="Publishable Key"
                              required
                              variant="outlined"
                                name="StripeProductionClientId"
                                value={formData.StripeProductionClientId}
                                onChange={handleInputChange}
                                size="small"
                                fullWidth
                                placeholder="pk_live_..."
                                error={!!errors.StripeProductionClientId}
                                helperText={errors.StripeProductionClientId}
                              />
                            </div>
                            <div className="col-xl-12 mb-3 mt-3">
                             
                              <TextField
                              label="Secret Key"
                              required
                              variant="outlined"
                                type={showProductionSecret ? "text" : "password"}
                                name="StripeProductionSecretId"
                                value={formData.StripeProductionSecretId}
                                onChange={handleInputChange}
                                size="small"
                                fullWidth
                                placeholder="sk_live_..."
                                error={!!errors.StripeProductionSecretId}
                                helperText={errors.StripeProductionSecretId}
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <IconButton
                                        onClick={() => setShowProductionSecret(!showProductionSecret)}
                                        edge="end"
                                      >
                                        {showProductionSecret ? <VisibilityOff /> : <Visibility />}
                                      </IconButton>
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            </div>
                          </>
                        )}

                        {/* Sandbox Fields */}
                        {!isProduction && (
                          <>
                            <div className="col-xl-12 mb-3 ">
                            
                              <TextField
                              label="Publishable Key"
                              required
                              variant="outlined"
                                name="StripeSandboxClientId"
                                value={formData.StripeSandboxClientId}
                                onChange={handleInputChange}
                                size="small"
                                fullWidth
                                placeholder="pk_test_..."
                                error={!!errors.StripeSandboxClientId}
                                helperText={errors.StripeSandboxClientId}
                              />
                            </div>
                            <div className="col-xl-12 mb-3 mt-3">
                             
                              <TextField
                              label="Secret Key"
                              required
                              variant="outlined"
                                type={showSandboxSecret ? "text" : "password"}
                                  name="StripeSandboxSecretId"
                                value={formData.StripeSandboxSecretId}
                                onChange={handleInputChange}
                                size="small"
                                fullWidth
                                placeholder="sk_test_..."
                                error={!!errors.StripeSandboxSecretId}
                                helperText={errors.StripeSandboxSecretId}
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <IconButton
                                        onClick={() => setShowSandboxSecret(!showSandboxSecret)}
                                        edge="end"
                                      >
                                        {showSandboxSecret ? <VisibilityOff /> : <Visibility />}
                                      </IconButton>
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            </div>
                          </>
                        )}
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

export default StripeSetting;