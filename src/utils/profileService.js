import { apiService } from './apiService';
import { updateUser } from './userSlice';
import { updateUserInFeed, refreshUserInFeed } from './feedSlice';
import { createSocketConnection } from './socket';

class ProfileService {
  constructor() {
    this.socket = null;
    this.dispatch = null;
  }

  // Initialize socket connection and set up listeners
  initialize(dispatch) {
    this.dispatch = dispatch;
    this.setupSocketConnection();
  }

  setupSocketConnection() {
    try {
      console.log('🔌 Attempting to establish socket connection...');
      this.socket = createSocketConnection();
      
      // Listen for profile updates from other users
      this.socket.on('profileUpdated', (data) => {
        console.log('Received profile update from socket:', data);
        this.handleExternalProfileUpdate(data);
      });

      // Listen for connection status
      this.socket.on('connect', () => {
        console.log('✅ Socket connected for profile updates');
      });

      this.socket.on('disconnect', () => {
        console.log('⚠️ Socket disconnected');
      });

      // Handle connection errors gracefully
      this.socket.on('connect_error', (error) => {
        console.warn('⚠️ Socket connection failed (this is OK, will work without real-time updates):', error.message);
        this.socket = null; // Disable socket functionality
      });

    } catch (error) {
      console.warn('⚠️ Socket connection failed (this is OK, will work without real-time updates):', error.message);
      this.socket = null; // Disable socket functionality
    }
  }

  // Handle profile updates from other users
  handleExternalProfileUpdate(profileData) {
    if (this.dispatch && profileData) {
      const { userId, updatedData } = profileData;
      
      // Update the user in feed if they exist there
      this.dispatch(updateUserInFeed({ userId, updatedData }));
      
      // If it's the current user, also update the user slice
      // Note: You might want to check if this is the current user by comparing IDs
      // For now, we'll update the feed which is more common for external updates
      console.log('Updated user profile in feed:', { userId, updatedData });
    }
  }

  // Update user profile with backend sync and real-time broadcast
  async updateProfile(profileData, currentUser) {
    try {
      console.log('Updating profile:', profileData);
      
      // Send update to backend
      const response = await apiService.updateProfile(profileData);
      
      if (response.success) {
        // Update local state
        if (this.dispatch) {
          this.dispatch(updateUser(response.data));
          // Also update in feed if user exists there
          this.dispatch(refreshUserInFeed(response.data));
        }

        // Broadcast update to other users via socket (if available)
        if (this.socket && this.socket.connected) {
          console.log('📡 Broadcasting profile update via socket...');
          this.socket.emit('profileUpdate', {
            userId: currentUser._id,
            updatedData: response.data,
            timestamp: new Date().toISOString()
          });
        } else {
          console.log('ℹ️ Socket not available - profile updated locally only');
        }

        return {
          success: true,
          data: response.data,
          message: response.message || 'Profile updated successfully!'
        };
      }
      
      throw new Error(response.message || 'Profile update failed');
      
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  }

  // Update specific field
  async updateField(field, value, currentUser) {
    const updateData = { [field]: value };
    return await this.updateProfile(updateData, currentUser);
  }

  // Batch update multiple fields
  async batchUpdate(updates, currentUser) {
    return await this.updateProfile(updates, currentUser);
  }

  // Clean up socket connection
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Check if socket is connected
  isConnected() {
    return this.socket && this.socket.connected;
  }

  // Manually refresh profile from backend
  async refreshProfile() {
    try {
      const response = await apiService.getProfile();
      if (response.success && this.dispatch) {
        this.dispatch(updateUser(response.data));
        return response.data;
      }
      throw new Error('Failed to refresh profile');
    } catch (error) {
      console.error('Profile refresh error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const profileService = new ProfileService();
export default profileService;
