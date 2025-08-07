// Minimal mock backend for DEV-TINDER-UI

export const isDevelopmentMode = true;

export const mockBackendAPI = {
  login: async (email, password) => ({ success: true, data: { email, token: 'mock-token' } }),
  signup: async (userData) => ({ success: true, data: userData }),
  getProfile: async () => ({ success: true, data: { name: 'Mock User', email: 'mock@example.com' } }),
  updateProfile: async (profileData) => ({ success: true, data: profileData }),
  getFeed: async () => ({ success: true, data: [] }),
  sendConnectionRequest: async (status, userId) => ({ success: true, data: { status, userId } }),
  getReceivedRequests: async () => ({ success: true, data: [] }),
  reviewConnectionRequest: async (status, requestId) => ({ success: true, data: { status, requestId } }),
  getConnections: async () => ({ success: true, data: [] }),
  getChatMessages: async (targetUserId) => ({ success: true, messages: [] }),
  sendMessage: async (targetUserId, text) => ({ success: true, data: { targetUserId, text } }),
  getRecentChats: async () => ({ success: true, data: [] }),
  verifyPremium: async () => ({ success: true, data: { premium: false } })
};
