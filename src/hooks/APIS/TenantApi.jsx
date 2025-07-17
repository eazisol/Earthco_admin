import axios from "axios";

export const getTenant = async () => {
  try {
    const { data } = await axios.get(
      `https://admin.earthcoapp.com/admin/api/Tenant/GetTenant?id=1`
    );
return data
  } catch (error) {
    return error
  }
};
