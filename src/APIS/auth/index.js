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
//Add ContactMessage
export const AddContactMessage = async (obj) => {
  try {
    const { data } = await axios.post(`${apiUrl}Accounts/AddContactMessage`, obj,{
      headers: {
        "Content-Type": "application/json",
      },
  });
    return data;
  } catch (error) {
    throw error;
  }
};
//newsletter
export const AddNewsletter = async (obj) => {
  try {
      const { data } = await axios.post(`${apiUrl}Accounts/AddNewsletterSubscriber`, obj, {
          headers: {
            "Content-Type": "application/json",
          },
      });
    return data;
  } catch (error) {
    throw error; 
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
    throw error;
  }
};
export const getTenantById = async (id) => {
  const token = JSON.parse(localStorage.getItem("user"));
  try {
    const  data  = await axios.get(
      `${apiUrl}Tenant/GetTenant?id=${id}`,
      {
        headers: {
          Authorization: `Bearer ${token.token.data}`, 
          "Content-Type": "application/json", 
        },
      }
    );
    return data;
  } catch (error) {
    return error;
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
  }catch (error) {
    throw error;
  }
};
export const getTenant = async ({ Search = "", DisplayStart = 1, DisplayLength = 10 } = {}) => {
  const token = JSON.parse(localStorage.getItem("user"));
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
    throw error;
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
    throw error;
  }
};
// /Accounts/RegisterTenant
export const RegisterTenant = async (obj) => {
  try {
    const data  = await axios.post(`${apiUrl}Accounts/RegisterTenant`, obj, {
    
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const forgotPassword = async (obj) => {
  try {
    const data  = await axios.post(`${apiUrl}Accounts/ForgetPassword`, obj);
    return data;
  } catch (error) {
    throw error;
  }
};
export const verifyOTP = async (obj) => {
  try {
    const data  = await axios.get(`${apiUrl}Accounts/VerifyForgetPasswordCode?Email=${obj.Email}&Code=${obj.Code}`);
    return data;
  } catch (error) {
    throw error;
    }
  };
  export const resetPassword = async (obj) => {
    try {
      const data  = await axios.post(`${apiUrl}Accounts/ChangeForgetPassword`,obj);
      return data;
    } catch (error) {
        throw error;
    }
    };
  export const updateTenantStatus = async (obj) => {
    try {
      const token = JSON.parse(localStorage.getItem("user"));
      const data  = await axios.get(`${apiUrl}Tenant/UpdateTenantStatus?id=${obj.id}&Active=${obj.Active}`,{
        headers: {
          Authorization: `Bearer ${token.token.data}`,
          "Content-Type": "application/json",
        },
      });
      return data;
    } catch (error) {
      throw error;
    }
  };
  export const checkPackageStatus=async()=>{
    const token = JSON.parse(localStorage.getItem("user"));
    try {
      const data  = await axios.get(`${apiUrl}Tenant/CheckAnyActivePackage`,{
        headers: {
          Authorization: `Bearer ${token.token.data}`,
          "Content-Type": "application/json",
        },
      });
      return data;
    } catch (error) {
      throw error;
    }
  };
  //Update tenant package
  export const updateTenantPackage=async(obj)=>{
    const token = JSON.parse(localStorage.getItem("user"));
    try {
      const data  = await axios.post(`${apiUrl}Tenant/UpdateTenantPackage`, obj, {
        headers: {
          Authorization: `Bearer ${token.token.data}`,
          "Content-Type": "application/json",
        },
      });
      return data;
    } catch (error) {
      throw error;
    }
  };
  //Create Role 
  export const createRole = async (obj) => {
    const token = JSON.parse(localStorage.getItem("user"));
    try {
      const data  = await axios.post(`${apiUrl}Tenant/CreateRole`, obj, {
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
 //Role Persmission get
 export const getRolePermission = async (id) => {
  const token = JSON.parse(localStorage.getItem("user"));
  try {
    const data  = await axios.get(`${apiUrl}Tenant/RolesPermission?id=${id}`, {
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
//create role permission
export const createRolePermission = async (obj) => {
  const token = JSON.parse(localStorage.getItem("user"));
  try {
    const data  = await axios.post(`${apiUrl}Tenant/CreateAccessLevel`, obj, {
      headers: {
        Authorization: `Bearer ${token.token.data}`,
        "Content-Type": "application/json",
      },
    });
    console.log("🚀 ~ createRolePermission ~ data:", data)
    return data;
  } catch (error) {
    return error;
  }
};