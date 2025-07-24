import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;
    export const getCompanyList = async () => {
    const token = JSON.parse(localStorage.getItem("user"));
  try {
    const  data  = await axios.get(`${apiUrl}Company/GetCompanyList`, {
      headers: {
        Authorization: `Bearer ${token.token.data}`,
        "Content-Type": "application/json",
      },
    });
    return data;
  } catch (error) {
    return {
      error: true,
      message: error.response?.data?.message || "Failed to fetch tenant",
    };
  }
};
export const addCompany = async (body) => {
    const token = JSON.parse(localStorage.getItem("user"));
    try {
            const data = await axios.post(`${apiUrl}Company/AddCompany`, body, {
            headers: {
                Authorization: `Bearer ${token.token.data}`,
                "Content-Type": "application/json",
            },
        });
        return data;
    } catch (error) {
        return {
            error: true,
            message: error.response?.data?.message || "Failed to add company",
        };
    }
};
export const deleteCompany = async (id) => {
  console.log('id delete',id);
    const token = JSON.parse(localStorage.getItem("user"));
    try {
        const data = await axios.get(`${apiUrl}Company/DeleteCompany?id=${id}`, {
            headers: {
                Authorization: `Bearer ${token.token.data}`,
                "Content-Type": "application/json",
            },
        });
        return data;
    } catch (error) {
        return {
            error: true,
            message: error.response?.data?.message || "Failed to delete company",
        };
    }
};