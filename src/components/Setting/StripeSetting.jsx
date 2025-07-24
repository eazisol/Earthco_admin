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
  const [loading, setLoading] = useState(false);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const getSettings = async () => {
    setLoading(true);
    const user=JSON.parse(localStorage.getItem('user'));
    try {
      const response = await getEmailSetting(user?.Data?.TenantId);
      setSettingData(response);
      setFormData({
        StripeProductionClientId: response?.StripeProductionClientId || "",
        StripeProductionSecretId: response?.StripeProductionSecretId || "",
        StripeSandboxClientId: response?.StripeSandboxClientId || "",
        StripeSandboxSecretId: response?.StripeSandboxSecretId || "",
        StripeMode: response?.StripeMode || 1
      });
    } catch (error) {
      console.error("Error fetching settings:", error);
      // toast.error("Failed to fetch settings");
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
    const formDataToSend = new FormData();
    formDataToSend.append('Files', null);
    
    const settingDataToSend = {
      ...settingData,
      StripeProductionClientId: formData.StripeProductionClientId,
      StripeProductionSecretId: formData.StripeProductionSecretId,
      StripeSandboxClientId: formData.StripeSandboxClientId,
      StripeSandboxSecretId: formData.StripeSandboxSecretId,
      StripeMode: formData.StripeMode
    };

    if (!formData.StripeProductionClientId || !formData.StripeProductionSecretId || !formData.StripeSandboxClientId || !formData.StripeSandboxSecretId) {
      toast.error("Please fill in all required fields");
      return;
    }

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
            <div className="col-xl-12">
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
                      <label className="form-label">Production Client ID<span className="text-danger">*</span></label>
                      <TextField
                        name="StripeProductionClientId"
                        value={formData.StripeProductionClientId}
                        onChange={handleInputChange}
                        size="small"
                        fullWidth
                      />
                    </div>

                    <div className="col-xl-6 mb-3">
                      <label className="form-label">Production Secret ID<span className="text-danger">*</span></label>
                      <TextField
                        name="StripeProductionSecretId"
                        value={formData.StripeProductionSecretId}
                        onChange={handleInputChange}
                        size="small"
                        fullWidth
                      />
                    </div>

                    <div className="col-xl-6 mb-3">
                      <label className="form-label">Sandbox Client ID<span className="text-danger">*</span></label>
                      <TextField
                        name="StripeSandboxClientId"
                        value={formData.StripeSandboxClientId}
                        onChange={handleInputChange}
                        size="small"
                        fullWidth
                      />
                    </div>

                    <div className="col-xl-6 mb-3">
                      <label className="form-label">Sandbox Secret ID<span className="text-danger">*</span></label>
                      <TextField
                        name="StripeSandboxSecretId"
                        value={formData.StripeSandboxSecretId}
                        onChange={handleInputChange}
                        size="small"
                        fullWidth
                      />
                    </div>

                    <div className="col-xl-6 mb-3">
                      <label className="form-label">Mode</label>
                      <Select
                        name="StripeMode"
                        value={formData.StripeMode}
                        onChange={handleInputChange}
                        size="small"
                        fullWidth
                      >
                        <MenuItem value={1}>Production</MenuItem>
                        <MenuItem value={2}>Sandbox</MenuItem>
                      </Select>
                    </div>
                  </div>

                  <div className="mt-3">
                    <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
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