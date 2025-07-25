import axios from "axios";
import React, { useState, useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";

const UserCard = ({ user, onSwipe }) => {
  const dispatch = useDispatch();
  const [isAnimating, setIsAnimating] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  
  if (!user) return null;
  
  const { _id, firstName, lastName, age, gender, about, photoURL, skills } = user;

  const handleSendRequest = async (status, userId) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setSwipeDirection(status === 'interested' ? 'right' : 'left');
    
    try {
      const res = await axios.post(
        BASE_URL + "/request/send/" + status + "/" + userId,
        {},
        {
          withCredentials: true,
        }
      );
      
      setTimeout(() => {
        dispatch(removeUserFromFeed(userId));
        setIsAnimating(false);
        setSwipeDirection(null);
        if (onSwipe) onSwipe(status, userId);
      }, 600);
    } catch (err) {
      console.log("Error sending request:", err);
      setIsAnimating(false);
      setSwipeDirection(null);
    }
  };

  const handleMouseDown = (e) => {
    if (isAnimating) return;
    setIsDragging(true);
    const startX = e.clientX;
    const startY = e.clientY;

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      // Only allow horizontal movement (left to right)
      setDragOffset({ x: deltaX, y: 0 });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      
      // Only trigger swipe if moved significantly to the right (interested)
      // Or significantly to the left (not interested)
      if (dragOffset.x > 120) {
        handleSendRequest('interested', _id);
      } else if (dragOffset.x < -120) {
        handleSendRequest('ignored', _id);
      } else {
        // Reset position if not swiped enough
        setDragOffset({ x: 0, y: 0 });
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const getCardTransform = () => {
    if (isAnimating && swipeDirection) {
      const translateX = swipeDirection === 'right' ? '100vw' : '-100vw';
      return `translateX(${translateX}) rotate(${swipeDirection === 'right' ? '15deg' : '-15deg'})`;
    }
    
    if (isDragging) {
      const rotation = dragOffset.x * 0.05; // Reduced rotation for more subtle effect
      return `translateX(${dragOffset.x}px) rotate(${rotation}deg)`;
    }
    
    return 'translateX(0) rotate(0deg)';
  };

  const getCardOpacity = () => {
    if (isAnimating) return 0;
    if (isDragging) return Math.max(0.7, 1 - Math.abs(dragOffset.x) / 300);
    return 1;
  };

  return (
    <div className="flex justify-center items-center relative">
      {/* Swipe Feedback */}
      {isDragging && Math.abs(dragOffset.x) > 50 && (
        <div className={`absolute top-20 z-20 px-6 py-3 rounded-full font-bold text-2xl transform transition-all duration-200 ${
          dragOffset.x > 0 
            ? 'right-8 bg-green-500 text-white rotate-12' 
            : 'left-8 bg-red-500 text-white -rotate-12'
        }`}>
          {dragOffset.x > 0 ? 'LIKE' : 'NOPE'}
        </div>
      )}
      
      <div 
        className="w-full max-w-sm md:max-w-md lg:w-96 h-[600px] lg:h-[650px] bg-white rounded-3xl shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing select-none border border-gray-100"
        style={{
          transform: getCardTransform(),
          opacity: getCardOpacity(),
          transition: isAnimating ? 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : isDragging ? 'none' : 'all 0.3s ease-out'
        }}
        onMouseDown={handleMouseDown}
      >
        {/* Profile Image */}
        <div className="relative h-2/3">
          {photoURL ? (
            <img
              src={photoURL}
              alt={`${firstName} ${lastName}`}
              className="w-full h-full object-cover"
              draggable="false"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          
          {/* Fallback when no photo */}
          <div 
            className={`w-full h-full bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 flex flex-col items-center justify-center text-white ${photoURL ? 'hidden' : 'flex'}`}
            style={{ display: photoURL ? 'none' : 'flex' }}
          >
            <div className="w-20 h-20 md:w-24 md:h-24 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
              <svg className="w-10 h-10 md:w-12 md:h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            <p className="text-lg md:text-xl font-semibold text-center opacity-90">
              {firstName} {lastName}
            </p>
            <p className="text-sm opacity-75 mt-1">Developer Profile</p>
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          
          {/* Online Status */}
          <div className="absolute top-4 right-4">
            <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md rounded-full px-3 py-1.5 shadow-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-gray-700 text-xs font-semibold">Online</span>
            </div>
          </div>
          
          {/* User Info Overlay */}
          <div className="absolute bottom-4 left-4 md:left-6 text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-1 drop-shadow-lg">
              {firstName} {lastName}
            </h2>
            <div className="flex items-center gap-3 text-sm md:text-base opacity-90 drop-shadow-md">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {age} years
              </span>
              <span className="opacity-60">•</span>
              <span className="capitalize">{gender}</span>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="p-4 md:p-6 space-y-3 md:space-y-4 h-1/3 flex flex-col">
          {about && (
            <div className="flex-1">
              <h3 className="text-xs md:text-sm font-bold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                About Me
              </h3>
              <p className="text-gray-700 text-xs md:text-sm leading-relaxed line-clamp-3">{about}</p>
            </div>
          )}

          {/* Skills */}
          {skills && skills.length > 0 && (
            <div>
              <h3 className="text-xs md:text-sm font-bold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
                Tech Skills
              </h3>
              <div className="flex flex-wrap gap-1.5 md:gap-2">
                {skills.slice(0, 4).map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 md:px-3 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200 rounded-full text-xs font-medium hover:from-blue-100 hover:to-indigo-100 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
                {skills.length > 4 && (
                  <span className="px-2 md:px-3 py-1 bg-gray-50 text-gray-600 border border-gray-200 rounded-full text-xs font-medium">
                    +{skills.length - 4} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 md:gap-6 pt-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSendRequest("ignored", _id);
              }}
              disabled={isAnimating}
              className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white border-2 border-red-200 hover:border-red-300 hover:bg-red-50 flex items-center justify-center shadow-lg transition-all duration-300 transform hover:scale-110 disabled:opacity-50 disabled:transform-none group"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6 text-red-500 group-hover:text-red-600 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSendRequest("interested", _id);
              }}
              disabled={isAnimating}
              className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-r from-pink-500 via-red-500 to-red-600 hover:from-pink-600 hover:via-red-600 hover:to-red-700 flex items-center justify-center shadow-xl transition-all duration-300 transform hover:scale-110 disabled:opacity-50 disabled:transform-none group border-2 border-white"
            >
              <svg className="w-6 h-6 md:w-7 md:h-7 text-white group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isAnimating && (
          <div className="absolute inset-0 bg-white/90 flex items-center justify-center backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-600 font-medium">Processing...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;
