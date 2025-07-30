
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
export const getTransactionById = async (id,token) => {
    try {
        const response = await axios.get(`${apiUrl}Transactions/GetTransaction?id=0&PackageId=0&UserPackageId=${id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

//Cancel Subscription
export const cancelSubscription = async (id,token) => {
    try {
        const response = await axios.get(`${apiUrl}Transactions/CancelStripeSubscription?SubscriptionId=${id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};


//resume subscription
export const resumeSubscription = async (id,token) => {
    try {
        const response = await axios.get(`${apiUrl}Transactions/ResumeStripeSubscription?SubscriptionId=${id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};