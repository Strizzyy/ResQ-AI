/**
 * API Service for ResQ-AI Frontend
 * 
 * PLACEHOLDER ENDPOINTS - Backend team will provide actual URLs
 * This service contains mock implementations for development
 */

import axios from 'axios';

// TODO: Backend team - Replace with actual API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Configure axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens
apiClient.interceptors.request.use(
  (config) => {
    // TODO: Add authentication token when backend implements auth
    // const token = localStorage.getItem('authToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('Network Error:', error.message);
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

/**
 * Retry logic with exponential backoff
 * @param {Function} requestFn - Function that returns a promise
 * @param {number} maxRetries - Maximum number of retry attempts
 * @param {number} baseDelay - Base delay in milliseconds
 * @returns {Promise} Result of the request
 */
const retryRequest = async (requestFn, maxRetries = 3, baseDelay = 1000) => {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;
      
      // Don't retry on client errors (4xx)
      if (error.response && error.response.status >= 400 && error.response.status < 500) {
        throw error;
      }
      
      // Don't retry if this was the last attempt
      if (attempt === maxRetries) {
        break;
      }
      
      // Calculate exponential backoff delay
      const delay = baseDelay * Math.pow(2, attempt);
      console.log(`Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};

/**
 * Submit emergency report to backend
 * 
 * PLACEHOLDER - Backend team will implement LLM processing endpoint
 * TODO: Replace '/reports' with actual endpoint URL
 * 
 * @param {Object} reportData - Report data
 * @param {string[]} reportData.images - Array of Base64 encoded images
 * @param {string} reportData.description - Text description
 * @param {number} reportData.timestamp - Unix timestamp
 * @param {Object} reportData.location - Optional location data
 * @returns {Promise<Object>} Response from backend
 */
export const submitReport = async (reportData) => {
  // MOCK IMPLEMENTATION - Remove when backend is ready
  console.log('📤 [MOCK] Submitting report to backend:', {
    imageCount: reportData.images?.length || 0,
    descriptionLength: reportData.description?.length || 0,
    timestamp: reportData.timestamp
  });
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock successful response
  return {
    success: true,
    reportId: `MOCK-${Date.now()}`,
    message: 'Report received successfully',
    estimatedResponseTime: 5
  };
  
  // ACTUAL IMPLEMENTATION - Uncomment when backend is ready
  // return retryRequest(async () => {
  //   const response = await apiClient.post('/reports', reportData);
  //   return response.data;
  // });
};

/**
 * Fetch task list from backend
 * 
 * PLACEHOLDER - Backend team will implement Genetic Algorithm output endpoint
 * TODO: Replace '/tasks' with actual endpoint URL
 * 
 * @param {Object} params - Query parameters
 * @param {string} params.status - Filter by status (default: 'active')
 * @param {number} params.limit - Maximum number of tasks (default: 50)
 * @returns {Promise<Object>} Task list response
 */
export const fetchTasks = async (params = { status: 'active', limit: 50 }) => {
  // MOCK IMPLEMENTATION - Remove when backend is ready
  console.log('📥 [MOCK] Fetching tasks from backend:', params);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Mock task data
  const mockTasks = [
    {
      id: 'TASK-001',
      title: 'Medical assistance needed at downtown area',
      location: {
        latitude: 40.7128,
        longitude: -74.0060,
        address: '123 Main St, Downtown'
      },
      priority: 'critical',
      skillRequirements: ['medical', 'first-aid'],
      description: 'Multiple injuries reported. Need immediate medical attention.',
      assignedVolunteers: 2,
      requiredVolunteers: 5,
      status: 'pending',
      createdAt: Date.now() - 300000,
      timeWindow: {
        start: Date.now(),
        end: Date.now() + 3600000
      }
    },
    {
      id: 'TASK-002',
      title: 'Supply distribution at community center',
      location: {
        latitude: 40.7580,
        longitude: -73.9855,
        address: '456 Oak Ave, Midtown'
      },
      priority: 'high',
      skillRequirements: ['logistics', 'driving'],
      description: 'Distribute emergency supplies to affected families.',
      assignedVolunteers: 3,
      requiredVolunteers: 4,
      status: 'in-progress',
      createdAt: Date.now() - 600000,
      timeWindow: {
        start: Date.now(),
        end: Date.now() + 7200000
      }
    },
    {
      id: 'TASK-003',
      title: 'Search and rescue operation',
      location: {
        latitude: 40.7489,
        longitude: -73.9680,
        address: '789 Pine Rd, East Side'
      },
      priority: 'critical',
      skillRequirements: ['rescue', 'climbing', 'medical'],
      description: 'People trapped in collapsed structure. Specialized rescue team needed.',
      assignedVolunteers: 1,
      requiredVolunteers: 6,
      status: 'pending',
      createdAt: Date.now() - 180000,
      timeWindow: {
        start: Date.now(),
        end: Date.now() + 1800000
      }
    }
  ];
  
  return {
    tasks: mockTasks,
    lastUpdated: Date.now(),
    totalCount: mockTasks.length
  };
  
  // ACTUAL IMPLEMENTATION - Uncomment when backend is ready
  // return retryRequest(async () => {
  //   const response = await apiClient.get('/tasks', { params });
  //   return response.data;
  // });
};

export default {
  submitReport,
  fetchTasks,
  retryRequest
};
