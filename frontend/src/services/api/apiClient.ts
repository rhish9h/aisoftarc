import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

/**
 * API client factory following clean architecture principles
 * - Ensures separation of concerns 
 * - Enables easy testing through dependency injection
 * - Provides consistent error handling
 */
export const createApiClient = (baseConfig: AxiosRequestConfig = {}): AxiosInstance => {
  // Get API URL from environment variables or use default
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
  
  // Default configuration
  const defaultConfig: AxiosRequestConfig = {
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 seconds timeout
  };
  
  // Create the client with merged configurations
  const client = axios.create({
    ...defaultConfig,
    ...baseConfig,
    headers: {
      ...defaultConfig.headers,
      ...baseConfig.headers,
    },
  });
  
  // Request interceptor for adding auth tokens, logging, etc.
  client.interceptors.request.use(
    (config) => {
      // Add authentication token if available
      const token = localStorage.getItem('auth_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
  
  // Response interceptor for global error handling
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      // Log errors or handle specific error codes globally
      if (error.response) {
        const status = error.response.status;
        
        // Handle authentication errors
        if (status === 401) {
          // Clear token and redirect to login
          localStorage.removeItem('auth_token');
          // window.location.href = '/login';
        }
        
        // Enhance error message with server information if available
        const errorMessage = error.response.data?.message || error.message;
        error.message = `API Error (${status}): ${errorMessage}`;
      } else if (error.request) {
        // Request was made but no response received
        error.message = 'Network error: Server did not respond';
      }
      
      return Promise.reject(error);
    }
  );
  
  return client;
};

// Export default client instance
export const apiClient = createApiClient();
