import DashboardLayout from "../DashboardLayout/DashboardLayout";
import { CircularProgress,  FormControl, MenuItem, Select, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import { getEmailSetting, addEmailSetting } from "../../APIS/settings";
import { toast } from "react-toastify";

export const StripeSetting = () => {
  const [settingData, setSettingData] = useState({});
  const [formData, setFormData] = useState({
    StripeProductionClientId: "",
    StripeProductionSecretId: "", 
    StripeSandboxClientId: "",
    StripeSandboxSecretId: "",
    StripeMode: 1
  });

  const [errors, setErrors] = useState({
    StripeProductionClientId: "",
    StripeProductionSecretId: "",
    StripeSandboxClientId: "",
    StripeSandboxSecretId: ""
  });

  const [loading, setLoading] = useState(false);
  
  const validateInput = (name, value) => {
    if (!value) {
      return "This field is required";
    }
    if (value.length < 32) {
      return "Key must be at least 32 characters";
    }
    if (value.length > 50) {
      return "Key cannot exceed 50 characters";
    }
    
    // const keyPattern = /^[a-zA-Z0-9_]+$/;
    // if (!keyPattern.test(value)) {
    //   return "Only alphanumeric characters and underscores allowed";
    // }

    // if (name === "StripeProductionClientId" && !value.startsWith("pk_live_")) {
    //   return "Live publishable key must start with 'pk_live_'";
    // }
    // if (name === "StripeProductionSecretId" && !value.startsWith("sk_live_")) {
    //   return "Live secret key must start with 'sk_live_'";
    // }
    // if (name === "StripeSandboxClientId" && !value.startsWith("pk_test_")) {
    //   return "Test publishable key must start with 'pk_test_'";
    // }
    // if (name === "StripeSandboxSecretId" && !value.startsWith("sk_test_")) {
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

    setErrors(prev => ({
      ...prev,
      [name]: validateInput(name, value)
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
        StripeMode: response?.data?.StripeMode || 0
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

    // Validate all fields
    const newErrors = {
      StripeProductionClientId: validateInput("StripeProductionClientId", formData.StripeProductionClientId),
      StripeProductionSecretId: validateInput("StripeProductionSecretId", formData.StripeProductionSecretId),
      StripeSandboxClientId: validateInput("StripeSandboxClientId", formData.StripeSandboxClientId),
      StripeSandboxSecretId: validateInput("StripeSandboxSecretId", formData.StripeSandboxSecretId)
    };

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
      
      if(response) {
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
        <div className="page-titles">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="javascript:void(0)">Stripe Settings</a>
            </li>
          </ol>
        </div>

        <div className="container-fluid">
          <div className="row table-space">
            <div className="col-xl-6">
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title mb-4">Stripe Settings</h4>
                  {loading ? <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden"><CircularProgress /></span>
            </div>
           </div> 
           :  <>
                  <div className="row">
                    <div className="col-xl-6 mb-3">
                      <label className="form-label">Publishable Key (Live)<span className="text-danger">*</span></label>
                      <TextField
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

                    <div className="col-xl-6 mb-3">
                      <label className="form-label">Secret Key (Live)<span className="text-danger">*</span></label>
                      <TextField
                        name="StripeProductionSecretId"
                        value={formData.StripeProductionSecretId}
                        onChange={handleInputChange}
                        size="small"
                        fullWidth
                        placeholder="sk_live_..."
                        error={!!errors.StripeProductionSecretId}
                        helperText={errors.StripeProductionSecretId}
                      />
                    </div>

                    <div className="col-xl-6 mb-3">
                      <label className="form-label">Publishable Key (Test)<span className="text-danger">*</span></label>
                      <TextField
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

                    <div className="col-xl-6 mb-3">
                      <label className="form-label">Secret Key (Test)<span className="text-danger">*</span></label>
                      <TextField
                        name="StripeSandboxSecretId"
                        value={formData.StripeSandboxSecretId}
                        onChange={handleInputChange}
                        size="small"
                        fullWidth
                        placeholder="sk_test_..."
                        error={!!errors.StripeSandboxSecretId}
                        helperText={errors.StripeSandboxSecretId}
                      />
                    </div>

                    <div className="col-xl-6 mb-3">
                      <label className="form-label">Mode</label>
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="StripeMode"
                          checked={formData.StripeMode == 1}
                          onChange={(e) => {
                            handleInputChange({
                              target: {
                                name: "StripeMode",
                                value: e.target.checked ? 1 : 0
                              }
                            });
                          }}
                        />
                        <label className="form-check-label">
                          {formData.StripeMode == 1 ? "Sandbox " : "Production"}
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 d-flex justify-content-end">
                    <button className="btn btn-primary btn-sm" onClick={handleSubmit} disabled={loading}>
                      {loading ? "Updating..." : "Update Settings"}
                    </button>
                  </div></>
                  }
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