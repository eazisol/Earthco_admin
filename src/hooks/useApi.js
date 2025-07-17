import { useState, useCallback } from 'react';
import axios from 'axios';

/**
 * Simple custom hook for making GET and POST API calls
 * @param {string} url - The API endpoint URL
 * @param {Object} options - Configuration options
 * @param {string} options.method - HTTP method (GET or POST)
 * @param {Object} options.headers - Request headers
 * @param {Object} options.body - Request body for POST requests
 * @param {boolean} options.immediate - Whether to execute the request immediately
 * @returns {Object} - { data, loading, error, execute }
 */
const useApi = (url, options = {}) => {
  const {
    method = 'GET',
    headers = {},
    body = null,
    immediate = false,
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Execute API call
  const execute = useCallback(async (customUrl = url, customOptions = {}) => {
    const finalUrl = customUrl || url;
    const finalOptions = { ...options, ...customOptions };
    const finalMethod = finalOptions.method || method;
    const finalHeaders = { 'Content-Type': 'application/json', ...headers, ...finalOptions.headers };
    const finalBody = finalOptions.body !== undefined ? finalOptions.body : body;

    setLoading(true);
    setError(null);

    try {
      const axiosConfig = {
        method: finalMethod.toLowerCase(),
        url: finalUrl,
        headers: finalHeaders,
      };

      if (finalMethod === 'POST') {
        axiosConfig.data = finalBody;
      } else if (finalMethod === 'GET' && finalBody) {
        axiosConfig.params = finalBody; // for query params
      }

      const response = await axios(axiosConfig);

      setData(response.data);
      return response.data;

    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred while fetching data';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [url, method, headers, body, options]);

  // Execute immediately if requested
  if (immediate && url) {
    execute();
  }

  return {
    data,
    loading,
    error,
    execute,
  };
};

export default useApi;
