import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ChatList = () => {
  const navigate = useNavigate();
  const connections = useSelector((store) => store.connections);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredConnections, setFilteredConnections] = useState([]);

  useEffect(() => {
    if (connections) {
      const filtered = connections.filter(conn => {
        const user = conn.user || conn;
        const fullName = `${user.firstName} ${user.lastName || ''}`.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase());
      });
      setFilteredConnections(filtered);
    }
  }, [connections, searchTerm]);

  const handleChatClick = (userId) => {
    navigate(`/chat/${userId}`);
  };

  if (!connections || connections.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden p-8 text-center">
            <div className="text-6xl mb-4">💬</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No Connections Yet</h2>
            <p className="text-gray-600 mb-6">
              Connect with other developers to start chatting!
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
              Chats ({filteredConnections.length})
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
                placeholder="Search connections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-200 outline-none bg-gray-50"
              />
            </div>
          </div>

          {/* Connections List */}
          <div className="max-h-[60vh] overflow-y-auto">
            {filteredConnections.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <div className="text-4xl mb-4">🔍</div>
                <p>No connections found</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredConnections.map((conn, index) => {
                  const user = conn.user || conn;
                  return (
                    <div
                      key={user._id || index}
                      onClick={() => handleChatClick(user._id)}
                      className="p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <img
                            src={user.photoURL || "https://via.placeholder.com/50x50?text=User"}
                            alt={user.firstName}
                            className="w-12 h-12 rounded-full border-2 border-gray-200"
                          />
                          {/* Online indicator - you can add logic to show online status */}
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                              {user.firstName} {user.lastName || ''}
                            </h3>
                            <span className="text-xs text-gray-500">2h</span>
                          </div>
                          
                          <p className="text-sm text-gray-500 truncate">
                            {user.about || 'Start a conversation...'}
                          </p>
                          
                          {user.skills && user.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {user.skills.slice(0, 3).map((skill, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded-full"
                                >
                                  {skill}
                                </span>
                              ))}
                              {user.skills.length > 3 && (
                                <span className="text-xs text-gray-400">
                                  +{user.skills.length - 3} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatList;
