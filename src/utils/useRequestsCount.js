// Custom hook to track requests count for navbar badge
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { apiService } from './apiService';

export const useRequestsCount = () => {
  const [requestsCount, setRequestsCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const user = useSelector((store) => store.user);
  
  // Listen to Redux requests state for immediate updates
  const requests = useSelector((store) => store.requests);

  const fetchRequestsCount = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await apiService.getReceivedRequests();
      
      if (response.success) {
        setRequestsCount(response.data?.length || 0);
      }
    } catch (error) {
      console.error('Error fetching requests count:', error);
      setRequestsCount(0);
    } finally {
      setLoading(false);
    }
  };

  // Update count immediately when Redux requests state changes
  useEffect(() => {
    if (requests && Array.isArray(requests)) {
      setRequestsCount(requests.length);
    }
  }, [requests]);

  useEffect(() => {
    fetchRequestsCount();
    
    // Refresh count every 30 seconds for background updates
    const interval = setInterval(fetchRequestsCount, 30000);
    
    return () => clearInterval(interval);
  }, [user]);

  return { requestsCount, loading, refreshCount: fetchRequestsCount };
};

export default useRequestsCount;
