import React, { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { apiService } from '../utils/apiService';
import { useSocket } from '../utils/socket';

const ChatList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [recentChats, setRecentChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const socket = useSocket();

  useEffect(() => {
    const fetchRecentChats = async () => {
      setLoading(true);
      try {
        const res = await apiService.getRecentChats();
        setRecentChats(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        setRecentChats([]);
      }
      setLoading(false);
    };
    fetchRecentChats();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('messageReceived', (newMessage) => {
        setRecentChats((prevChats) => {
          const updatedChats = prevChats.map((chat) => {
            if (chat.userId === newMessage.senderId) {
              return {
                ...chat,
                lastMessage: newMessage.text,
                lastMessageTime: newMessage.timestamp,
                hasUnread: true,
              };
            }
            return chat;
          });

          // Add new chat if not already in the list
          const existingChat = updatedChats.find((chat) => chat.userId === newMessage.senderId);
          if (!existingChat) {
            updatedChats.unshift({
              userId: newMessage.senderId,
              firstName: newMessage.senderName,
              lastMessage: newMessage.text,
              lastMessageTime: newMessage.timestamp,
              hasUnread: true,
            });
          }

          return updatedChats.sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));
        });
      });
    }

    return () => {
      if (socket) {
        socket.off('messageReceived');
      }
    };
  }, [socket]);

  // Sort: unread chats first, then by most recent message
  const sortedChats = [...recentChats].sort((a, b) => {
    if ((b.hasUnread ? 1 : 0) !== (a.hasUnread ? 1 : 0)) {
      return (b.hasUnread ? 1 : 0) - (a.hasUnread ? 1 : 0);
    }
    return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
  });

  const filteredChats = sortedChats.filter(chat => {
    const fullName = `${chat.firstName} ${chat.lastName || ''}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  const handleChatClick = (userId) => {
    navigate(`/chat/${userId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 py-8">
        <div className="max-w-4xl mx-auto flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading chats...</p>
          </div>
        </div>
      </div>
    );
  }
  if (!recentChats || recentChats.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden p-8 text-center">
            <div className="text-6xl mb-4">💬</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No Chats Yet</h2>
            <p className="text-gray-600 mb-6">
              Start a conversation to see your chats here!
            </p>
            <button 
              onClick={() => navigate('/feed')}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105"
            >
              Find Developers
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-6">
            <h1 className="text-2xl font-bold text-white flex items-center">
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Chats ({filteredChats.length})
            </h1>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search chats..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-200 outline-none bg-gray-50"
              />
            </div>
          </div>

          {/* Recent Chats List */}
          <div className="max-h-[60vh] overflow-y-auto">
            {filteredChats.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <div className="text-4xl mb-4">🔍</div>
                <p>No chats found</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredChats.map((chat, index) => (
                  <div
                    key={chat.userId || index}
                    onClick={() => handleChatClick(chat.userId)}
                    className="p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <img
                          src={chat.photoURL || "https://via.placeholder.com/50x50?text=User"}
                          alt={chat.firstName}
                          className="w-12 h-12 rounded-full border-2 border-gray-200"
                        />
                        {chat.unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full px-2 py-0.5 font-bold">
                            {chat.unreadCount}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {chat.firstName} {chat.lastName || ''}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {chat.lastMessageTime ? new Date(chat.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 truncate">
                          {chat.lastMessage || 'Start a conversation...'}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


export default ChatList;
