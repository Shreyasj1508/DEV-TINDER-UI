import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../utils/apiService';

const ChatDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [recentChats, setRecentChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const fetchRecentChats = async () => {
    try {
      setLoading(true);
      const response = await apiService.getRecentChats();
      if (response.success) {
        setRecentChats(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching recent chats:', error);
      setRecentChats([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchRecentChats();
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const truncateMessage = (message, maxLength = 30) => {
    if (!message) return 'No messages yet';
    return message.length > maxLength ? message.substring(0, maxLength) + '...' : message;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Chat Button - Responsive */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 px-4 py-2 lg:px-4 lg:py-2 p-3 lg:p-0 rounded-full transition-all duration-200 ${
          isOpen 
            ? 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-600 shadow-sm' 
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <span className="font-medium hidden lg:inline">Chats</span>
        
        {/* Notification badge for unread messages */}
        {recentChats.some(chat => chat.hasUnread) && (
          <span className="w-3 h-3 bg-red-500 rounded-full border-2 border-white absolute -top-1 -right-1 lg:static lg:w-2 lg:h-2 lg:ml-1 lg:border-0"></span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Messages</h3>
              <Link 
                to="/chat" 
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                onClick={() => setIsOpen(false)}
              >
                See All
              </Link>
            </div>
          </div>

          {/* Chat List */}
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-sm text-gray-500 mt-2">Loading chats...</p>
              </div>
            ) : recentChats.length === 0 ? (
              <div className="p-4 text-center">
                <svg className="w-12 h-12 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-sm text-gray-500">No recent chats</p>
                <p className="text-xs text-gray-400 mt-1">Start a conversation with your connections!</p>
              </div>
            ) : (
              recentChats.map((chat) => (
                <Link
                  key={chat._id || chat.userId}
                  to={`/chat/${chat.userId || chat._id}`}
                  onClick={() => setIsOpen(false)}
                  className="block p-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0"
                >
                  <div className="flex items-center space-x-3">
                    {/* Profile Picture */}
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-gray-200">
                        {chat.photo || chat.photoURL ? (
                          <img
                            src={chat.photo || chat.photoURL}
                            alt={chat.firstName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div 
                          className={`w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center ${(chat.photo || chat.photoURL) ? 'hidden' : 'flex'}`}
                          style={{ display: (chat.photo || chat.photoURL) ? 'none' : 'flex' }}
                        >
                          <span className="text-white font-medium text-sm">
                            {(chat.firstName || 'U').charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      
                      {/* Online status indicator */}
                      {chat.isOnline && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>

                    {/* Chat Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {chat.firstName} {chat.lastName}
                        </p>
                        <span className="text-xs text-gray-500">
                          {formatTime(chat.lastMessageTime)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className={`text-sm truncate ${chat.hasUnread ? 'font-medium text-gray-900' : 'text-gray-500'}`}>
                          {chat.isTyping ? (
                            <span className="text-blue-600 italic">Typing...</span>
                          ) : (
                            truncateMessage(chat.lastMessage)
                          )}
                        </p>
                        {chat.hasUnread && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full ml-2"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

          {/* Footer */}
          {recentChats.length > 0 && (
            <div className="p-3 border-t border-gray-100 bg-gray-50">
              <Link
                to="/chat"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center py-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                View All Messages
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatDropdown;
