// Mock Backend Functions for Dev Tinder
import { MOCK_USER } from './constants';

// Mock data storage (in a real app, this would be a database)
let mockDatabase = {
  users: [
    // Default login user for testing
    {
      _id: "shreyas-user-123",
      firstName: "Shreyas",
      lastName: "Joshi",
      emailId: "shreyas50@gmail.com",
      age: 25,
      gender: "male",
      about: "Full-stack developer building amazing web applications. Passionate about React and Node.js!",
      photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=face",
      skills: ["React", "Node.js", "JavaScript", "MongoDB", "Express", "TypeScript"]
    },
    MOCK_USER,
    {
      _id: "user-001",
      firstName: "Sarah",
      lastName: "Johnson",
      emailId: "sarah.johnson@example.com",
      age: 26,
      gender: "female",
      about: "Frontend developer passionate about React and UX design. Love creating beautiful interfaces!",
      photoUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=400&h=600&fit=crop&crop=face",
      skills: ["React", "JavaScript", "CSS", "Figma", "HTML"]
    },
    {
      _id: "user-002", 
      firstName: "Mike",
      lastName: "Chen",
      emailId: "mike.chen@example.com",
      age: 30,
      gender: "male",
      about: "Full-stack engineer with expertise in Node.js and Python. Building scalable applications!",
      photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop&crop=face",
      skills: ["Node.js", "Python", "MongoDB", "AWS", "Docker"]
    },
    {
      _id: "user-003",
      firstName: "Emily",
      lastName: "Davis",
      emailId: "emily.davis@example.com", 
      age: 28,
      gender: "female",
      about: "DevOps engineer passionate about automation and cloud infrastructure. Always learning!",
      photoUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop&crop=face",
      skills: ["AWS", "Kubernetes", "Docker", "Terraform", "Python"]
    },
    {
      _id: "user-004",
      firstName: "Alex",
      lastName: "Rodriguez", 
      emailId: "alex.rodriguez@example.com",
      age: 29,
      gender: "male",
      about: "Mobile app developer specializing in React Native and Flutter. Creating amazing mobile experiences!",
      photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop&crop=face",
      skills: ["React Native", "Flutter", "iOS", "Android", "Firebase"]
    },
    {
      _id: "user-005",
      firstName: "Lisa",
      lastName: "Wang",
      emailId: "lisa.wang@example.com",
      age: 27,
      gender: "female", 
      about: "Data scientist and ML engineer. Love working with AI and machine learning models!",
      photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop&crop=face",
      skills: ["Python", "TensorFlow", "PyTorch", "SQL", "R"]
    }
  ],
  connectionRequests: [
    {
      _id: "req-001",
      fromUserId: "user-001",
      toUserId: "dev-user-123",
      status: "interested",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
    },
    {
      _id: "req-002", 
      fromUserId: "user-002",
      toUserId: "dev-user-123",
      status: "interested",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
    },
    {
      _id: "req-003",
      fromUserId: "user-003", 
      toUserId: "dev-user-123",
      status: "interested",
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000) // 5 hours ago
    }
  ],
  connections: [
    {
      _id: "conn-001",
      fromUserId: "dev-user-123",
      toUserId: "user-004",
      status: "accepted",
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 1 week ago
    },
    {
      _id: "conn-002",
      fromUserId: "user-005", 
      toUserId: "dev-user-123",
      status: "accepted",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
    }
  ],
  messages: []
};

// Helper function to find user by ID
const findUserById = (userId) => {
  return mockDatabase.users.find(user => user._id === userId);
};

