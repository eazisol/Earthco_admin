import DashboardLayout from "../DashboardLayout/DashboardLayout";
import { CircularProgress, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import { addEmailSetting, getEmailSetting } from "../../APIS/settings";
import { toast } from "react-toastify";

export const QBookScreen = () => {
  const [settingData, setSettingData] = useState({});
  const [formData, setFormData] = useState({
    QBProductionClientId: "",
    QBProductionClientSecret: "",
    QBSandBoxClientId: "",
    QBSandBoxClientSecret: "",
    QBMode: 1
  });
  console.log("🚀 ~ QBookScreen ~ formData:", formData)
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
    const user = JSON.parse(localStorage.getItem('user'));
    try {
      const response = await getEmailSetting(user?.Data?.TenantId);
      setSettingData(response?.data || {});
      setFormData({
        QBProductionClientId: response?.data?.QBProductionClientId || "",
        QBProductionClientSecret: response?.data?.QBProductionClientSecret || "",
        QBSandBoxClientId: response?.data?.QBSandBoxClientId || "",
        QBSandBoxClientSecret: response?.data?.QBSandBoxClientSecret || "",
        QBMode: response?.data?.QBMode || 1
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

    if (!formData.QBProductionClientId || !formData.QBProductionClientSecret || 
        !formData.QBSandBoxClientId || !formData.QBSandBoxClientSecret) {
      toast.error("Please fill in all required fields");
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
              <a href="javascript:void(0)">QuickBooks Settings</a>
            </li>
          </ol>
        </div>

        <div className="container-fluid">
          <div className="row table-space">
            <div className="col-xl-6">
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title mb-4">QuickBooks Settings</h4>
                  {loading ? (
                    <div className="text-center">
                      <div className="spinner-border" role="status">
                        <span className="visually-hidden"><CircularProgress /></span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="row">
                        <div className="col-xl-6 mb-3">
                          <label className="form-label">Production Client ID<span className="text-danger">*</span></label>
                          <TextField
                            name="QBProductionClientId"
                            value={formData.QBProductionClientId}
                            onChange={handleInputChange}
                            size="small"
                            fullWidth
                          />
                        </div>

                        <div className="col-xl-6 mb-3">
                          <label className="form-label">Production Client Secret<span className="text-danger">*</span></label>
                          <TextField
                            name="QBProductionClientSecret"
                            value={formData.QBProductionClientSecret}
                            onChange={handleInputChange}
                            size="small"
                            fullWidth
                          />
                        </div>

                        <div className="col-xl-6 mb-3">
                          <label className="form-label">Sandbox Client ID<span className="text-danger">*</span></label>
                          <TextField
                            name="QBSandBoxClientId"
                            value={formData.QBSandBoxClientId}
                            onChange={handleInputChange}
                            size="small"
                            fullWidth
                          />
                        </div>

                        <div className="col-xl-6 mb-3">
                          <label className="form-label">Sandbox Client Secret<span className="text-danger">*</span></label>
                          <TextField
                            name="QBSandBoxClientSecret"
                            value={formData.QBSandBoxClientSecret}
                            onChange={handleInputChange}
                            size="small"
                            fullWidth
                          />
                        </div>

                        <div className="col-xl-6 mb-3">
                          <label className="form-label">Mode</label>
                          <div className="form-check form-switch">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="QBMode"
                              checked={parseInt(formData.QBMode) === 0}
                              onChange={(e) => {
                                handleInputChange({
                                  target: {
                                    name: "QBMode",
                                    value: e.target.checked ? 0 : 1
                                  }
                                });
                              }}
                            />
                            <label className="form-check-label">
                              {parseInt(formData.QBMode) === 0 ? "Test" : "Live"}
                            </label>
                          </div>
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
