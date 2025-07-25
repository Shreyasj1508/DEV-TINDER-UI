import React, { useEffect, useState } from 'react';
import { apiService } from '../utils/apiService';

/**
 * BackendPhotoTester - A debugging component to test photo field directly from backend
 */
const BackendPhotoTester = () => {
  const [feedData, setFeedData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const testBackendPhotoData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔍 Testing backend photo data...');
      
      // Test feed endpoint only
      const feedResponse = await apiService.getFeed();
      console.log('📊 Raw Feed Response:', feedResponse);
      
      if (feedResponse.success && feedResponse.data) {
        setFeedData(feedResponse.data);
        
        console.log('👥 Feed Users Photo Analysis:');
        feedResponse.data.forEach((user, index) => {
          console.log(`User ${index + 1}: ${user.firstName} ${user.lastName}`, {
            id: user._id,
            photo: user.photo,
            photoURL: user.photoURL,
            hasPhoto: !!(user.photo || user.photoURL),
            photoType: typeof user.photo,
            photoURLType: typeof user.photoURL,
            allKeys: Object.keys(user),
            rawUser: user
          });
        });
      }
      
    } catch (error) {
      console.error('❌ Backend test failed:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testBackendPhotoData();
  }, []);

  return (
    <div className="fixed top-1/2 left-4 transform -translate-y-1/2 bg-white border rounded-lg shadow-lg p-4 max-w-md max-h-96 overflow-y-auto z-50">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-lg">Backend Photo Test</h3>
        <button 
          onClick={testBackendPhotoData}
          className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
          disabled={loading}
        >
          {loading ? '...' : 'Refresh'}
        </button>
      </div>
      
      {error && (
        <div className="mb-3 p-2 bg-red-100 text-red-700 rounded text-sm">
          Error: {error}
        </div>
      )}
      
      {/* Feed Data Analysis */}
      {feedData && (
        <div className="mb-4">
          <h4 className="font-semibold text-gray-800 mb-2">Feed Users ({feedData.length})</h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {feedData.map((user, index) => (
              <div key={user._id} className="p-2 bg-gray-50 rounded text-xs">
                <div className="font-medium">{user.firstName} {user.lastName}</div>
                <div className="text-gray-600">
                  <div><strong>photo:</strong> {user.photo || 'null'}</div>
                  <div><strong>photoURL:</strong> {user.photoURL || 'null'}</div>
                  <div><strong>Has Photo:</strong> {(user.photo || user.photoURL) ? '✅' : '❌'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="text-xs text-gray-500">
        Check browser console for detailed logs
      </div>
    </div>
  );
};

/**
 * BackendPhotoTestToggle - Button to show/hide the backend test panel
 */
export const BackendPhotoTestToggle = () => {
  const [showTest, setShowTest] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowTest(!showTest)}
        className="fixed bottom-20 right-4 bg-red-500 text-white p-3 rounded-full shadow-lg hover:bg-red-600 transition-colors z-40"
        title="Test Backend Photo Data"
      >
        🔬📷
      </button>
      {showTest && <BackendPhotoTester />}
    </>
  );
};

export default BackendPhotoTester;
