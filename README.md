# DevTinder 🔥 - A Modern Developer Networking Platform

Welcome to **DevTinder**, a beautiful Tinder-like application designed specifically for developers to connect, collaborate, and network with fellow programmers worldwide!

## ✨ Features

### 🎨 Beautiful Modern UI
- **Tinder-inspired card design** with smooth animations
- **Gradient backgrounds** and modern color schemes
- **Responsive design** that works on all devices
- **Glassmorphism effects** and smooth transitions

### 👤 User Management
- **Secure authentication** with login/signup
- **Comprehensive profile editing** with real-time preview
- **Skills showcase** with beautiful pill tags
- **Photo uploads** with URL support

### 🔄 Networking Features
- **Swipe-like interactions** with love/reject buttons
- **Connection requests** management
- **Real-time chat** with WebSocket integration
- **Connection management** with beautiful card layouts

### 💎 Premium Features
- **Multiple subscription tiers** (Silver & Gold)
- **Razorpay payment integration**
- **Enhanced profile features** for premium users
- **Unlimited connections** for premium members

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, DaisyUI
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Real-time**: Socket.io Client
- **Payments**: Razorpay Integration

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- A running DevTinder backend server

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd DEV-TINDER-UI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in terminal)

### Build for Production
```bash
npm run build
npm run preview
```

## 🎯 Key Components

### 🃏 UserCard Component
- Beautiful Tinder-style cards with gradient overlays
- Skills display with pill badges
- Interactive action buttons (reject, like, super like)
- Responsive image handling

### 🏠 Feed Component
- Infinite scroll-like experience
- Beautiful empty states
- Smooth animations and transitions
- Card stacking effects

### 💬 Chat Component
- Modern messaging interface
- Real-time message updates
- Message bubbles with sender identification
- Responsive design for mobile and desktop

### 🔐 Authentication
- Beautiful login/signup forms
- Gradient backgrounds and animations
- Form validation and error handling
- Smooth transitions between forms

### 💎 Premium Plans
- Attractive pricing cards
- Feature comparison
- Secure payment integration
- Success/error handling

## 🎨 Design Features

### Color Palette
- **Primary**: Pink to Purple gradients (`from-pink-500 to-purple-600`)
- **Secondary**: Blue accents for actions
- **Success**: Green gradients for positive actions
- **Error**: Red gradients for negative actions

### Animations
- **Fade-in effects** for content loading
- **Hover animations** on interactive elements
- **Scale effects** on button interactions
- **Slide-in effects** for notifications

### Modern UI Elements
- **Rounded corners** (rounded-xl, rounded-2xl, rounded-3xl)
- **Shadow effects** (shadow-xl, shadow-2xl)
- **Backdrop blur** for glassmorphism
- **Gradient overlays** on images

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop** (1200px+)
- **Tablet** (768px - 1199px)
- **Mobile** (320px - 767px)

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=http://localhost:7777
```

### Backend Integration
The app expects a backend server running on `http://localhost:7777` by default. Make sure your backend APIs are available at:
- `/login` - User authentication
- `/signup` - User registration
- `/profile/*` - Profile management
- `/user/feed` - Get user feed
- `/user/connections` - Get connections
- `/user/requests/received` - Get connection requests
- `/request/send/*` - Send connection requests
- `/chat/*` - Chat functionality

## 🎉 What's New in This Version

### ✨ Visual Enhancements
- **Complete UI overhaul** with Tinder-like design
- **Modern card layouts** with beautiful shadows and gradients
- **Enhanced typography** with proper font weights and sizes
- **Improved color scheme** with consistent brand colors

### 🔄 Improved User Experience
- **Smooth animations** throughout the application
- **Better navigation** with modern navbar design
- **Enhanced forms** with better validation and styling
- **Responsive design** improvements for mobile devices

### 🚀 Performance Optimizations
- **Optimized component rendering**
- **Better state management**
- **Improved API error handling**
- **Enhanced loading states**

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Developer

**Shreyas Jaiswal**
- GitHub: [@shreyasj1508](https://github.com/shreyasj1508)
- LinkedIn: [Shreyas Jaiswal](https://www.linkedin.com/in/shreyas-jaiswal1508/)
- Twitter: [@shreyas1508_](https://x.com/shreyas1508_)

## 🙏 Acknowledgments

- Inspired by Tinder's beautiful UI/UX design
- Built with modern React ecosystem
- Thanks to the open-source community for amazing tools

---

**Happy Coding and Networking! 🔥💻**

> "Connect with developers, collaborate on projects, and build amazing things together!"
