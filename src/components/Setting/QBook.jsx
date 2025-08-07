import DashboardLayout from "../DashboardLayout/DashboardLayout";
import { CircularProgress, TextField, Alert, AlertTitle, IconButton, InputAdornment } from "@mui/material";
import { useState, useEffect } from "react";
import { addEmailSetting, getEmailSetting } from "../../APIS/settings";
import { toast } from "react-toastify";
import TitleBar from "../TitleBar";
import { Visibility, VisibilityOff } from '@mui/icons-material';
export const QBookScreen = () => {
  const [settingData, setSettingData] = useState({});
  const [formData, setFormData] = useState({
    QBProductionClientId: "",
    QBProductionClientSecret: "",
    QBSandBoxClientId: "",
    QBSandBoxClientSecret: "",
    QBMode: 1 // 1 = Production, 0 = Sandbox
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showSandboxSecret, setShowSandboxSecret] = useState(false);
  const [showProductionSecret, setShowProductionSecret] = useState(false);
  // Helper to determine if current mode is production
  const isProduction = parseInt(formData.QBMode) === 1;

  // Validation function, now mode-aware
  const validateField = (name, value) => {
    // Only validate fields relevant to the current mode
    if (isProduction) {
      if (
        name === "QBProductionClientId" ||
        name === "QBProductionClientSecret"
      ) {
        if (!value || value.trim() === "") {
          return "This field is required in Production mode";
        }
      }
    } else {
      if (
        name === "QBSandBoxClientId" ||
        name === "QBSandBoxClientSecret"
      ) {
        if (!value || value.trim() === "") {
          return "This field is required in Sandbox mode";
        }
      }
    }

    switch (name) {
      case "QBProductionClientId":
      case "QBSandBoxClientId":
      
        if (value && !/^[a-zA-Z0-9-]+$/.test(value)) {
          return "Only alphanumeric characters and dashes allowed";
        }
        break;
      case "QBProductionClientSecret":
      case "QBSandBoxClientSecret":
      
        break;
      default:
        return "";
    }
    return "";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Validate only the changed field
    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const getSettings = async () => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("user"));
    try {
      const response = await getEmailSetting(user?.Data?.TenantId);
      setSettingData(response?.data || {});
      setFormData({
        QBProductionClientId: response?.data?.QBProductionClientId || "",
        QBProductionClientSecret: response?.data?.QBProductionClientSecret || "",
        QBSandBoxClientId: response?.data?.QBSandBoxClientId || "",
        QBSandBoxClientSecret: response?.data?.QBSandBoxClientSecret || "",
        QBMode: response?.data?.QBMode ?? 1,
        TermsAndCondition: undefined,
        PrivacyPolicy: undefined
      });
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSettings();
    // eslint-disable-next-line
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Mode-aware validation
    const newErrors = {};
    if (isProduction) {
      // Production fields required
      ["QBProductionClientId", "QBProductionClientSecret"].forEach((key) => {
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
      });
    } else {
      // Sandbox fields required
      ["QBSandBoxClientId", "QBSandBoxClientSecret"].forEach((key) => {
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
      });
    }

    // Validate all fields for format, but only require relevant ones
    Object.keys(formData).forEach((key) => {
      if (key !== "QBMode") {
        const error = validateField(key, formData[key]);
        if (error && !newErrors[key]) newErrors[key] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      toast.error("Please fix the validation errors");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("Files", null);

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
      QBProductionClientId: formData.QBProductionClientId,
      QBProductionClientSecret: formData.QBProductionClientSecret,
      QBSandBoxClientId: formData.QBSandBoxClientId,
      QBSandBoxClientSecret: formData.QBSandBoxClientSecret,
      QBMode: parseInt(formData.QBMode),
      GoogelClientId: settingData?.GoogelClientId || null,
      GoogleClientSecret: settingData?.GoogleClientSecret || null,
      StripeProductionClientId: settingData?.StripeProductionClientId || null,
      StripeProductionSecretId: settingData?.StripeProductionSecretId || null,
      StripeSandboxClientId: settingData?.StripeSandboxClientId || null,
      StripeSandboxSecretId: settingData?.StripeSandboxSecretId || null,
      StripeMode: settingData?.StripeMode || null,
      PrimeryColor: settingData?.PrimeryColor || null,
      SecondaryColor: settingData?.SecondaryColor || null,
      TermsAndCondition: undefined,
      PrivacyPolicy: undefined
    };

    try {
      formDataToSend.append("SettingData", JSON.stringify(settingDataToSend));
      const response = await addEmailSetting(formDataToSend);
      
      if(response) {
        toast.success(response?.Message|| "Settings updated successfully");
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
       <TitleBar title="QuickBooks Settings" />

        <div className="container-fluid">
          <div className="row table-space">
            <div className="col-xl-6">
              <div className="card">
                <div className="card-body">
                  <div className="row">
                    <h4 className="card-title mb-4 col-xl-9">
                      QuickBooks Settings
                    </h4>
                    <div className="col-xl-3 mb-3 ml-2 d-flex justify-content-end align-items-center" style={{ position: "relative" }}>
                      <div className="form-check form-switch d-flex align-items-center" style={{ width: "fit-content" }}>
                        <label className="form-check-label mb-0 me-2" style={{ whiteSpace: "nowrap" }}>
                          {formData.QBMode == 1 ? "Production" : "Sandbox"}
                        </label>
                       
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="QBMode"
                          checked={formData.QBMode == 1}
                          onChange={(e) => {
                            setFormData((prev) => ({
                              ...prev,
                              QBMode: e.target.checked ? 1 : 2
                            }))
                          }}
                          style={{ marginLeft: "12px" }}
                        />
                      </div>
                    </div>
                  </div>

                  {loading ? (
                    <div className="text-center">
                      <div className="spinner-border" role="status">
                        <span className="visually-hidden">
                          <CircularProgress />
                        </span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="row">
                        <div style={{ width: "100%" }}>
                          
                      
                        <Alert   severity="info"
                        className="mb-4"
                        style={{ width: "100%" }}>
                          <AlertTitle>Info</AlertTitle>
                          <strong>How to set up your QuickBooks settings:</strong>
                          <ol style={{ marginLeft: 16 }}>
                            <li>
                              If you are using <b>Production</b> mode, you need to provide <b>Production Client ID</b> and <b>Production Client Secret</b>.<br />
                              <span style={{ fontSize: "0.95em" }}>
                                To get your Production credentials:
                                <ol style={{ marginLeft: 16 }}>
                                  <li>Go to <a href="https://developer.intuit.com/app/developer/homepage" target="_blank" rel="noopener noreferrer">Intuit Developer Portal</a>.</li>
                                  <li>Sign in and create a new app or select an existing one.</li>
                                  <li>Navigate to "Keys & OAuth".</li>
                                  <li>Switch to "Production" tab to view your <b>Client ID</b> and <b>Client Secret</b>.</li>
                                </ol>
                              </span>
                            </li>
                            <li>
                              If you are using <b>Sandbox</b> mode, you need to provide <b>Sandbox Client ID</b> and <b>Sandbox Client Secret</b>.<br />
                              <span style={{ fontSize: "0.95em" }}>
                                To get your Sandbox credentials:
                                <ol style={{ marginLeft: 16 }}>
                                  <li>Go to <a href="https://developer.intuit.com/app/developer/homepage" target="_blank" rel="noopener noreferrer">Intuit Developer Portal</a>.</li>
                                  <li>Sign in and create a new app or select an existing one.</li>
                                  <li>Navigate to "Keys & OAuth".</li>
                                  <li>Use the "Development" tab to view your <b>Client ID</b> and <b>Client Secret</b> for Sandbox.</li>
                                </ol>
                              </span>
                            </li>
                            <li>
                              Click <b>Save</b> to apply your settings.
                            </li>
                          </ol>
                        </Alert>
                        </div>
                        {isProduction && (
                          <>
                            <div className="col-xl-12 mb-3">
                              <label className="form-label">
                                Production Client ID
                                <span className="text-danger">*</span>
                              </label>
                              <TextField
                                name="QBProductionClientId"
                                value={formData.QBProductionClientId}
                                onChange={handleInputChange}
                                size="small"
                                fullWidth
                                error={!!errors.QBProductionClientId}
                                helperText={errors.QBProductionClientId}
                              />
                            </div>

                            <div className="col-xl-12 mb-3">
                              <label className="form-label">
                                Production Client Secret
                                <span className="text-danger">*</span>
                              </label>
                              <TextField
                                type={showProductionSecret ? "text" : "password"}
                                name="QBProductionClientSecret"
                                value={formData.QBProductionClientSecret}
                                onChange={handleInputChange}
                                size="small"
                                fullWidth
                                error={!!errors.QBProductionClientSecret}
                                helperText={errors.QBProductionClientSecret}
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
                            <div className="col-xl-12 mb-3">
                              <label className="form-label">
                                Sandbox Client ID
                                <span className="text-danger">*</span>
                              </label>
                              <TextField
                                name="QBSandBoxClientId"
                                value={formData.QBSandBoxClientId}
                                onChange={handleInputChange}
                                size="small"
                                fullWidth
                                error={!!errors.QBSandBoxClientId}
                                helperText={errors.QBSandBoxClientId}
                              />
                            </div>

                            <div className="col-xl-12 mb-3">
                              <label className="form-label">
                                Sandbox Client Secret
                                <span className="text-danger">*</span>
                              </label>
                              <div style={{ position: 'relative' }}>
                                <TextField
                                  type={showSandboxSecret ? "text" : "password"}
                                  name="QBSandBoxClientSecret"
                                  value={formData.QBSandBoxClientSecret}
                                  onChange={handleInputChange}
                                  size="small"
                                  fullWidth
                                  error={!!errors.QBSandBoxClientSecret}
                                  helperText={errors.QBSandBoxClientSecret}
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
