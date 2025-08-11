import DashboardLayout from "../DashboardLayout/DashboardLayout";
import { CircularProgress, Alert } from "@mui/material";
import { useState, useEffect, useMemo, useRef } from "react";
import { getEmailSetting, addEmailSetting, SettingPrivacyAndTerms } from "../../APIS/settings";
import { toast } from "react-toastify";
import imagePathCorrector from "../Reuseable/imagePathCorrector";
import { useAppContext } from "../../context/AppContext";
import JoditEditor from 'jodit-react';
import TitleBar from "../TitleBar";

export const CompanyScreen = () => {
  const [settingData, setSettingData] = useState({});
  const [formData, setFormData] = useState({
    PrimeryColor: "",
    SecondaryColor: "",
    File: null
  });
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [activeTab, setActiveTab] = useState("company"); // Tab state
  const { loginUser } = useAppContext();
  const [content, setContent] = useState("");
  const [privacyContent, setPrivacyContent] = useState("");
  const config = useMemo(() => ({
    readonly: false,
    placeholder: ''
  }), []);
  const editor = useRef(null);
  const editorPrivacy = useRef(null);

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      const file = files[0];
      setFormData((prevData) => ({
        ...prevData,
        [name]: file,
      }));
      // Create preview URL for selected image
      if (file) {
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
    const user = JSON.parse(localStorage.getItem('user'));
    try {
      const response = await getEmailSetting(user?.Data?.TenantId);
      setSettingData(response?.data);
      setFormData({
        PrimeryColor: response?.data?.PrimeryColor || "",
        SecondaryColor: response?.data?.SecondaryColor || "",
        File: response?.File || null,
      });
      setContent(response?.data?.TermsAndCondition || "");
      setPrivacyContent(response?.data?.PrivacyPolicy || "");
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
      SecondaryColor: formData.SecondaryColor,
      TermsAndCondition: undefined,
      PrivacyPolicy: undefined
    };

    const companySettingData = {
      SettingId: settingData?.SettingId,
      TermsAndCondition: content,
      PrivacyPolicy: privacyContent
    }

    if (!formData.PrimeryColor || !formData.SecondaryColor) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      formDataToSend.append('SettingData', JSON.stringify(settingDataToSend));
      // Call both APIs in parallel using Promise.all
      const emailSettingResponse = await addEmailSetting(formDataToSend);
      if (emailSettingResponse) {
        await SettingPrivacyAndTerms(companySettingData);
      }
      if (emailSettingResponse) {
        toast.success(emailSettingResponse?.Message);
        getSettings();
      }
    } catch (error) {
      // toast.error("Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  // Tab content renderers
  const renderCompanyTab = () => (
    <div className="row">
      <div className="row">
      <div className="col-xl-5  mb-3">
        <Alert severity="info" style={{ fontSize: "15px" }}>
          <strong>Info:</strong> <br />
          <span>
            <b>Primary Color</b> will affect the main buttons and text color throughout the application.<br />
            <b>Secondary Color</b> will be applied to the sidebar and top bar background.
          </span>
        </Alert>
      </div>
      </div>
     
      <div className="col-xl-2 mt-4">
        <label className="form-label">Primary Color<span className="text-danger">*</span></label>
        <div>
          <input
            type="color"
            className="form-control form-control-sm"
            name="PrimeryColor"
            value={formData.PrimeryColor}
            onChange={handleInputChange}
            style={{ height: "40px", width: "100%" }}
          />
        </div>
      </div>
      <div className="col-xl-2 mt-4">
        <label className="form-label">Secondary Color<span className="text-danger">*</span></label>
        <div>
          <input
            type="color"
            className="form-control form-control-sm"
            name="SecondaryColor"
            value={formData.SecondaryColor}
            onChange={handleInputChange}
            style={{ height: "40px", width: "100%" }}
          />
        </div>
      </div>
      <div className="col-xl-12 mb-3 mt-3">
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
            type="button"
          >
            <svg width="16" height="16" viewBox="0 0 41 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M27.1666 26.6667L20.4999 20L13.8333 26.6667" stroke="#6c757d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M20.5 20V35" stroke="#6c757d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M34.4833 30.6501C36.1088 29.7638 37.393 28.3615 38.1331 26.6644C38.8731 24.9673 39.027 23.0721 38.5703 21.2779C38.1136 19.4836 37.0724 17.8926 35.6111 16.7558C34.1497 15.619 32.3514 15.0013 30.4999 15.0001H28.3999C27.8955 13.0488 26.9552 11.2373 25.6498 9.70171C24.3445 8.16614 22.708 6.94647 20.8634 6.1344C19.0189 5.32233 17.0142 4.93899 15.0001 5.01319C12.9861 5.0874 11.015 5.61722 9.23523 6.56283C7.45541 7.50844 5.91312 8.84523 4.7243 10.4727C3.53549 12.1002 2.73108 13.9759 2.37157 15.959C2.01205 17.9421 2.10678 19.9809 2.64862 21.9222C3.19047 23.8634 4.16534 25.6565 5.49994 27.1667" stroke="#6c757d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
            style={{ width: '100px', height: '100px', objectFit: 'contain', marginTop: '10px' }}
          />
        )}
        {!previewImage && settingData?.CompanyLogoPath && (
          <img
            src={imagePathCorrector(settingData?.CompanyLogoPath)}
            alt="Current logo"
            style={{ width: '100px', height: '100px', objectFit: 'contain', marginTop: '10px' }}
          />
        )}
      </div>
    </div>
  );

  const renderTermsTab = () => (
    <div className="row">
      <div className="col-12">
        <div className="col-xl-12 ">
          <label className="form-label">Terms And Conditions<span className="text-danger">*</span></label>
        </div>
        <JoditEditor
          // style={{ minHeight: "400px !important" }}
          ref={editor}
          value={content}
          config={config}
          tabIndex={2}
          onBlur={newContent => setContent(newContent)}
          onChange={newContent => { }}
        />
      </div>
    </div>
  );

  const renderPrivacyTab = () => (
    <div className="row">
      <div className="col-12">
        <div className="col-xl-12 ">
          <label className="form-label">Privacy Policy<span className="text-danger">*</span></label>
        </div>
        <JoditEditor
          // style={{ minHeight: "400px !important" }}
          ref={editorPrivacy}
          value={privacyContent}
          config={config}
          tabIndex={2}
          onBlur={newContent => setPrivacyContent(newContent)}
          onChange={newContent => { }}
        />
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="content-body">
  <TitleBar title="Brand Settings" />
        <div className="container-fluid">
          <div className="row table-space">
            <div className="col-xl-12">
              <div className="card">
                <div className="card-body">
                  {/* <h4 className="card-title mb-4">Brand Settings</h4> */}
                  {/* Tabs */}
                  <ul className="nav nav-tabs mb-3" role="tablist">
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${activeTab === "company" ? "active" : ""}`}
                        onClick={() => setActiveTab("company")}
                        type="button"
                        role="tab"
                      >
                        Company Details
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${activeTab === "terms" ? "active" : ""}`}
                        onClick={() => setActiveTab("terms")}
                        type="button"
                        role="tab"
                      >
                        Terms & Conditions
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${activeTab === "privacy" ? "active" : ""}`}
                        onClick={() => setActiveTab("privacy")}
                        type="button"
                        role="tab"
                      >
                        Privacy Policy
                      </button>
                    </li>
                  </ul>
                  {/* Tab Content */}
                  {loading ? (
                    <div className="text-center">
                      <div className="spinner-border" role="status">
                        <span className="visually-hidden"><CircularProgress /></span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="tab-content">
                        <div className={`tab-pane fade ${activeTab === "company" ? "show active" : ""}`}>
                          {renderCompanyTab()}
                        </div>
                        <div className={`tab-pane fade ${activeTab === "terms" ? "show active" : ""}`}>
                          {renderTermsTab()}
                        </div>
                        <div className={`tab-pane fade ${activeTab === "privacy" ? "show active" : ""}`}>
                          {renderPrivacyTab()}
                        </div>
                      </div>
                    </>
                  )}
                  <div className="mt-3 d-flex justify-content-end">
                    <button className="btn btn-primary btn-sm" onClick={handleSubmit} disabled={loading}>
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


