import DashboardLayout from "../DashboardLayout/DashboardLayout";
import { CircularProgress,  FormControl, MenuItem, Select, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import { Offcanvas } from "bootstrap";
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
        QBProductionClientId: response?.QBProductionClientId || "",
        QBProductionClientSecret: response?.QBProductionClientSecret || "",
        QBSandBoxClientId: response?.QBSandBoxClientId || "",
        QBSandBoxClientSecret: response?.QBSandBoxClientSecret || "",
        QBMode: response?.QBMode || 1
      });
      setLoading(false);
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
      QBProductionClientId: formData.QBProductionClientId,
      QBProductionClientSecret: formData.QBProductionClientSecret,
      QBSandBoxClientId: formData.QBSandBoxClientId,
      QBSandBoxClientSecret: formData.QBSandBoxClientSecret,
      QBMode: formData.QBMode
    };

    if (!formData.QBProductionClientId || !formData.QBProductionClientSecret || !formData.QBSandBoxClientId || !formData.QBSandBoxClientSecret) {
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
              <a href="javascript:void(0)">QuickBooks Settings</a>
            </li>
          </ol>
        </div>

        <div className="container-fluid">
          <div className="row table-space">
            <div className="col-xl-12">
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title mb-4">QuickBooks Settings</h4>
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
