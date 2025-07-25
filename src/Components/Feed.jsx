import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFeed, removeUserFromFeed } from "../utils/feedSlice";
import UserCard from "./userCard";
import { apiService } from "../utils/apiService";
import LoadingSpinner from "./LoadingSpinner";

const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed);
  const user = useSelector((store) => store.user);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [swipeStats, setSwipeStats] = useState({ likes: 0, passes: 0 });
  const [showStats, setShowStats] = useState(false);
  const [recentAction, setRecentAction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getFeed = async () => {
    if (feed && feed.length > 0) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching feed...");
      const response = await apiService.getFeed();
      
      if (response.success) {
        console.log("Feed response:", response.data);
        dispatch(addFeed(response.data));
      }
    } catch (err) {
      console.log("Error fetching feed:", err);
      setError(err.message);
      // Fallback to mock data if API fails
      if (err.response?.status === 401) {
        console.log("Using fallback mock data");
        // You can add mock data here if needed for development
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = (direction, userId) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    // Update stats and show recent action
    if (direction === 'right') {
      setSwipeStats(prev => ({ ...prev, likes: prev.likes + 1 }));
      setRecentAction({ type: 'like', text: '💖 Liked!' });
    } else {
      setSwipeStats(prev => ({ ...prev, passes: prev.passes + 1 }));
      setRecentAction({ type: 'pass', text: '👋 Passed' });
    }
    
    // Show action feedback
    setTimeout(() => setRecentAction(null), 2000);
    
    setTimeout(() => {
      dispatch(removeUserFromFeed(userId));
      setIsAnimating(false);
    }, 300);
  };

  const handleSuperLike = async (userId) => {
    if (isAnimating) return;
    
    try {
      setIsAnimating(true);
      await apiService.sendConnectionRequest("interested", userId);
      
      setRecentAction({ type: 'superlike', text: '⭐ Super Liked!' });
      setTimeout(() => setRecentAction(null), 2000);
      
      setTimeout(() => {
        dispatch(removeUserFromFeed(userId));
        setIsAnimating(false);
      }, 300);
    } catch (err) {
      console.log("Super like error:", err);
      setIsAnimating(false);
    }
  };

  useEffect(() => {
    console.log("Feed component mounted, current feed:", feed);
    getFeed();
  }, []);

  // Auto-refresh feed when empty
  useEffect(() => {
    if (feed && feed.length === 0) {
      const timer = setTimeout(() => {
        getFeed();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [feed]);

  console.log("Feed state:", feed, "Is array:", Array.isArray(feed), "Length:", feed?.length);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Feed</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={getFeed}
            className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-semibold hover:from-pink-600 hover:to-purple-600 transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!Array.isArray(feed)) return null;

  if (feed.length <= 0)
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 flex items-center justify-center relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-pink-300 rounded-full blur-xl animate-pulse opacity-60"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-300 rounded-full blur-xl animate-bounce opacity-40"></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-blue-300 rounded-full blur-xl animate-ping opacity-30"></div>
        </div>
        
        <div className="text-center relative z-10">
          <div className="text-8xl mb-6 animate-bounce">💔</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4 animate-fade-in">No more matches!</h1>
          <p className="text-xl text-gray-600 mb-8 animate-fade-in-delay">Check back later for new developers</p>
          
          {/* Loading Animation */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
          
          <button 
            onClick={getFeed}
            className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-semibold hover:from-pink-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            🔄 Refresh Feed
          </button>
          
          {/* Fun Stats */}
          {(swipeStats.likes > 0 || swipeStats.passes > 0) && (
            <div className="mt-8 p-4 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/40">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Your Session Stats</h3>
              <div className="flex gap-6 justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-500">{swipeStats.likes}</div>
                  <div className="text-sm text-gray-600">Likes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-500">{swipeStats.passes}</div>
                  <div className="text-sm text-gray-600">Passes</div>
                </div>
              </div>
            </div>
          )}
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
        {/* Action Feedback Overlay */}
        {recentAction && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
            <div className={`px-6 py-3 rounded-full font-bold text-white shadow-lg ${
              recentAction.type === 'like' ? 'bg-green-500' : 
              recentAction.type === 'superlike' ? 'bg-blue-500' : 'bg-red-500'
            }`}>
              {recentAction.text}
            </div>
          </div>
        )}

        {/* Header with Enhanced Stats */}
        <div className="mb-6 md:mb-8 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Discover Developers
          </h1>
          <p className="text-gray-600 text-base md:text-lg">Find your perfect coding partner</p>
          <div className="mt-3 md:mt-4 flex items-center justify-center gap-2 flex-wrap">
            <div className="px-3 md:px-4 py-1.5 md:py-2 bg-white/70 backdrop-blur-sm rounded-full text-xs md:text-sm font-medium text-gray-700 shadow-sm">
              📍 {feed.length} developer{feed.length !== 1 ? 's' : ''} remaining
            </div>
            {user?.firstName && (
              <div className="px-3 md:px-4 py-1.5 md:py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full text-xs md:text-sm font-medium shadow-sm">
                👋 Hi {user.firstName}!
              </div>
            )}
            <button
              onClick={() => setShowStats(!showStats)}
              className="px-3 md:px-4 py-1.5 md:py-2 bg-blue-500/70 backdrop-blur-sm rounded-full text-xs md:text-sm font-medium text-white shadow-sm hover:bg-blue-600/70 transition-all"
            >
              📊 Stats
            </button>
          </div>
          
          {/* Stats Panel */}
          {showStats && (
            <div className="mt-4 p-4 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/40 max-w-sm mx-auto animate-fade-in">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Session Stats</h3>
              <div className="flex gap-6 justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-500">{swipeStats.likes}</div>
                  <div className="text-sm text-gray-600">💖 Likes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-500">{swipeStats.passes}</div>
                  <div className="text-sm text-gray-600">👋 Passes</div>
                </div>
              </div>
            </div>
          )}
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
            <UserCard user={currentUser} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;
