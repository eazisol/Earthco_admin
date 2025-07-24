import DashboardLayout from "../DashboardLayout/DashboardLayout";
import { CircularProgress, FormControl, MenuItem, Select, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { addEmailSetting, getEmailSetting } from "../../APIS/settings";
import { toast } from "react-toastify";

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
const [loading, setLoading] = useState(false);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const getSetting = async () => {
    setLoading(true);
    const user=JSON.parse(localStorage.getItem('user'));
    const response = await getEmailSetting(user?.Data?.TenantId);
    setSettingData(response);
    setFormData({
      Email: response?.Email || "",
      EmailPassword: response?.EmailPassword || "",
      EmailPort: response?.EmailPort || 0,
      EmailSSL: response?.EmailSSL || false,
      EmailHost: response?.EmailHost || "",
      EmailClientId: response?.EmailClientId || "",
      EmailClientSecret: response?.EmailClientSecret || "",
      EmailMode: response?.EmailMode || 1
    });
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
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
            <div className="col-xl-12">
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title mb-4">Email Settings</h4>
              {loading ? <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden"><CircularProgress /></span>
            </div>
           </div> 
           :  <>
                 <div className="row">
                    <div className="col-xl-6 mb-3">
                      <label className="form-label">Email Address<span className="text-danger">*</span></label>
                      <TextField
                        name="Email"
                        value={formData.Email}
                        onChange={handleInputChange}
                        size="small"
                        fullWidth
                      />
                    </div>

                    <div className="col-xl-6 mb-3">
                      <label className="form-label">Email Password<span className="text-danger">*</span></label>
                      <TextField
                        name="EmailPassword"
                        type="password"
                        value={formData.EmailPassword}
                        onChange={handleInputChange}
                        size="small"
                        fullWidth
                      />
                    </div>

                    <div className="col-xl-6 mb-3">
                      <label className="form-label">Email Port<span className="text-danger">*</span></label>
                      <TextField
                        name="EmailPort"
                        value={formData.EmailPort}
                        onChange={handleInputChange}
                        size="small"
                        fullWidth
                        type="number"
                      />
                    </div>

                    <div className="col-xl-6 mb-3">
                      <FormControl fullWidth>
                        <label className="form-label">Use SSL<span className="text-danger">*</span></label>
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
                      <label className="form-label">Email Host<span className="text-danger">*</span></label>
                      <TextField
                        name="EmailHost"
                        value={formData.EmailHost}
                        onChange={handleInputChange}
                        size="small"
                        fullWidth
                      />
                    </div>

                    <div className="col-xl-6 mb-3">
                      <label className="form-label">Email Client ID</label>
                      <TextField
                        name="EmailClientId"
                        value={formData.EmailClientId}
                        onChange={handleInputChange}
                        size="small"
                        fullWidth
                      />
                    </div>

                    <div className="col-xl-6 mb-3">
                      <label className="form-label">Email Client Secret</label>
                      <TextField
                        name="EmailClientSecret"
                        type="password"
                        value={formData.EmailClientSecret}
                        onChange={handleInputChange}
                        size="small"
                        fullWidth
                      />
                    </div>

                    <div className="col-xl-6 mb-3">
                      <label className="form-label">Email Mode</label>
                      <TextField
                        name="EmailMode"
                        value={formData.EmailMode}
                        onChange={handleInputChange}
                        size="small"
                        fullWidth
                        type="number"
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
