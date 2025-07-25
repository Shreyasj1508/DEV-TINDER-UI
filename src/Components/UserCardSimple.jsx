import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";
import { apiService } from "../utils/apiService";

const UserCard = ({ user }) => {
  const dispatch = useDispatch();
  const [isAnimating, setIsAnimating] = useState(false);
  const [error, setError] = useState(null);
  
  if (!user) return null;
  
  const { _id, firstName, lastName, age, gender, about, photoURL, skills } = user;

  const handleSendRequest = async (status, userId) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setError(null);
    
    try {
      const response = await apiService.sendConnectionRequest(status, userId);
      
      if (response.success) {
        setTimeout(() => {
          dispatch(removeUserFromFeed(userId));
        }, 300);
      }
      
    } catch (error) {
      console.error("Error sending request:", error);
      setError(error.message);
      setIsAnimating(false);
    }
  };

  return (
    <div className="relative w-96 h-[600px] bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-3xl">
      {error && (
        <div className="absolute top-4 left-4 right-4 bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-lg text-sm z-10">
          {error}
        </div>
      )}
      {/* Main Image */}
      <div className="relative h-[70%] overflow-hidden">
        <img 
          src={photoURL || 'https://via.placeholder.com/400x600'} 
          alt={`${firstName} ${lastName}`}
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70"></div>
        
        {/* Profile Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-3xl font-bold">{firstName}</h2>
            {age && <span className="text-2xl font-light">{age}</span>}
          </div>
          
          {/* Skills Pills */}
          {skills && skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {skills.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium"
                >
                  {skill.trim()}
                </span>
              ))}
              {skills.length > 3 && (
                <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                  +{skills.length - 3} more
                </span>
              )}
            </div>
          )}
          
          {/* Status/Gender Badge */}
          {gender && (
            <div className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              💻 {gender} Developer
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="h-[30%] p-6 bg-white">
        {about && (
          <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
            {about}
          </p>
        )}
        
        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-4">
          <button
            className="flex items-center justify-center w-14 h-14 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transform transition-all duration-200 hover:scale-110 active:scale-95 disabled:opacity-50"
            onClick={() => handleSendRequest("ignored", _id)}
            disabled={isAnimating}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <button
            className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white rounded-full shadow-xl transform transition-all duration-200 hover:scale-110 active:scale-95 disabled:opacity-50"
            onClick={() => handleSendRequest("intrested", _id)}
            disabled={isAnimating}
          >
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </button>
          
          <button
            className="flex items-center justify-center w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transform transition-all duration-200 hover:scale-110 active:scale-95 disabled:opacity-50"
            onClick={() => handleSendRequest("intrested", _id)}
            disabled={isAnimating}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
