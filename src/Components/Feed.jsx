import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed, removeUserFromFeed } from "../utils/feedSlice";
import UserCard from "./userCard";

const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const getFeed = async () => {
    if (feed && feed.length > 0) return;
    
    try {
      console.log("Fetching feed...");
      const response = await axios.get(BASE_URL + "/user/feed", {
        withCredentials: true,
      });
      console.log("Feed response:", response.data);
      dispatch(addFeed(response.data.data));
    } catch (err) {
      console.log("Error fetching feed:", err);
    }
  };

  const handleSwipe = (direction, userId) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    setTimeout(() => {
      dispatch(removeUserFromFeed(userId));
      setIsAnimating(false);
    }, 300);
  };

  useEffect(() => {
    console.log("Feed component mounted, current feed:", feed);
    getFeed();
  }, []);

  console.log("Feed state:", feed, "Is array:", Array.isArray(feed), "Length:", feed?.length);

  if (!Array.isArray(feed)) return null;

  if (feed.length <= 0)
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-6">💔</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">No more matches!</h1>
          <p className="text-xl text-gray-600 mb-8">Check back later for new developers</p>
          <button 
            onClick={getFeed}
            className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-semibold hover:from-pink-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105"
          >
            Refresh Feed
          </button>
        </div>
      </div>
    );

  const currentUser = feed[0]; // Always show the first user in the array

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20 md:opacity-30">
        <div className="absolute top-20 left-10 md:left-20 w-24 h-24 md:w-32 md:h-32 bg-pink-300 rounded-full blur-xl animate-blob"></div>
        <div className="absolute top-40 right-10 md:right-20 w-20 h-20 md:w-28 md:h-28 bg-purple-300 rounded-full blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-40 left-1/4 w-16 h-16 md:w-24 md:h-24 bg-blue-300 rounded-full blur-xl animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-32 right-1/3 w-20 h-20 md:w-28 md:h-28 bg-indigo-300 rounded-full blur-xl animate-blob"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen py-4 md:py-8 px-4">
        {/* Header */}
        <div className="mb-6 md:mb-8 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Discover Developers
          </h1>
          <p className="text-gray-600 text-base md:text-lg">Find your perfect coding partner</p>
          <div className="mt-3 md:mt-4 flex items-center justify-center gap-2">
            <div className="px-3 md:px-4 py-1.5 md:py-2 bg-white/70 backdrop-blur-sm rounded-full text-xs md:text-sm font-medium text-gray-700 shadow-sm">
              📍 {feed.length} developer{feed.length !== 1 ? 's' : ''} remaining
            </div>
          </div>
        </div>

        {/* Card Stack Container */}
        <div className="relative w-full max-w-sm md:max-w-md lg:max-w-lg px-2">
          {/* Background Cards for Stack Effect */}
          {feed.slice(1, 3).map((user, index) => (
            <div
              key={user._id}
              className="absolute top-1 left-1 right-1 md:top-2 md:left-2 md:right-2"
              style={{
                transform: `scale(${0.95 - index * 0.03}) translateY(${(index + 1) * 6}px)`,
                zIndex: -index - 1,
                opacity: 0.6 - index * 0.2
              }}
            >
              <div className="w-full h-[600px] lg:h-[650px] bg-white/60 backdrop-blur-sm rounded-3xl shadow-lg border border-white/40"></div>
            </div>
          ))}

          {/* Main Card */}
          <div className="relative z-10">
            <UserCard 
              user={currentUser} 
              onSwipe={handleSwipe}
              isAnimating={isAnimating}
            />
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 md:mt-8 text-center">
          <p className="text-gray-600 text-xs md:text-sm mb-3 md:mb-4">Swipe right to connect, left to pass</p>
          <div className="flex items-center justify-center gap-6 md:gap-8">
            <div className="flex items-center gap-2 text-red-500">
              <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-red-100 flex items-center justify-center border border-red-200">
                <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-xs md:text-sm font-medium">Pass</span>
            </div>
            <div className="flex items-center gap-2 text-pink-500">
              <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-pink-100 flex items-center justify-center border border-pink-200">
                <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-xs md:text-sm font-medium">Connect</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;
