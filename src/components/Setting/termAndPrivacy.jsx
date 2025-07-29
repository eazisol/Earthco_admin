import DashboardLayout from "../DashboardLayout/DashboardLayout"; 
import JoditEditor from 'jodit-react'; 
import { useEffect, useMemo, useRef, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import { addEmailSetting, getEmailSetting } from "../../APIS/settings";
    export const TermAndPrivacy = () => {
        const { loginUser } = useAppContext();
        console.log("🚀 ~ TermAndPrivacy ~ loginUser:", loginUser)
        const [content, setContent] = useState("");
        const [settingData, setSettingData] = useState({
            TermsAndConditions: "",
            PrivacyPolicy: ""
        });
        console.log("🚀 ~ TermAndPrivacy ~ settingData:", settingData)
        const [privacyContent, setPrivacyContent] = useState("");
        const config = useMemo(() => ({
			readonly: false,
			placeholder: ''
		}),
		[]
	);
        const editor = useRef(null);
        const editorPrivacy = useRef(null);
        const [loading, setLoading] = useState(false);
        const handleSubmit = async (e) => {
            e.preventDefault();
            
            setLoading(true);
            const formDataToSend = new FormData();
            formDataToSend.append('Files', null);
            const settingDataToSend = {
                ...settingData,
              TermsAndConditions: content,
              PrivacyPolicy: privacyContent
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
              toast.error("Failed to update settings");
            } finally {
              setLoading(false);
            }
          };
        const getSettings = async () => {
            setLoading(true);
            try {
              const response = await getEmailSetting(loginUser?.Data?.TenantId);
              setSettingData(response?.data || {});
              setContent(response?.data?.TermsAndConditions || "");
              setPrivacyContent(response?.data?.PrivacyPolicy || "");
            } catch (error) {
              console.error("Error fetching settings:", error);
            } finally {
              setLoading(false);
            }
          };
        
          useEffect(() => {
            getSettings();
          }, []);
  return (
    <DashboardLayout>
         <div className="content-body">
        <div className="page-titles">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
                <a href="javascript:void(0)">Term And Privacy</a>
            </li>
          </ol>
        </div>
        <div className="container-fluid">
          <div className="row table-space">
            <div className="col-6">
           <div className="col-xl-12 mb-3">
              <label className="form-label">Terms And Conditions<span className="text-danger">*</span></label>
              </div>
           <JoditEditor
			ref={editor}
			value={content}
			config={config}
			tabIndex={2} // tabIndex of textarea
			onBlur={newContent => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
			onChange={newContent => {}}
		/>
           </div>
           <div className="col-6">
           <div className="col-xl-12 mb-3">
                <label className="form-label">Privacy Policy<span className="text-danger">*</span></label>
              </div>
           <JoditEditor
			ref={editorPrivacy}
			value={privacyContent}
			config={config}
			tabIndex={2} // tabIndex of textarea
			onBlur={newContent => setPrivacyContent(newContent)} // preferred to use only this option to update the content for performance reasons
			onChange={newContent => {}}
		/>
           </div>
           <div className="mt-3 d-flex justify-content-end">
              <button className="btn btn-primary btn-sm" onClick={handleSubmit} disabled={loading}>
                {loading ? "Updating..." : "Update Settings"}
              </button>
            </div>
          </div>
        </div>
      </div>
      </DashboardLayout>
  );
};