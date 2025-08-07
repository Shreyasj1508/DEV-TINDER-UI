import { useEffect, useState, useRef } from "react"; 
import { useParams, useNavigate } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import VideoCall from "./VideoCall";

const Chat = () => {
  const { targetUserId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [targetUser, setTargetUser] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [videoCallInitiator, setVideoCallInitiator] = useState(false);
  
  const user = useSelector((store) => store.user);
  const connections = useSelector((store) => store.connections);
  
  // Handle both direct user object and API response wrapped user object
  const userData = user?.data ? user.data : user;
  const userId = userData?._id;

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Check if target user is in connections
  const checkConnection = () => {
    if (!connections || !targetUserId) {
      setIsConnected(false);
      return;
    }
    
    const isInConnections = connections.some(conn => 
      conn._id === targetUserId || conn.user?._id === targetUserId
    );
    setIsConnected(isInConnections);
    
    if (!isInConnections) {
      setIsLoading(false);
      return;
    }
    
    // Find target user details from connections
    const targetConnection = connections.find(conn => 
      conn._id === targetUserId || conn.user?._id === targetUserId
    );
    
    if (targetConnection) {
      setTargetUser(targetConnection.user || targetConnection);
    }
  };

  const fetchChatMessages = async () => {
    if (!isConnected) return;
    
    try {
      const chat = await axios.get(BASE_URL + "/chat/" + targetUserId, {
        withCredentials: true,
      });

      const chatMessages = chat?.data?.data?.messages?.map((msg) => {
        const { senderId, text, createdAt } = msg;
        return {
          _id: msg._id,
          senderId: senderId?._id,
          senderName: `${senderId?.firstName} ${senderId?.lastName || ''}`.trim(),
          text,
          createdAt: new Date(createdAt),
        };
      });
      
      setMessages(chatMessages || []);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    checkConnection();
  }, [connections, targetUserId]);

  useEffect(() => {
    if (isConnected) {
      fetchChatMessages();
    }
  }, [isConnected, targetUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!userId || !isConnected) {
      return;
    }
    
    const socketConnection = createSocketConnection();
    setSocket(socketConnection);
    
    // Join chat room
    socketConnection.emit("joinChat", {
      firstName: userData.firstName,
      userId,
      targetUserId,
    });

    // Listen for various socket events
    socketConnection.on("messageReceived", ({ senderId, senderName, text, messageId, createdAt }) => {
      console.log('Received message from socket:', { senderId, senderName, text, messageId, createdAt });
      const newMsg = {
        messageId,
        senderId,
        senderName,
        text,
        createdAt: new Date(createdAt),
      };
      setMessages((prevMessages) => {
        // Avoid duplicate messages
        const exists = prevMessages.some(msg => msg.messageId === messageId);
        if (exists) return prevMessages;
        return [...prevMessages, newMsg];
      });
    });

    socketConnection.on("userOnline", ({ userId: onlineUserId }) => {
      setOnlineUsers(prev => new Set([...prev, onlineUserId]));
    });

    socketConnection.on("userOffline", ({ userId: offlineUserId }) => {
      setOnlineUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(offlineUserId);
        return newSet;
      });
    });

    socketConnection.on("userTyping", ({ userId: typingUserId }) => {
      if (typingUserId === targetUserId) {
        setIsTyping(true);
        
        // Clear existing timeout
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        
        // Set typing to false after 3 seconds
        typingTimeoutRef.current = setTimeout(() => {
          setIsTyping(false);
        }, 3000);
      }
    });

    socketConnection.on("userStoppedTyping", ({ userId: stoppedTypingUserId }) => {
      if (stoppedTypingUserId === targetUserId) {
        setIsTyping(false);
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
      }
    });

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      socketConnection.disconnect();
      setSocket(null);
    };
  }, [userId, targetUserId, userData?.firstName, isConnected]);

  const sendMessage = () => {
    if (!socket || !newMessage.trim() || !isConnected) return;

    // Send message with backend-compatible keys
    socket.emit("sendMessage", {
      userId,
      targetUserId,
      text: newMessage.trim(),
      firstName: userData.firstName,
      lastName: userData.lastName || ""
    });

    setNewMessage("");
  };

  const handleTyping = () => {
    if (socket && isConnected) {
      socket.emit("typing", { userId, targetUserId });
    }
  };

  const handleStopTyping = () => {
    if (socket && isConnected) {
      socket.emit("stopTyping", { userId, targetUserId });
    }
  };

  const formatMessageTime = (createdAt) => {
    const now = new Date();
    const messageDate = new Date(createdAt);
    const diffInHours = (now - messageDate) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return messageDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } else {
      return messageDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    }
  };

  // Show error if not connected
  if (!isConnected && !isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden p-8 text-center">
            <div className="text-6xl mb-4">🚫</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
            <p className="text-gray-600 mb-6">
              You can only chat with your connections. Please connect with this user first.
            </p>
            <button 
              onClick={() => navigate('/connections')}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105"
            >
              View Connections
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 py-8">
        <div className="max-w-4xl mx-auto flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading chat...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button 
                  onClick={() => navigate('/connections')}
                  className="text-white hover:bg-white/20 p-2 rounded-lg mr-3 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <div className="flex items-center">
                  <div className="relative">
                    <img 
                      src={targetUser?.photoURL || "https://via.placeholder.com/40x40?text=User"} 
                      alt={targetUser?.firstName}
                      className="w-10 h-10 rounded-full border-2 border-white"
                    />
                    {onlineUsers.has(targetUserId) && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  
                  <div className="ml-3">
                    <h1 className="text-lg font-semibold text-white">
                      {targetUser?.firstName} {targetUser?.lastName || ''}
                    </h1>
                    <p className="text-pink-100 text-sm">
                      {onlineUsers.has(targetUserId) ? 'Online' : 'Offline'}
                      {isTyping && ' • typing...'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </button>
                <button className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors" onClick={() => { setShowVideoCall(true); setVideoCallInitiator(true); }} title="Start Video Call">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          {/* Video Call Overlay */}
          {showVideoCall && (
            <VideoCall
              roomId={`chat-${userId}-${targetUserId}`}
              onClose={() => setShowVideoCall(false)}
              isInitiator={videoCallInitiator}
            />
          )}
          {/* Messages Container */}
          <div className="h-[60vh] overflow-y-auto p-4 bg-gray-50">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <div className="text-6xl mb-4">💬</div>
                  <p className="text-lg">Start your conversation with {targetUser?.firstName}!</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((msg, index) => {
                  const isCurrentUser = userId === msg.senderId;
                  const showTime = index === 0 || 
                    (new Date(messages[index].createdAt) - new Date(messages[index-1].createdAt)) > 300000; // 5 minutes
                  return (
                    <div key={msg.messageId || msg._id || index}>
                      {showTime && (
                        <div className="text-center my-4">
                          <span className="text-xs text-gray-500 bg-gray-200 px-3 py-1 rounded-full">
                            {formatMessageTime(msg.createdAt)}
                          </span>
                        </div>
                      )}
                      <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-2`}>
                        <div className={`max-w-[70%] ${isCurrentUser ? 'order-2' : 'order-1'}`}>
                          <div className={`rounded-2xl px-4 py-3 shadow-sm ${
                            isCurrentUser 
                              ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white' 
                              : 'bg-white border border-gray-200 text-gray-800'
                          }`}>
                            <p className="text-sm leading-relaxed break-words">{msg.text}</p>
                          </div>
                          <div className={`text-xs text-gray-400 mt-1 px-2 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
                            {formatMessageTime(msg.createdAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start mb-2">
                    <div className="bg-gray-300 rounded-2xl px-4 py-3 max-w-[70%]">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
          
          {/* Message Input */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <button className="text-gray-500 hover:text-pink-500 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </button>
              
              <input
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value);
                  handleTyping();
                }}
                onBlur={handleStopTyping}
                className="flex-1 px-4 py-3 rounded-full border border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-200 outline-none bg-gray-50"
                placeholder={`Message ${targetUser?.firstName}...`}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && newMessage.trim()) {
                    handleStopTyping();
                    sendMessage();
                  }
                }}
              />
              
              <button className="text-gray-500 hover:text-pink-500 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              
              <button 
                onClick={() => {
                  handleStopTyping();
                  sendMessage();
                }} 
                disabled={!newMessage.trim()}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold p-3 rounded-full shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95 disabled:scale-100 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Chat;