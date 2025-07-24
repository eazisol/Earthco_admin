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
      console.log('response company ',response);
      setSettingData(response?.data);
      setFormData({
        PrimeryColor: response?.data?.PrimeryColor || "",
        SecondaryColor: response?.data?.SecondaryColor || "",
        File: response?.File || null
      });
    } catch (error) {
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
      console.log('response company ',response);
      if(response) {
        toast.success(response?.Message);
        getSettings();
      }
    } catch (error) {
      // toast.error("Failed to save settings");
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
          <div className="row table-space">
            <div className="col-xl-4">
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
                    <div className="col-xl-6"><label className="form-label">Primary Color<span className="text-danger">*</span></label>
                    <div >
                      <input
                        type="color"
                        className="form-control form-control-sm"
                        name="PrimeryColor"
                        value={formData.PrimeryColor}
                        onChange={handleInputChange}
                        style={{ height: "40px", width: "100%" }}
                      /></div>
                      
                    </div>
                    <div className="col-xl-6">
                      <label className="form-label">Secondary Color<span className="text-danger">*</span></label>
                    <div >
                      <input
                        type="color"
                        className="form-control form-control-sm"
                        name="SecondaryColor"
                        value={formData.SecondaryColor}
                        onChange={handleInputChange}
                        style={{ height: "40px", width: "100%" }}
                      />
                    </div></div>
            
                  </div>  
                
                    <div className="col-xl-6 mb-3 mt-3">
                      {/* <label className="form-label">Logo</label> */}
                      <div className="d-flex align-items-center">
                        <button 
                          className="btn btn-light btn-sm d-flex align-items-center gap-2"
                          onClick={() => document.querySelector('input[type="file"]').click()}
                          style={{
                            pointerEvents: 'auto',
                            backgroundColor: '#f8f9fa',
                            border: '1px solid #dee2e6',
                            color: '#6c757d',
                            cursor: 'pointer',
                            '&:hover': {
                              backgroundColor: '#f8f9fa',
                              border: '1px solid #dee2e6'
                            }
                          }}
                        >
                          <svg width="16" height="16" viewBox="0 0 41 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M27.1666 26.6667L20.4999 20L13.8333 26.6667" stroke="#6c757d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M20.5 20V35" stroke="#6c757d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M34.4833 30.6501C36.1088 29.7638 37.393 28.3615 38.1331 26.6644C38.8731 24.9673 39.027 23.0721 38.5703 21.2779C38.1136 19.4836 37.0724 17.8926 35.6111 16.7558C34.1497 15.619 32.3514 15.0013 30.4999 15.0001H28.3999C27.8955 13.0488 26.9552 11.2373 25.6498 9.70171C24.3445 8.16614 22.708 6.94647 20.8634 6.1344C19.0189 5.32233 17.0142 4.93899 15.0001 5.01319C12.9861 5.0874 11.015 5.61722 9.23523 6.56283C7.45541 7.50844 5.91312 8.84523 4.7243 10.4727C3.53549 12.1002 2.73108 13.9759 2.37157 15.959C2.01205 17.9421 2.10678 19.9809 2.64862 21.9222C3.19047 23.8634 4.16534 25.6565 5.49994 27.1667" stroke="#6c757d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Upload Logo
                        </button>
                        <input
                          type="file"
                          name="File"
                          onChange={handleInputChange}
                          accept="image/*"
                          style={{ display: 'none' }}
                        />
                      </div>
                      {previewImage && (
                        <img 
                          src={previewImage} 
                          alt="Selected logo preview" 
                          style={{width: '100px', height: '100px', objectFit: 'contain', marginTop: '10px'}}
                        />
                      )}
                      {!previewImage && settingData?.CompanyLogoPath && (
                        <img 
                          src={imagePathCorrector(settingData?.CompanyLogoPath)} 
                          alt="Current logo" 
                          style={{width: '100px', height: '100px', objectFit: 'contain', marginTop: '10px'}}
                        />
                      )}
                    </div></>
                  }

                  <div className="mt-3 d-flex justify-content-end">
                    <button className="btn btn-primary  btn-sm" onClick={handleSubmit} disabled={loading}>
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
