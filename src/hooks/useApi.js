import { useState, useCallback } from 'react';

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
    const finalHeaders = { ...headers, ...finalOptions.headers };
    const finalBody = finalOptions.body !== undefined ? finalOptions.body : body;

    setLoading(true);
    setError(null);

    try {
      const requestOptions = {
        method: finalMethod,
        headers: {
          'Content-Type': 'application/json',
          ...finalHeaders,
        },
      };

      // Add body for POST requests
      if (finalBody && finalMethod === 'POST') {
        requestOptions.body = typeof finalBody === 'string' 
          ? finalBody 
          : JSON.stringify(finalBody);
      }

      const response = await fetch(finalUrl, requestOptions);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
      }

      const responseData = await response.json();
      setData(responseData);
      return responseData;

    } catch (err) {
      const errorMessage = err.message || 'An error occurred while fetching data';
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