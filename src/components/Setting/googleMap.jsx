import DashboardLayout from "../DashboardLayout/DashboardLayout";
import { CircularProgress, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { addEmailSetting, getEmailSetting } from "../../APIS/settings";

export const GoogleSetting = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    GoogelClientId: "",
    GoogleClientSecret: "",
    SettingId: 0
  });
console.log(formData,'formData');
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
      setFormData(response);
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
      
      SettingId: formData?.SettingId || 0  ,
      Email: formData?.Email||null,
      EmailPassword  : formData?.EmailPassword||null,
      EmailPort:  formData?.EmailPort||null,
      EmailSSL : formData?.EmailSSL||null,
      EmailHost  :  formData?.EmailHost||null,
      EmailClientId: formData?.EmailClientId||null,
      EmailClientSecret :  formData?.EmailClientSecret||null,
      EmailMode :  formData?.EmailMode||null ,
      QBProductionClientId : formData?.QBProductionClientId||null,
      QBProductionClientSecret: formData?.QBProductionClientSecret||null,
      QBSandBoxClientId  :   formData?.QBSandBoxClientId||null,
      QBSandBoxClientSecret:  formData?.QBSandBoxClientSecret||null,
      QBMode : formData?.QBMode||null,
      GoogelClientId: formData?.GoogelClientId||null,
      GoogleClientSecret: formData?.GoogleClientSecret||null,
      PrimeryColor  :  formData?.PrimeryColor||null,
      SecondaryColor  :  formData?.SecondaryColor||null,
      StripeProductionClientId : formData?.StripeProductionClientId||null,
      StripeProductionSecretId : formData?.StripeProductionSecretId||null,
      StripeSandboxClientId: formData?.StripeSandboxClientId||null,
      StripeSandboxSecretId: formData?.StripeSandboxSecretId||null,
      StripeMode  :formData?.StripeMode||null,
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
              <a href="javascript:void(0)">
                Google Settings
              </a>
            </li>
          </ol>
        </div>
        <div className="container-fluid">
          <div className="row table-space">
            <div className="col-xl-12">
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title mb-4">Google Settings</h4>
                  {loading ? <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden"><CircularProgress /></span>
            </div>
           </div> 
           :  <>
                  <div className="row">
                    <div className="col-xl-6 mb-3">
                      <label className="form-label">Google Client ID<span className="text-danger">*</span></label>
                      <TextField
                        name="GoogelClientId"
                        value={formData.GoogelClientId}
                        onChange={handleInputChange}
                        size="small"
                        fullWidth
                      />
                    </div>
                    <div className="col-xl-6 mb-3">
                      <label className="form-label">Google Client Secret<span className="text-danger">*</span></label>
                      <TextField
                        name="GoogleClientSecret"
                        value={formData.GoogleClientSecret}
                        onChange={handleInputChange}
                        size="small"
                        fullWidth
                      />
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

export default GoogleSetting;
