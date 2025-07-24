
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;


export const getTenantServerSideList = async (search='', displayStart=1, displayLength=10) => {
    const token = JSON.parse(localStorage.getItem("user"));
  try {
        const response = await axios.get(`${apiUrl}Transactions/GetTransactionServerSideList?Search=${search}&DisplayStart=${displayStart}&DisplayLength=${displayLength}`, {
      headers: {
        "Content-Type": "application/json", 
        Authorization: `Bearer ${token.token.data}`,
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
