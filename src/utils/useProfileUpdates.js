import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

/**
 * Custom hook to track profile changes and provide update notifications
 * Useful for showing when profile data has been updated
 */
export const useProfileUpdates = () => {
  const user = useSelector((store) => store.user);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [hasRecentUpdate, setHasRecentUpdate] = useState(false);

  useEffect(() => {
    if (user) {
      const now = new Date();
      setLastUpdated(now);
      setHasRecentUpdate(true);

      // Clear the recent update flag after 3 seconds
      const timer = setTimeout(() => {
        setHasRecentUpdate(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [user]);

  return {
    lastUpdated,
    hasRecentUpdate,
    user
  };
};

/**
 * Custom hook to track feed updates for a specific user
 * Useful for highlighting updated profiles in the feed
 */
export const useFeedUserUpdates = (userId) => {
  const feed = useSelector((store) => store.feed);
  const [userProfile, setUserProfile] = useState(null);
  const [hasUpdate, setHasUpdate] = useState(false);

  useEffect(() => {
    if (feed && Array.isArray(feed) && userId) {
      const foundUser = feed.find(user => user._id === userId);
      if (foundUser) {
        if (userProfile && JSON.stringify(userProfile) !== JSON.stringify(foundUser)) {
          setHasUpdate(true);
          setTimeout(() => setHasUpdate(false), 2000);
        }
        setUserProfile(foundUser);
      }
    }
  }, [feed, userId, userProfile]);

  return {
    userProfile,
    hasUpdate
  };
};

export default useProfileUpdates;
