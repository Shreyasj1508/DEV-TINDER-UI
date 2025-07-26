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
  const [recentAction, setRecentAction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewedUsers, setViewedUsers] = useState(() => {
    // Load viewed users from localStorage on component mount
    const saved = localStorage.getItem("devTinder_viewedUsers");
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [hasCompletedAllUsers, setHasCompletedAllUsers] = useState(false);
  const [lastFetchAttempt, setLastFetchAttempt] = useState(0);

  // Filter feed to exclude users already in connections, requests, or viewed
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

    // Filter out current user, connections, requests, and viewed users
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
      if (viewedUsers.has(feedUser._id)) {
        console.log("Filtering out previously viewed user:", feedUser._id);
        return false; // Don't show users we've already seen
      }
      return true;
    });

    console.log("Filtering result:", {
      totalFeed: feed.length,
      filteredFeed: filtered.length,
      connectedCount: connectedUserIds.size,
      requestsCount: requestedUserIds.size,
      viewedCount: viewedUsers.size,
    });

    return filtered;
  };

  const filteredFeed = getFilteredFeed();

  // Function to clear viewed users history (useful for testing or reset)
  const clearViewedHistory = () => {
    setViewedUsers(new Set());
    setHasCompletedAllUsers(false); // Reset completion status
    setLastFetchAttempt(0); // Reset fetch throttle
    localStorage.removeItem("devTinder_viewedUsers");
    console.log("Viewed users history cleared");
    // Refresh feed after clearing
    getFeed(true);
  };

  // Debug current Redux state
  console.log("Current Redux state:", {
    feed: feed?.length || 0,
    connections: connections?.length || 0,
    requests: requests?.length || 0,
    user: user?._id,
    viewedUsers: viewedUsers.size,
    hasCompletedAllUsers,
    filteredFeedLength: filteredFeed.length,
  });

  const getFeed = async (forceRefresh = false) => {
    // Check filtered feed length instead of raw feed
    const currentFilteredFeed = getFilteredFeed();

    // If we've already completed all users and it's not a manual refresh, don't fetch
    if (hasCompletedAllUsers && !forceRefresh) {
      console.log("All users completed, skipping auto-refresh");
      setLoading(false);
      return;
    }

    // Prevent too frequent fetching (minimum 5 seconds between attempts)
    const now = Date.now();
    if (!forceRefresh && now - lastFetchAttempt < 5000) {
      console.log("Too soon for another fetch attempt");
      setLoading(false);
      return;
    }

    // Only skip if we have plenty of filtered users and not forcing refresh
    if (!forceRefresh && currentFilteredFeed.length > 2) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setLastFetchAttempt(now);

      const response = await apiService.getFeed();

      if (response.success) {
        console.log("Feed API response:", response.data);
        console.log(
          "Feed data type:",
          typeof response.data,
          "Is array:",
          Array.isArray(response.data)
        );

        const newUsers = response.data || [];
        dispatch(addFeed(newUsers));

        // After adding new feed, check if we have any new users after filtering
        setTimeout(() => {
          const newFilteredFeed = getFilteredFeed();

          // If we still have very few users after fetch, mark as completed
          if (newFilteredFeed.length <= 1) {
            // Check if we got any truly new users from the API
            const hasNewUsers = newUsers.some(
              (user) => !viewedUsers.has(user._id) && user._id !== userData?._id
            );

            if (!hasNewUsers || newUsers.length === 0) {
              console.log("No new users available, marking as completed");
              setHasCompletedAllUsers(true);
              return;
            }

            // If we got new users but they're filtered out, try once more
            if (!forceRefresh) {
              console.log(
                "Got new users but they're filtered, trying once more"
              );
              getFeed(true);
            }
          } else {
            // We have users, reset the completion flag
            setHasCompletedAllUsers(false);
          }
        }, 500);
      }
    } catch (err) {
      setError(err.message);
      // Don't mark as completed on error - might be temporary
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

    // Mark user as viewed and save to localStorage
    const updatedViewedUsers = new Set(viewedUsers);
    updatedViewedUsers.add(userId);
    setViewedUsers(updatedViewedUsers);

    // Save to localStorage for persistence
    localStorage.setItem(
      "devTinder_viewedUsers",
      JSON.stringify(Array.from(updatedViewedUsers))
    );

    // Set animation direction based on action
    if (direction === "right") {
      setAnimationDirection("right");
      setRecentAction({ type: "like", text: "💖 Liked!" });
    } else {
      setAnimationDirection("left");
      setRecentAction({ type: "pass", text: "👋 Passed" });
    }

    // Show action feedback
    setTimeout(() => setRecentAction(null), 2000);

    setTimeout(() => {
      dispatch(removeUserFromFeed(userId));
      setIsAnimating(false);
      setAnimationDirection(null);
    }, 500);
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

  // Auto-refresh feed when filtered feed gets low (but not if completed)
  useEffect(() => {
    // Don't auto-refresh if we've completed all users
    if (hasCompletedAllUsers) {
      console.log("Skipping auto-refresh - all users completed");
      return;
    }

    const currentFilteredFeed = getFilteredFeed();
    if (currentFilteredFeed.length <= 1) {
      const timer = setTimeout(() => {
        getFeed(false); // Don't force refresh in auto-refresh
      }, 2000); // Increased delay to reduce frequency
      return () => clearTimeout(timer);
    }
  }, [feed, connections, requests, viewedUsers, hasCompletedAllUsers]); // Re-run when any of these change

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 flex items-center justify-center relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-pink-300/40 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-300/40 rounded-full blur-2xl animate-bounce"></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-blue-300/40 rounded-full blur-2xl animate-ping"></div>
          <div className="absolute bottom-1/3 right-1/4 w-28 h-28 bg-indigo-300/40 rounded-full blur-2xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 text-center">
          <div className="relative">
            <LoadingSpinner />
            <div className="mt-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Finding Amazing Developers
              </h2>
              <p className="text-gray-600 animate-pulse">
                Preparing your personalized feed...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 flex items-center justify-center relative overflow-hidden">
        {/* Error background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-red-300/30 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-orange-300/30 rounded-full blur-xl animate-bounce"></div>
        </div>

        <div className="text-center relative z-10 bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 max-w-md mx-4">
          <div className="text-6xl mb-4 animate-bounce">⚠️</div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-2">
            Oops! Something went wrong
          </h1>
          <p className="text-gray-600 mb-6 leading-relaxed">{error}</p>
          <button
            onClick={() => getFeed(true)}
            className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-semibold hover:from-pink-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            🔄 Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!Array.isArray(feed)) return null;

  if (filteredFeed.length <= 0)
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 flex items-center justify-center relative overflow-hidden">
        {/* Enhanced Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-pink-300/30 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-300/30 rounded-full blur-2xl animate-bounce"></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-blue-300/30 rounded-full blur-2xl animate-ping"></div>
          <div className="absolute bottom-1/3 right-1/3 w-28 h-28 bg-indigo-300/30 rounded-full blur-2xl animate-pulse delay-500"></div>
          <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-yellow-300/30 rounded-full blur-2xl animate-bounce delay-1000"></div>
        </div>

        <div className="text-center relative z-10 bg-white/80 backdrop-blur-lg rounded-3xl p-12 shadow-2xl border border-white/20 max-w-lg mx-4">
          <div className="text-8xl mb-6 animate-bounce">💝</div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
            All Caught Up!
          </h1>
          <p className="text-gray-600 mb-8 max-w-md leading-relaxed text-lg">
            {hasCompletedAllUsers
              ? "You've seen everyone available! Check back later for new developers or reset your viewing history to see profiles again."
              : feed.length > 0
              ? "You've discovered everyone available! New developers join daily, so check back soon for fresh profiles."
              : "We're preparing an amazing selection of developers for you..."}
          </p>
          <div className="space-y-4">
            <button
              onClick={() => getFeed(true)}
              className="px-10 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-bold hover:from-pink-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg"
            >
              🔄 Check for New People
            </button>
            {viewedUsers.size > 0 && (
              <button
                onClick={clearViewedHistory}
                className="px-8 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-full font-semibold hover:from-gray-600 hover:to-gray-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                🗑️ Reset Viewed History ({viewedUsers.size} users)
              </button>
            )}
            <div className="flex justify-center gap-4 pt-4">
              <div className="px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700 shadow-sm">
                💡 Tip: Update your profile to attract more connections
              </div>
            </div>
          </div>
        </div>
      </div>
    );

  const currentUser = filteredFeed[0];
  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 relative overflow-hidden">
      {/* Enhanced Background Pattern with More Elements */}
      <div className="absolute inset-0 opacity-20 md:opacity-30">
        <div className="absolute top-20 left-10 md:left-20 w-24 h-24 md:w-32 md:h-32 bg-pink-300 rounded-full blur-xl animate-blob"></div>
        <div className="absolute top-40 right-10 md:right-20 w-20 h-20 md:w-28 md:h-28 bg-purple-300 rounded-full blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-40 left-1/4 w-16 h-16 md:w-24 md:h-24 bg-blue-300 rounded-full blur-xl animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-32 right-1/3 w-20 h-20 md:w-28 md:h-28 bg-indigo-300 rounded-full blur-xl animate-blob"></div>
        <div className="absolute top-1/2 left-1/2 w-12 h-12 md:w-16 md:h-16 bg-yellow-300 rounded-full blur-xl animate-blob animation-delay-1000"></div>
        <div className="absolute top-1/3 right-1/2 w-14 h-14 md:w-20 md:h-20 bg-green-300 rounded-full blur-xl animate-blob animation-delay-3000"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen py-4 md:py-8 px-4">
        {/* Enhanced Action Feedback Overlay with improved animations */}
        {recentAction && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-[bounce_0.8s_ease-in-out]">
            <div
              className={`px-8 py-4 rounded-2xl font-bold text-white shadow-2xl backdrop-blur-sm border border-white/20 transform transition-all duration-500 scale-110 ${
                recentAction.type === "like"
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 animate-pulse"
                  : recentAction.type === "superlike"
                  ? "bg-gradient-to-r from-blue-500 to-cyan-500 animate-pulse"
                  : "bg-gradient-to-r from-red-500 to-pink-500 animate-pulse"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-3xl animate-[wiggle_0.5s_ease-in-out_infinite]">
                  {recentAction.type === "like"
                    ? "💖"
                    : recentAction.type === "superlike"
                    ? "⭐"
                    : "👋"}
                </span>
                <span className="text-lg animate-[fadeInUp_0.3s_ease-out]">
                  {recentAction.text}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Header Section with floating animations */}
        <div className="mb-6 md:mb-8 text-center animate-[fadeInDown_0.8s_ease-out]">
          <div className="mb-4">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-white/20 mb-4 hover:scale-105 transition-all duration-300 animate-[floatSlow_3s_ease-in-out_infinite]">
              <span className="text-2xl animate-[sparkle_2s_ease-in-out_infinite]">
                ✨
              </span>
              <span className="text-lg font-semibold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Dev Discovery
              </span>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3 leading-tight animate-[slideInLeft_0.6s_ease-out]">
            Find Your Coding Soulmate
          </h1>
          <p className="text-gray-600 text-base md:text-lg max-w-md mx-auto leading-relaxed animate-[fadeIn_1s_ease-out_0.3s_both]">
            Swipe through amazing developers and build your dream network
          </p>

          {/* Enhanced Stats and User Info with staggered animations */}
          <div className="mt-4 md:mt-6 flex items-center justify-center gap-3 flex-wrap">
            <div className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700 shadow-md border border-white/20 hover:scale-105 transition-all duration-300 animate-[slideInUp_0.6s_ease-out_0.2s_both] hover:shadow-lg">
              <span className="text-base mr-1 animate-[bounce_1s_ease-in-out_infinite]">
                🎯
              </span>
              {filteredFeed.length} developer
              {filteredFeed.length !== 1 ? "s" : ""} nearby
            </div>
            {userData?.firstName && (
              <div className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full text-sm font-semibold shadow-md hover:scale-105 transition-all duration-300 animate-[slideInUp_0.6s_ease-out_0.4s_both] hover:shadow-xl">
                <span className="text-base mr-1 animate-[wave_1s_ease-in-out_infinite]">
                  👋
                </span>
                Welcome back, {userData.firstName}!
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Card Stack Container with improved animations */}
        <div className="relative w-full max-w-xs md:max-w-sm lg:max-w-md px-2 animate-[zoomIn_0.8s_ease-out_0.5s_both]">
          {/* Enhanced Background Cards for Stack Effect with floating animations */}
          {filteredFeed.slice(1, 3).map((user, index) => (
            <div
              key={user._id}
              className="absolute top-1 left-1 right-1 md:top-2 md:left-2 md:right-2 animate-[floatSlow_4s_ease-in-out_infinite]"
              style={{
                transform: `scale(${0.95 - index * 0.03}) translateY(${
                  (index + 1) * 6
                }px) rotate(${index % 2 === 0 ? 1 : -1}deg)`,
                zIndex: -index - 1,
                opacity: 0.7 - index * 0.2,
                animationDelay: `${index * 0.5}s`,
              }}
            >
              <div className="w-full h-[420px] md:h-[440px] lg:h-[460px] bg-gradient-to-br from-white/70 to-white/50 backdrop-blur-sm rounded-3xl shadow-xl border border-white/40 relative overflow-hidden transition-all duration-500 hover:shadow-2xl">
                {/* Decorative gradient overlay with animation */}
                <div className="absolute inset-0 bg-gradient-to-br from-pink-100/30 via-purple-100/20 to-indigo-100/30 animate-[shimmer_3s_ease-in-out_infinite]"></div>
                {/* Subtle pattern with floating animation */}
                <div className="absolute top-4 right-4 w-4 h-4 bg-purple-300/30 rounded-full animate-[float_2s_ease-in-out_infinite]"></div>
                <div className="absolute bottom-6 left-6 w-3 h-3 bg-pink-300/30 rounded-full animate-[float_2s_ease-in-out_infinite_0.5s]"></div>
                {/* Additional animated elements */}
                <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-blue-300/30 rounded-full animate-[twinkle_1.5s_ease-in-out_infinite]"></div>
                <div className="absolute bottom-1/3 right-1/3 w-2 h-2 bg-yellow-300/30 rounded-full animate-[twinkle_1.5s_ease-in-out_infinite_0.7s]"></div>
              </div>
            </div>
          ))}

          {/* Enhanced Main Card with Better Animation and hover effects */}
          <div
            className={`relative z-10 transition-all duration-300 ease-out hover:scale-[0.98] ${
              isAnimating && animationDirection === "left"
                ? "transform -translate-x-full opacity-0 rotate-[-20deg] scale-90 animate-[slideOutLeft_0.5s_ease-in]"
                : isAnimating && animationDirection === "right"
                ? "transform translate-x-full opacity-0 rotate-[20deg] scale-90 animate-[slideOutRight_0.5s_ease-in]"
                : isAnimating && animationDirection === "up"
                ? "transform -translate-y-full opacity-0 scale-110 rotate-12 animate-[slideOutUp_0.5s_ease-in]"
                : "transform translate-x-0 translate-y-0 opacity-100 rotate-0 scale-100 animate-[cardEntrance_0.6s_ease-out]"
            }`}
          >
            <div className="drop-shadow-2xl hover:drop-shadow-xl transition-all duration-300 relative group">
              <UserCard user={currentUser} onSwipe={handleSwipe} />
            </div>
          </div>
        </div>

        {/* Enhanced Floating Refresh Button with advanced animations */}
        <button
          onClick={() => getFeed(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center z-20 group animate-[floatSlow_3s_ease-in-out_infinite] hover:animate-[spin_2s_linear_infinite]"
          title="Discover More People"
        >
          <svg
            className="w-7 h-7 group-hover:rotate-180 transition-transform duration-500 animate-[pulse_2s_ease-in-out_infinite]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          {/* Enhanced pulsing ring effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite] opacity-20"></div>
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite] opacity-10 animation-delay-300"></div>
        </button>

        {/* Enhanced Progress Indicator with animations */}
        <div className="fixed bottom-6 left-6 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-white/20 z-20 animate-[slideInLeft_0.6s_ease-out] hover:scale-105 transition-all duration-300">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-[heartbeat_1.5s_ease-in-out_infinite]"></div>
            <span className="text-sm font-medium text-gray-700 animate-[fadeIn_0.5s_ease-out]">
              {filteredFeed.length} remaining
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Feed;
