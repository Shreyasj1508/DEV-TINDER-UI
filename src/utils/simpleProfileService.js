import { apiService } from './apiService';
import { updateUser } from './userSlice';
import { updateUserInFeed, refreshUserInFeed } from './feedSlice';

/**
 * Simple Profile Service without WebSocket dependencies
 * Use this when socket.io is not available on the backend
 */
class SimpleProfileService {
  constructor() {
    this.dispatch = null;
  }

  // Initialize without socket connection
  initialize(dispatch) {
    this.dispatch = dispatch;
    console.log('✅ Simple profile service initialized (no WebSocket)');
  }

  // Update user profile with backend sync only
  async updateProfile(profileData, currentUser) {
    try {
      console.log('🔄 Updating profile:', profileData);
      
      // Send update to backend
      const response = await apiService.updateProfile(profileData);
      
      if (response.success) {
        // Update local state
        if (this.dispatch) {
          this.dispatch(updateUser(response.data));
          // Also update in feed if user exists there
          this.dispatch(refreshUserInFeed(response.data));
        }

        console.log('✅ Profile updated successfully (local only)');

        return {
          success: true,
          data: response.data,
          message: response.message || 'Profile updated successfully!'
        };
      }
      
      throw new Error(response.message || 'Profile update failed');
      
    } catch (error) {
      console.error('❌ Profile update error:', error);
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
      console.error('❌ Profile refresh error:', error);
      throw error;
    }
  }

  // Mock socket connection status
  isConnected() {
    return false; // Always false since no socket
  }

  // No-op disconnect
  disconnect() {
    console.log('ℹ️ Simple profile service - no socket to disconnect');
  }
}

// Export singleton instance
export const simpleProfileService = new SimpleProfileService();
export default simpleProfileService;
