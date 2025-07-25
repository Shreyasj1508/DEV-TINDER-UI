import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { removeUser } from "../utils/userSlice";
import { apiService } from "../utils/apiService";
import { useRequestsCount } from "../utils/useRequestsCount";
import NotificationBadge from "./NotificationBadge";
import ChatDropdown from "./ChatDropdown";

const NavBar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { requestsCount } = useRequestsCount();

  const handleLogout = async () => {
    try {
      await apiService.logout();
      dispatch(removeUser());
      navigate("/login");
    } catch (err) {
      console.log("Logout error:", err);
      // Even if logout fails, clear user state
      dispatch(removeUser());
      navigate("/login");
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-200/20 shadow-sm">
      <div className="navbar max-w-7xl mx-auto px-4 lg:px-8">
        {/* Logo */}
        <div className="flex-1">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 via-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 via-red-500 to-orange-500 bg-clip-text text-transparent">
                DevTinder
              </span>
              <div className="text-xs text-gray-500 -mt-1">For Developers</div>
            </div>
          </Link>
        </div>

        {user && (
          <div className="flex-none">
            <div className="flex items-center space-x-1 lg:space-x-2">
              {/* Navigation Links */}
              <Link
                to="/"
                className={`hidden lg:flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${
                  isActive('/') 
                    ? 'bg-gradient-to-r from-pink-100 to-red-100 text-pink-600 shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="font-medium">Discover</span>
              </Link>

              <Link
                to="/connections"
                className={`hidden lg:flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${
                  isActive('/connections') 
                    ? 'bg-gradient-to-r from-pink-100 to-red-100 text-pink-600 shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="font-medium">Matches</span>
              </Link>

              <Link
                to="/requests"
                className={`hidden lg:flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 relative ${
                  isActive('/requests') 
                    ? 'bg-gradient-to-r from-pink-100 to-red-100 text-pink-600 shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                <span className="font-medium">Requests</span>
                <NotificationBadge count={requestsCount} />
              </Link>

              {/* Chat Dropdown - Desktop */}
              <div className="hidden lg:block">
                <ChatDropdown />
              </div>

              {/* Mobile Navigation Icons */}
              <div className="flex lg:hidden items-center space-x-1">
                <Link to="/" className={`p-3 rounded-full transition-all ${isActive('/') ? 'bg-pink-100 text-pink-600' : 'text-gray-600 hover:bg-gray-100'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </Link>
                
                <Link to="/connections" className={`p-3 rounded-full transition-all ${isActive('/connections') ? 'bg-pink-100 text-pink-600' : 'text-gray-600 hover:bg-gray-100'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </Link>
                
                <Link to="/requests" className={`p-3 rounded-full transition-all relative ${isActive('/requests') ? 'bg-pink-100 text-pink-600' : 'text-gray-600 hover:bg-gray-100'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                  <NotificationBadge count={requestsCount} />
                </Link>
                
                {/* Chat Dropdown - Mobile */}
                <div className="lg:hidden">
                  <ChatDropdown />
                </div>
              </div>

              {/* Profile Dropdown */}
              <div className="dropdown dropdown-end ml-2">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar hover:shadow-lg transition-all duration-200 border-2 border-transparent hover:border-pink-200"
                >
                  <div className="w-10 rounded-full overflow-hidden ring-2 ring-pink-200 ring-offset-2">
                    {user?.photoURL || user?.photo ? (
                      <img
                        alt="Profile"
                        className="w-full h-full object-cover"
                        src={user?.photoURL || user?.photo}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className={`w-full h-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center ${(user?.photoURL || user?.photo) ? 'hidden' : 'flex'}`}
                      style={{ display: (user?.photoURL || user?.photo) ? 'none' : 'flex' }}
                    >
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    </div>
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content bg-white rounded-2xl z-[1] mt-3 w-64 p-3 shadow-2xl border border-gray-100"
                >
                  <li className="menu-title px-4 py-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-pink-200">
                        {user?.photoURL || user?.photo ? (
                          <img
                            src={user?.photoURL || user?.photo}
                            alt="Profile"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div 
                          className={`w-full h-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center ${(user?.photoURL || user?.photo) ? 'hidden' : 'flex'}`}
                          style={{ display: (user?.photoURL || user?.photo) ? 'none' : 'flex' }}
                        >
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                          </svg>
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">
                          {user?.firstName} {user?.lastName}
                        </div>
                        <div className="text-xs text-gray-500 -mt-1">
                          {user?.emailId || user?.email}
                        </div>
                      </div>
                    </div>
                  </li>
                  <div className="divider my-2"></div>
                  
                  <li>
                    <Link to="/profile" className="flex items-center space-x-3 p-3 hover:bg-pink-50 rounded-xl transition-colors">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>Edit Profile</span>
                    </Link>
                  </li>
                  
                  <li>
                    <Link to="/premium" className="flex items-center space-x-3 p-3 hover:bg-orange-50 rounded-xl transition-colors">
                      <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      <span>Get Premium</span>
                      <span className="badge badge-warning badge-sm">Pro</span>
                    </Link>
                  </li>
                  
                  <div className="divider my-2"></div>
                  
                  <li>
                    <a onClick={handleLogout} className="flex items-center space-x-3 p-3 hover:bg-red-50 text-red-600 rounded-xl transition-colors cursor-pointer">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Sign Out</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;
