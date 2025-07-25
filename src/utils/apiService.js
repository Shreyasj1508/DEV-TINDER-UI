// Unified API service that switches between mock and real backend
import axios from 'axios';
import { BASE_URL } from './constants';
import { mockBackendAPI, isDevelopmentMode } from './mockBackend';

// Configuration
const USE_MOCK_BACKEND = false; // Your real backend is ready!

// Axios instance for real backend calls
const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 10000
});

// Unified API service
export const apiService = {
  
  // Authentication
  async login(email, password) {
    if (USE_MOCK_BACKEND) {
      return await mockBackendAPI.login(email, password);
    }
    
    try {
      const response = await apiClient.post('/login', { email, password });
      return { success: true, data: response.data };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  async signup(userData) {
    if (USE_MOCK_BACKEND) {
      return await mockBackendAPI.signup(userData);
    }
    
    try {
      const response = await apiClient.post('/signup', userData);
      return { success: true, data: response.data };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Signup failed');
    }
  },

  async logout() {
    if (USE_MOCK_BACKEND) {
      return { success: true };
    }
    
    try {
      await apiClient.post('/logout');
      return { success: true };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Logout failed');
    }
  },

  // Profile
  async getProfile() {
    if (USE_MOCK_BACKEND) {
      return await mockBackendAPI.getProfile();
    }
    
    try {
      const response = await apiClient.get('/profile/view');
      return { success: true, data: response.data };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch profile');
    }
  },

  async updateProfile(profileData) {
    if (USE_MOCK_BACKEND) {
      return await mockBackendAPI.updateProfile(profileData);
    }
    
    try {
      const response = await apiClient.post('/profile/edit', profileData);
      return { success: true, data: response.data };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Profile update failed');
    }
  },

  // Feed
  async getFeed() {
    if (USE_MOCK_BACKEND) {
      return await mockBackendAPI.getFeed();
    }
    
    try {
      const response = await apiClient.get('/feed');
      return { success: true, data: response.data.data };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch feed');
    }
  },

  // Connection Requests
  async sendConnectionRequest(status, userId) {
    if (USE_MOCK_BACKEND) {
      return await mockBackendAPI.sendConnectionRequest(status, userId);
    }
    
    try {
      const response = await apiClient.post(`/request/send/${status}/${userId}`);
      return { success: true, data: response.data };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to send request');
    }
  },

  async getReceivedRequests() {
    if (USE_MOCK_BACKEND) {
      return await mockBackendAPI.getReceivedRequests();
    }
    
    try {
      const response = await apiClient.get('/user/requests/received');
      return { success: true, data: response.data.data };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch requests');
    }
  },

  async reviewConnectionRequest(status, requestId) {
    if (USE_MOCK_BACKEND) {
      return await mockBackendAPI.reviewConnectionRequest(status, requestId);
    }
    
    try {
      const response = await apiClient.post(`/request/review/${status}/${requestId}`);
      return { success: true, data: response.data };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to review request');
    }
  },

  // Connections
  async getConnections() {
    if (USE_MOCK_BACKEND) {
      return await mockBackendAPI.getConnections();
    }
    
    try {
      const response = await apiClient.get('/user/connections');
      return { success: true, data: response.data.data };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch connections');
    }
  },

  // Chat
  async getChatMessages(targetUserId) {
    if (USE_MOCK_BACKEND) {
      return await mockBackendAPI.getChatMessages(targetUserId);
    }
    
    try {
      const response = await apiClient.get(`/chat/${targetUserId}`);
      return { success: true, messages: response.data.messages };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch messages');
    }
  },

  async sendMessage(targetUserId, text) {
    if (USE_MOCK_BACKEND) {
      return await mockBackendAPI.sendMessage(targetUserId, text);
    }
    
    try {
      const response = await apiClient.post('/chat/send', { targetUserId, text });
      return { success: true, data: response.data };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to send message');
    }
  },

  async getRecentChats() {
    if (USE_MOCK_BACKEND) {
      return await mockBackendAPI.getRecentChats();
    }
    
    try {
      const response = await apiClient.get('/chat/recent');
      return { success: true, data: response.data.data };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch recent chats');
    }
  },

  // Premium
  async verifyPremium() {
    if (USE_MOCK_BACKEND) {
      return await mockBackendAPI.verifyPremium();
    }
    
    try {
      const response = await apiClient.get('/premium/verify');
      return { success: true, data: response.data };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to verify premium');
    }
  }
};

// Export configuration for easy switching
export const setUseMockBackend = (useMock) => {
  USE_MOCK_BACKEND = useMock;
};

export { USE_MOCK_BACKEND };
