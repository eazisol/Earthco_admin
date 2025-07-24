import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

export const loginUser = async ({ body }) => {
  try {
    const { data } = await axios.post(`${apiUrl}Accounts/Login`, body);
    localStorage.setItem("user", JSON.stringify(data));
    return data;
  } catch (error) {
    return error;
  }
};
export const AddTenant = async (obj) => {
    const token = JSON.parse(localStorage.getItem("user"));
  try {
    const { data } = await axios.post(`${apiUrl}Tenant/AddTenant`, obj,  {
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
export const getTenantById = async (id,token) => {
  try {
    const  data  = await axios.get(
      `${apiUrl}Tenant/GetTenant?id=${id}`,
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
export const getTenantRole = async () => {
  const token = JSON.parse(localStorage.getItem("user"));
  try {
    const data  = await axios.get(
      `${apiUrl}Tenant/GetRolesList`,
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
export const getTenant = async ({ Search = "", DisplayStart = 1, DisplayLength = 10 } = {}) => {
  const token = JSON.parse(localStorage.getItem("user"));
console.log("🚀 ~ getTenant ~ Search:",typeof Search)
  try {
    const { data } = await axios.get(
      `${apiUrl}Tenant/GetTenantServerSideList?Search="${Search}"&DisplayStart=${DisplayStart}&DisplayLength=${DisplayLength}`,
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
export const deleteTenant=async(id )=>{
  const token = JSON.parse(localStorage.getItem("user"));
  try {
    const { data } = await axios.get(`${apiUrl}Tenant/DeleteTenant?id=${id}`, {
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
// /Accounts/RegisterTenant
export const RegisterTenant = async (obj) => {
  const token = JSON.parse(localStorage.getItem("user"));
  try {
    const data  = await axios.post(`${apiUrl}Accounts/RegisterTenant`, obj, {
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