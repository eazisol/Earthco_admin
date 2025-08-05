import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

export const addEmailSetting = async (formData) => {
    const token = JSON.parse(localStorage.getItem("user"));
  try {
    const response = await axios.post(`${apiUrl}/Settings/AddSetting`, formData, {
      headers: {
        "Content-Type": "multipart/form-data", 
        Authorization: `Bearer ${token.token.data}`,
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getEmailSetting = async (id) => {
    const token = JSON.parse(localStorage.getItem("user"));
  try {
    const response = await axios.get(`${apiUrl}/Settings/GetSetting?id=${id}`, {
      headers: {
        "Content-Type": "application/json", 
        Authorization: `Bearer ${token.token.data}`,
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
};
export const SettingPrivacyAndTerms = async (data) => {
  const token = JSON.parse(localStorage.getItem("user"));
  try {
      const response = await axios.post(`${apiUrl}Settings/AddSettingPrivacyAndTerms`, data, {
          headers: {
              Authorization: `Bearer ${token.token.data}`,
              "Content-Type": "application/json",
          },
      });
      return response;
  } catch (error) {
    throw error;
  }
};
//Contact us
export const contactUs=async(data)=>{
  const token = JSON.parse(localStorage.getItem("user"));
  try {
    const response = await axios.get(`${apiUrl}Settings/GetContactMessagesServerSideList?Search=""&DisplayStart=${data?.DisplayStart}&DisplayLength=${data?.DisplayLength}`, {
      headers: {
        Authorization: `Bearer ${token.token.data}`,
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};
//Delete contact us
export const deleteContactUs=async(id)=>{
  const token = JSON.parse(localStorage.getItem("user"));
  try {
    const response = await axios.get(`${apiUrl}Settings/DeleteContactMessage?id=${id}`, {
      headers: {
        Authorization: `Bearer ${token.token.data}`,
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }}