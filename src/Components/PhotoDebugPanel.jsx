import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getProfilePhotoUrl, isValidPhotoUrl } from '../utils/imageUtils';

/**
 * PhotoDebugPanel - A debugging component to help identify photo loading issues
 * Shows detailed information about user photos in the current feed
 */
const PhotoDebugPanel = ({ isVisible = false }) => {
  const feed = useSelector((store) => store.feed);
  const user = useSelector((store) => store.user);
  const [detailedInfo, setDetailedInfo] = useState([]);

  useEffect(() => {
    if (feed && Array.isArray(feed)) {
      const info = feed.map(feedUser => {
        const photoUrl = getProfilePhotoUrl(feedUser);
        return {
          id: feedUser._id,
          name: `${feedUser.firstName || 'Unknown'} ${feedUser.lastName || ''}`,
          photoUrl,
          isValid: isValidPhotoUrl(photoUrl),
          backendPhotoField: feedUser.photo, // Specifically track backend's 'photo' field
          allPhotoFields: {
            photo: feedUser.photo, // Backend field - show first
            photoURL: feedUser.photoURL,
            photoUrl: feedUser.photoUrl,
            profilePhoto: feedUser.profilePhoto,
            image: feedUser.image,
            avatar: feedUser.avatar,
            picture: feedUser.picture,
            profilePicture: feedUser.profilePicture
          }
        };
      });
      setDetailedInfo(info);
    }
  }, [feed]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 bg-white border rounded-lg shadow-lg p-4 max-w-md max-h-96 overflow-y-auto z-50">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-lg">Photo Debug Info</h3>
        <span className="text-sm text-gray-500">
          {feed?.length || 0} users in feed
        </span>
      </div>
      
      {/* Current User */}
      {user && (
        <div className="mb-4 p-3 bg-blue-50 rounded border">
          <h4 className="font-semibold text-blue-800 mb-2">Current User</h4>
          <div className="text-sm">
            <div><strong>Name:</strong> {user.firstName} {user.lastName}</div>
            <div><strong>Photo URL:</strong> {getProfilePhotoUrl(user) || 'None'}</div>
            <div><strong>Valid:</strong> {isValidPhotoUrl(getProfilePhotoUrl(user)) ? '✅' : '❌'}</div>
          </div>
        </div>
      )}

      {/* Feed Users */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-800">Feed Users</h4>
        {detailedInfo.map((info, index) => (
          <div key={info.id} className="p-3 bg-gray-50 rounded border text-xs">
            <div className="font-medium mb-1">{index + 1}. {info.name}</div>
            <div className="space-y-1">
              {/* Highlight backend's 'photo' field */}
              <div className="p-2 bg-blue-50 border border-blue-200 rounded">
                <strong>Backend 'photo' field:</strong> 
                <span className={`ml-1 ${info.backendPhotoField ? 'text-green-600' : 'text-red-600'}`}>
                  {info.backendPhotoField ? (
                    <span title={info.backendPhotoField}>
                      {info.backendPhotoField.substring(0, 30)}...
                    </span>
                  ) : 'Empty/Null'}
                  {info.backendPhotoField ? ' ✅' : ' ❌'}
                </span>
              </div>
              
              <div>
                <strong>Selected Photo:</strong> 
                <span className={`ml-1 ${info.isValid ? 'text-green-600' : 'text-red-600'}`}>
                  {info.photoUrl ? (
                    <span title={info.photoUrl}>
                      {info.photoUrl.substring(0, 30)}...
                    </span>
                  ) : 'None'}
                  {info.isValid ? ' ✅' : ' ❌'}
                </span>
              </div>
              
              <details className="mt-1">
                <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
                  All Photo Fields
                </summary>
                <div className="mt-1 pl-2 border-l-2 border-gray-200">
                  {Object.entries(info.allPhotoFields).map(([field, value]) => (
                    <div key={field} className={`text-xs ${field === 'photo' ? 'font-bold text-blue-600' : ''}`}>
                      <strong>{field}:</strong> {value || 'null'}
                    </div>
                  ))}
                </div>
              </details>
            </div>
          </div>
        ))}
      </div>
      
      {detailedInfo.length === 0 && (
        <div className="text-center text-gray-500 py-4">
          No users in feed
        </div>
      )}
    </div>
  );
};

/**
 * PhotoDebugToggle - A button to toggle the debug panel
 */
export const PhotoDebugToggle = () => {
  const [showDebug, setShowDebug] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowDebug(!showDebug)}
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors z-40"
        title="Toggle Photo Debug Panel"
      >
        🔍📷
      </button>
      <PhotoDebugPanel isVisible={showDebug} />
    </>
  );
};

export default PhotoDebugPanel;
