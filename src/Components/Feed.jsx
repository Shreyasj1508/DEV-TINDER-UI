import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFeed, removeUserFromFeed } from "../utils/feedSlice";
import { addConnections } from "../utils/connectionSlice";
import { addRequests } from "../utils/requestSlice";
import UserCard from "./userCard";
import { apiService } from "../utils/apiService";
import LoadingSpinner from "./LoadingSpinner";

const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed);
  const user = useSelector((store) => store.user);
  const connections = useSelector((store) => store.connections);
  const requests = useSelector((store) => store.requests);

  // Handle both direct user object and API response wrapped user object
  const userData = user?.data ? user.data : user;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationDirection, setAnimationDirection] = useState(null); // 'left', 'right', 'up'
  const [swipeStats, setSwipeStats] = useState({ likes: 0, passes: 0 });
  const [showStats, setShowStats] = useState(false);
  const [recentAction, setRecentAction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter feed to exclude users already in connections or requests
  const getFilteredFeed = () => {
    if (!feed || !Array.isArray(feed)) {
      console.log("Feed is empty or not array:", feed);
      return [];
    }

    // Get IDs of users already connected or requested
    const connectedUserIds = new Set();
    const requestedUserIds = new Set();

    // Add connection IDs
    if (connections && Array.isArray(connections)) {
      connections.forEach((connection) => {
        if (connection._id) connectedUserIds.add(connection._id);
      });
      console.log(
        "Connections:",
        connections.length,
        "IDs:",
        Array.from(connectedUserIds)
      );
    } else {
      console.log("No connections or not array:", connections);
    }

    // Add request IDs (both sent and received)
    if (requests && Array.isArray(requests)) {
      requests.forEach((request) => {
        if (request._id) requestedUserIds.add(request._id);
        // Also check for fromUserId and toUserId in case of different request structure
        if (request.fromUserId) requestedUserIds.add(request.fromUserId);
        if (request.toUserId) requestedUserIds.add(request.toUserId);
      });
      console.log(
        "Requests:",
        requests.length,
        "IDs:",
        Array.from(requestedUserIds)
      );
    } else {
      console.log("No requests or not array:", requests);
    }

    // Filter out current user, connections, and requests
    const filtered = feed.filter((feedUser) => {
      if (!feedUser._id) {
        console.log("User has no _id:", feedUser);
        return false;
      }
      if (feedUser._id === userData?._id) {
        console.log("Filtering out current user:", feedUser._id);
        return false; // Don't show current user
      }
      if (connectedUserIds.has(feedUser._id)) {
        console.log("Filtering out connected user:", feedUser._id);
        return false; // Don't show connected users
      }
      if (requestedUserIds.has(feedUser._id)) {
        console.log("Filtering out requested user:", feedUser._id);
        return false; // Don't show requested users
      }
      return true;
    });

    console.log("Filtering result:", {
      totalFeed: feed.length,
      filteredFeed: filtered.length,
      connectedCount: connectedUserIds.size,
      requestsCount: requestedUserIds.size,
    });

    return filtered;
  };

  const filteredFeed = getFilteredFeed();

  // Debug current Redux state
  console.log("Current Redux state:", {
    feed: feed?.length || 0,
    connections: connections?.length || 0,
    requests: requests?.length || 0,
    user: user?._id,
  });

  const getFeed = async (forceRefresh = false) => {
    // Check filtered feed length instead of raw feed
    const currentFilteredFeed = getFilteredFeed();

    // Only skip if we have plenty of filtered users and not forcing refresh
    if (!forceRefresh && currentFilteredFeed.length > 2) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getFeed();

      if (response.success) {
        console.log("Feed API response:", response.data);
        console.log(
          "Feed data type:",
          typeof response.data,
          "Is array:",
          Array.isArray(response.data)
        );
        dispatch(addFeed(response.data));

        // After adding new feed, check if we still need more users
        setTimeout(() => {
          const newFilteredFeed = getFilteredFeed();

          // If still low after fetch, try again (but prevent infinite loop)
          if (newFilteredFeed.length <= 1 && !forceRefresh) {
            getFeed(true);
          }
        }, 500);
      }
    } catch (err) {
      setError(err.message);
      // Fallback to mock data if API fails
      if (err.response?.status === 401) {
        // You can add mock data here if needed for development
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = (direction, userId) => {
    if (isAnimating) return;

    setIsAnimating(true);
    
    // Set animation direction based on action
    if (direction === "right") {
      setAnimationDirection('right');
      setSwipeStats((prev) => ({ ...prev, likes: prev.likes + 1 }));
      setRecentAction({ type: "like", text: "💖 Liked!" });
    } else {
      setAnimationDirection('left');
      setSwipeStats((prev) => ({ ...prev, passes: prev.passes + 1 }));
      setRecentAction({ type: "pass", text: "👋 Passed" });
    }

    // Show action feedback
    setTimeout(() => setRecentAction(null), 2000);

    setTimeout(() => {
      dispatch(removeUserFromFeed(userId));
      setIsAnimating(false);
      setAnimationDirection(null);
    }, 500); // Increased duration for smoother animation
  };

  const handleSuperLike = async (userId) => {
    if (isAnimating) return;

    try {
      setIsAnimating(true);
      setAnimationDirection('up'); // Super like animates upward
      await apiService.sendConnectionRequest("interested", userId);

      setRecentAction({ type: "superlike", text: "⭐ Super Liked!" });
      setTimeout(() => setRecentAction(null), 2000);

      setTimeout(() => {
        dispatch(removeUserFromFeed(userId));
        setIsAnimating(false);
        setAnimationDirection(null);
      }, 500);
    } catch (err) {
      console.log("Super like error:", err);
      setIsAnimating(false);
      setAnimationDirection(null);
    }
  };

  useEffect(() => {
    getFeed();

    // Also fetch connections and requests to ensure filtering works
    const fetchUserData = async () => {
      try {
        // Fetch connections
        const connectionsResponse = await apiService.getConnections();
        if (connectionsResponse.success) {
          console.log("Connections API response:", connectionsResponse.data);
          dispatch(addConnections(connectionsResponse.data || []));
        }

        // Fetch requests
        const requestsResponse = await apiService.getReceivedRequests();
        if (requestsResponse.success) {
          console.log("Requests API response:", requestsResponse.data);
          dispatch(addRequests(requestsResponse.data || []));
        }
      } catch (err) {
        // Silently handle errors for filtering data
      }
    };

    fetchUserData();
  }, []);

  // Auto-refresh feed when filtered feed gets low
  useEffect(() => {
    const currentFilteredFeed = getFilteredFeed();
    if (currentFilteredFeed.length <= 1) {
      const timer = setTimeout(() => {
        getFeed(true); // Force refresh
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [feed, connections, requests]); // Re-run when any of these change

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
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Error Loading Feed
          </h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => getFeed(true)}
            className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-semibold hover:from-pink-600 hover:to-purple-600 transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!Array.isArray(feed)) return null;

  if (filteredFeed.length <= 0)
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 flex items-center justify-center relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-pink-300 rounded-full blur-xl animate-pulse opacity-60"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-300 rounded-full blur-xl animate-bounce opacity-40"></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-blue-300 rounded-full blur-xl animate-ping opacity-30"></div>
        </div>

        <div className="text-center relative z-10">
          <div className="text-8xl mb-6 animate-bounce">💝</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            No New People to Discover
          </h1>
          <p className="text-gray-600 mb-6 max-w-md">
            {feed.length > 0
              ? "You've seen everyone available! Check back later for new profiles."
              : "Loading new profiles for you..."}
          </p>
          <div className="space-y-3">
            <button
              onClick={() => getFeed(true)}
              className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-semibold hover:from-pink-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              🔄 Refresh Feed
            </button>
          </div>
        </div>
      </div>
    );

  const currentUser = filteredFeed[0];
  if (!currentUser) return null;

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
            <div
              className={`px-6 py-3 rounded-full font-bold text-white shadow-lg ${
                recentAction.type === "like"
                  ? "bg-green-500"
                  : recentAction.type === "superlike"
                  ? "bg-blue-500"
                  : "bg-red-500"
              }`}
            >
              {recentAction.text}
            </div>
          </div>
        )}

        {/* Header with Enhanced Stats */}
        <div className="mb-4 md:mb-6 text-center">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Discover Developers
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Find your perfect coding partner
          </p>
          <div className="mt-2 md:mt-3 flex items-center justify-center gap-2 flex-wrap">
            <div className="px-3 py-1 bg-white/70 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700 shadow-sm">
              📍 {filteredFeed.length} developer
              {filteredFeed.length !== 1 ? "s" : ""} available
            </div>
            {userData?.firstName && (
              <div className="px-3 py-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full text-xs font-medium shadow-sm">
                👋 Hi {userData.firstName}!
              </div>
            )}
            <button
              onClick={() => setShowStats(!showStats)}
              className="px-3 py-1 bg-blue-500/70 backdrop-blur-sm rounded-full text-xs font-medium text-white shadow-sm hover:bg-blue-600/70 transition-all"
            >
              📊 Stats
            </button>
          </div>

          {/* Stats Panel */}
          {showStats && (
            <div className="mt-3 p-3 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/40 max-w-xs mx-auto animate-fade-in">
              <h3 className="text-base font-semibold text-gray-800 mb-2">
                Session Stats
              </h3>
              <div className="flex gap-6 justify-center">
                <div className="text-center">
                  <div className="text-xl font-bold text-pink-500">
                    {swipeStats.likes}
                  </div>
                  <div className="text-xs text-gray-600">💖 Likes</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-500">
                    {swipeStats.passes}
                  </div>
                  <div className="text-xs text-gray-600">👋 Passes</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Card Stack Container */}
        <div className="relative w-full max-w-xs md:max-w-sm lg:max-w-md px-2">
          {/* Background Cards for Stack Effect */}
          {filteredFeed.slice(1, 3).map((user, index) => (
            <div
              key={user._id}
              className="absolute top-1 left-1 right-1 md:top-2 md:left-2 md:right-2"
              style={{
                transform: `scale(${0.95 - index * 0.03}) translateY(${
                  (index + 1) * 4
                }px)`,
                zIndex: -index - 1,
                opacity: 0.6 - index * 0.2,
              }}
            >
              <div className="w-full h-[400px] md:h-[420px] lg:h-[440px] bg-white/60 backdrop-blur-sm rounded-3xl shadow-lg border border-white/40"></div>
            </div>
          ))}

          {/* Main Card */}
          <div 
            className={`relative z-10 transition-all duration-500 ease-out ${
              isAnimating && animationDirection === 'left' 
                ? 'transform -translate-x-full opacity-0 rotate-[-15deg]' 
                : isAnimating && animationDirection === 'right'
                ? 'transform translate-x-full opacity-0 rotate-[15deg]'
                : isAnimating && animationDirection === 'up'
                ? 'transform -translate-y-full opacity-0 scale-110'
                : 'transform translate-x-0 translate-y-0 opacity-100 rotate-0 scale-100'
            }`}
          >
            <UserCard user={currentUser} onSwipe={handleSwipe} onSuperLike={handleSuperLike} />
          </div>
        </div>

        {/* Floating Refresh Button */}
        <button
          onClick={() => getFeed(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 flex items-center justify-center z-20"
          title="Refresh Feed"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Feed;
