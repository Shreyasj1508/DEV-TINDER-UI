import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { profileService } from '../utils/profileService';

/**
 * ProfileUpdateListener - A component that sets up global profile update listening
 * Place this component at the app level to ensure profile updates are synchronized
 * across all components in real-time.
 */
const ProfileUpdateListener = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Initialize profile service with dispatch
    profileService.initialize(dispatch);

    // Cleanup on unmount
    return () => {
      profileService.disconnect();
    };
  }, [dispatch]);

  return children || null;
};

export default ProfileUpdateListener;
