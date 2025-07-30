import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;
export const getPackagesType = async (token) => {
  try {
    const { data } = await axios.get(
      `${apiUrl}Packages/GetPackageTypeList`,
      {
        headers: {
          Authorization: `Bearer ${token}`, 
          "Content-Type": "application/json", 
        },
      }
    );
    return data;
  } catch (error) {
    return {
      error: true,
      message: error.response?.data?.message || "Failed to fetch tenant",
    };
  }
};
export const deletePackage = async (id) => {
   const token = JSON.parse(localStorage.getItem("user"));
  try {
    const  data  = await axios.get(
      `${apiUrl}/Packages/DeletePackage?id=${id}`,
      {
        headers: {
          Authorization: `Bearer ${token.token.data}`, 
          "Content-Type": "application/json", 
        },
      }
    );
    return data;
  } catch (error) {
    return {
      error: true,
      message: error.response?.data?.message || "Failed to fetch tenant",
    };
  }
};
export const addPackage = async (body) => {
     const token = JSON.parse(localStorage.getItem("user"));
  try {
    const  data  = await axios.post(`${apiUrl}Packages/AddPackage`, body ,{
        headers: {
          Authorization: `Bearer ${token.token.data}`, 
          "Content-Type": "application/json", 
        },
      });
      
    return data;
  } catch (error) {
    return error;
  }
};
export const getPackages = async ({ Search = "", DisplayStart = 0, DisplayLength = 10 } = {}) => {
  const token = JSON.parse(localStorage.getItem("user"));

  try {
    const { data } = await axios.get(
      `${apiUrl}Packages/GetPackagesServerSideList?Search="${Search}"&DisplayStart=${DisplayStart}&DisplayLength=${DisplayLength}`,
      {
        headers: {
          Authorization: `Bearer ${token?.token?.data}`,
          "Content-Type": "application/json",
        },
      
      }
    );
    return data;
  } catch (error) {
    return {
      error: true,
      message: error?.response ,
    };
  }
};
  export const getPackageById = async (PackageId) => {
  const token = JSON.parse(localStorage.getItem("user"));
  try {
    const { data } = await axios.get(`${apiUrl}Packages/GetPackage?id=${PackageId}`, {
      headers: {
        Authorization: `Bearer ${token?.token?.data}`,
        "Content-Type": "application/json",
      },
    });
    return data;
  } catch (error) {
    return {
      error: true,
      message: error?.response ,
    };
  }
};