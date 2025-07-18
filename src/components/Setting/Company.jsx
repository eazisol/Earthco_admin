import DashboardLayout from "../DashboardLayout/DashboardLayout";
import image from "../../assets/img/team/team-1.jpg";
import { CircularProgress,  TextField } from "@mui/material";
import { useState, useEffect } from "react";
import { Offcanvas } from "bootstrap";
import { getEmailSetting, addEmailSetting } from "../../APIS/settings";
import { toast } from "react-toastify";
import imagePathCorrector from "../Reuseable/imagePathCorrector";

export const CompanyScreen = () => {
  const [settingData, setSettingData] = useState({});
  const [formData, setFormData] = useState({
    PrimeryColor: "",
    SecondaryColor: "",
    File: null
  });
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      const file = files[0];
      setFormData((prevData) => ({
        ...prevData,
        [name]: file,
      }));
      // Create preview URL for selected image
      if(file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result);
        };
        reader.readAsDataURL(file);
      }
      return;
    }
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
        PrimeryColor: response?.PrimeryColor || "",
        SecondaryColor: response?.SecondaryColor || "",
        File: response?.File || null
      });
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to fetch settings");
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
    formDataToSend.append('Files', formData.File);
    
    const settingDataToSend = {
      ...settingData,
      PrimeryColor: formData.PrimeryColor,
      SecondaryColor: formData.SecondaryColor
    };

    if (!formData.PrimeryColor || !formData.SecondaryColor) {
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
              <a href="javascript:void(0)">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M13.5096 2.53165H7.41104C5.50437 2.52432 3.94146 4.04415 3.89654 5.9499V15.7701C3.85437 17.7071 5.38979 19.3121 7.32671 19.3552C7.35512 19.3552 7.38262 19.3561 7.41104 19.3552H14.7343C16.6538 19.2773 18.1663 17.6915 18.1525 15.7701V7.36798L13.5096 2.53165Z"
                    stroke="#888888"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M13.2688 2.52084V5.18742C13.2688 6.48909 14.3211 7.54417 15.6228 7.54784H18.1482"
                    stroke="#888888"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M13.0974 14.0786H8.1474"
                    stroke="#888888"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M11.2229 10.6388H8.14655"
                    stroke="#888888"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Company Settings
              </a>
            </li>
          </ol>
        </div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-xl-12">
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title mb-4">Company Settings</h4>
                  {loading ? <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden"><CircularProgress /></span>
            </div>
           </div> 
           :  <>
                  <div className="row">
                    <div className="col-xl-2 mb-3">
                      <label className="form-label">Primary Color<span className="text-danger">*</span></label>
                      <input
                        type="color"
                        className="form-control form-control-sm"
                        name="PrimeryColor"
                        value={formData.PrimeryColor}
                        onChange={handleInputChange}
                        style={{ height: "40px", width: "100%" }}
                      />
                    </div>
                    <div className="col-xl-2 mb-3">
                      <label className="form-label">Secondary Color<span className="text-danger">*</span></label>
                      <input
                        type="color"
                        className="form-control form-control-sm"
                        name="SecondaryColor"
                        value={formData.SecondaryColor}
                        onChange={handleInputChange}
                        style={{ height: "40px", width: "100%" }}
                      />
                    </div>
                    <div className="col-xl-6 mb-3">
                      <label className="form-label">Logo</label>
                      <input
                        type="file"
                        className="form-control form-control-sm"
                        name="File"
                        onChange={handleInputChange}
                        accept="image/*"
                      />
                      {/* Show preview of selected image */}
                      {previewImage && (
                        <img 
                          src={previewImage} 
                          alt="Selected logo preview" 
                          style={{width: '100px', height: '100px', objectFit: 'contain', marginTop: '10px'}}
                        />
                      )}
                      {/* Show existing logo if no new image selected */}
                      {!previewImage && settingData?.CompanyLogoPath && (
                        <img 
                          src={imagePathCorrector(settingData?.CompanyLogoPath)} 
                          alt="Current logo" 
                          style={{width: '100px', height: '100px', objectFit: 'contain', marginTop: '10px'}}
                        />
                      )}
                    </div>
                  </div></>
                  }

                  <div className="mt-3">
                    <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
                      {loading ? "Updating..." : "Update Settings"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