// Mock Backend API Functions
export const mockBackendAPI = {
  
  // Authentication Functions
  login: async (email, password) => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    
    console.log("Mock login attempt with email:", email); // Debug log
    console.log("Available users:", mockDatabase.users.map(u => u.emailId)); // Debug log
    
    const user = mockDatabase.users.find(u => u.emailId === email);
    if (user) {
      console.log("User found:", user); // Debug log
      return { success: true, data: user };
    }
    throw new Error("Invalid credentials - Email not found in mock database");
  },

  signup: async (userData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newUser = {
      _id: `user-${Date.now()}`,
      ...userData,
      photoUrl: `https://ui-avatars.com/api/?name=${userData.firstName}+${userData.lastName}&background=ec4899&color=fff&size=200`
    };
    
    mockDatabase.users.push(newUser);
    return { success: true, data: newUser };
  },

  // Profile Functions
  getProfile: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { success: true, data: MOCK_USER };
  },

  updateProfile: async (profileData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    Object.assign(MOCK_USER, profileData);
    return { success: true, data: MOCK_USER };
  },

  // Feed Functions
  getFeed: async () => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Return users that haven't been swiped on yet
    const currentUserId = MOCK_USER._id;
    const swipedUserIds = mockDatabase.connectionRequests
      .filter(req => req.fromUserId === currentUserId)
      .map(req => req.toUserId);
    
    const connectedUserIds = mockDatabase.connections
      .filter(conn => conn.fromUserId === currentUserId || conn.toUserId === currentUserId)
      .map(conn => conn.fromUserId === currentUserId ? conn.toUserId : conn.fromUserId);
    
    const excludeIds = [...swipedUserIds, ...connectedUserIds, currentUserId];
    const availableUsers = mockDatabase.users.filter(user => !excludeIds.includes(user._id));
    
    return { success: true, data: availableUsers };
  },

  // Connection Request Functions
  sendConnectionRequest: async (status, userId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newRequest = {
      _id: `req-${Date.now()}`,
      fromUserId: MOCK_USER._id,
      toUserId: userId,
      status: status, // "interested" or "ignored"
      createdAt: new Date()
    };
    
    mockDatabase.connectionRequests.push(newRequest);
    return { success: true, message: "Request sent successfully" };
  },

  getReceivedRequests: async () => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const currentUserId = MOCK_USER._id;
    const receivedRequests = mockDatabase.connectionRequests.filter(
      req => req.toUserId === currentUserId && req.status === "interested"
    );
    
    // Populate with sender user data
    const populatedRequests = receivedRequests.map(request => ({
      ...request,
      fromUserId: findUserById(request.fromUserId)
    }));
    
    return { success: true, data: populatedRequests };
  },

  reviewConnectionRequest: async (status, requestId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const request = mockDatabase.connectionRequests.find(req => req._id === requestId);
    if (!request) {
      throw new Error("Request not found");
    }
    
    request.status = status; // "accepted" or "rejected"
    
    // If accepted, create a connection
    if (status === "accepted") {
      const newConnection = {
        _id: `conn-${Date.now()}`,
        fromUserId: request.fromUserId,
        toUserId: request.toUserId,
        status: "accepted",
        createdAt: new Date()
      };
      mockDatabase.connections.push(newConnection);
    }
    
    return { success: true, message: "Request reviewed successfully" };
  },

  // Connections Functions
  getConnections: async () => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const currentUserId = MOCK_USER._id;
    const userConnections = mockDatabase.connections.filter(
      conn => (conn.fromUserId === currentUserId || conn.toUserId === currentUserId) && 
              conn.status === "accepted"
    );
    
    // Get the connected users data
    const connectedUsers = userConnections.map(conn => {
      const connectedUserId = conn.fromUserId === currentUserId ? conn.toUserId : conn.fromUserId;
      return findUserById(connectedUserId);
    }).filter(Boolean);
    
    return { success: true, data: connectedUsers };
  },

  // Chat Functions
  getChatMessages: async (targetUserId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const chatMessages = mockDatabase.messages.filter(
      msg => (msg.senderId._id === MOCK_USER._id && msg.receiverId === targetUserId) ||
             (msg.senderId._id === targetUserId && msg.receiverId === MOCK_USER._id)
    );
    
    return { success: true, messages: chatMessages };
  },

  sendMessage: async (targetUserId, text) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const newMessage = {
      _id: `msg-${Date.now()}`,
      senderId: MOCK_USER,
      receiverId: targetUserId,
      text,
      createdAt: new Date()
    };
    
    mockDatabase.messages.push(newMessage);
    return { success: true, data: newMessage };
  },

  // Recent Chats
  getRecentChats: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Mock recent chats data
    const recentChats = mockDatabase.connections.slice(0, 5).map(user => ({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      photo: user.photoUrl || user.photoURL,
      photoURL: user.photoUrl || user.photoURL,
      lastMessage: "Hey! How's your coding going?",
      lastMessageTime: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      hasUnread: Math.random() > 0.7, // 30% chance of having unread messages
      unreadCount: Math.random() > 0.7 ? Math.floor(Math.random() * 5) + 1 : 0
    }));

    return { success: true, data: recentChats };
  },

  // Premium Functions
  verifyPremium: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { success: true, isPremium: false };
  }
};

// Helper function to check if we're in development mode
export const isDevelopmentMode = () => {
  return import.meta.env.DEV || location.hostname === "localhost";
};

// Function to use mock API or real API based on environment
export const getAPI = () => {
  return isDevelopmentMode() ? mockBackendAPI : null;
};
