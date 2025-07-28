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

  // Handle both direct user object and API response wrapped user object
  const userData = user?.data ? user.data : user;

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
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-200/20 shadow-sm animate-[slideInDown_0.6s_ease-out]">
      <div className="navbar max-w-7xl mx-auto px-4 lg:px-8">
        {/* Logo */}
        <div className="flex-1">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 via-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 group-hover:rotate-12">
                <svg
                  className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                {/* Floating particles effect */}
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300"></div>
                <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-pink-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-opacity duration-300 delay-100"></div>
              </div>
            </div>
            <div className="group-hover:translate-x-1 transition-transform duration-300">
              <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 via-red-500 to-orange-500 bg-clip-text text-transparent group-hover:from-pink-500 group-hover:via-red-400 group-hover:to-orange-400 transition-all duration-300">
                DevTinder
              </span>
              <div className="text-xs text-gray-500 -mt-1 group-hover:text-gray-600 transition-colors duration-300">For Developers</div>
            </div>
          </Link>
        </div>

        {user && (
          <div className="flex-none">
            <div className="flex items-center space-x-1 lg:space-x-2">
              {/* Navigation Links */}
              <Link
                to="/"
                className={`hidden lg:flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 ${
                  isActive("/")
                    ? "bg-gradient-to-r from-pink-100 to-red-100 text-pink-600 shadow-lg scale-105"
                    : "text-gray-600 hover:bg-gradient-to-r hover:from-pink-50 hover:to-red-50 hover:text-pink-500 hover:shadow-md"
                }`}
              >
                <svg
                  className={`w-5 h-5 transition-all duration-300 ${isActive("/") ? "animate-pulse" : "group-hover:scale-110"}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <span className="font-medium">Discover</span>
                {isActive("/") && <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-pink-500 rounded-full animate-bounce"></div>}
              </Link>

              <Link
                to="/connections"
                className={`hidden lg:flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 relative ${
                  isActive("/connections")
                    ? "bg-gradient-to-r from-pink-100 to-red-100 text-pink-600 shadow-lg scale-105"
                    : "text-gray-600 hover:bg-gradient-to-r hover:from-pink-50 hover:to-red-50 hover:text-pink-500 hover:shadow-md"
                }`}
              >
                <svg
                  className={`w-5 h-5 transition-all duration-300 ${isActive("/connections") ? "animate-pulse" : "group-hover:scale-110"}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <span className="font-medium">Matches</span>
                {isActive("/connections") && <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-pink-500 rounded-full animate-bounce"></div>}
              </Link>

              {/* Chat Dropdown - Responsive */}
              <ChatDropdown />

              <Link
                to="/chats"
                className={`hidden lg:flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 relative ${
                  isActive("/chats") || location.pathname.startsWith("/chat/")
                    ? "bg-gradient-to-r from-pink-100 to-purple-100 text-pink-600 shadow-lg scale-105"
                    : "text-gray-600 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 hover:text-pink-500 hover:shadow-md"
                }`}
              >
                <svg
                  className={`w-5 h-5 transition-all duration-300 ${isActive("/chats") || location.pathname.startsWith("/chat/") ? "animate-pulse" : "group-hover:scale-110"}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <span className="font-medium">Chats</span>
                {(isActive("/chats") || location.pathname.startsWith("/chat/")) && <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-pink-500 rounded-full animate-bounce"></div>}
              </Link>

              <Link
                to="/requests"
                className={`hidden lg:flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 relative ${
                  isActive("/requests")
                    ? "bg-gradient-to-r from-pink-100 to-red-100 text-pink-600 shadow-lg scale-105"
                    : "text-gray-600 hover:bg-gradient-to-r hover:from-pink-50 hover:to-red-50 hover:text-pink-500 hover:shadow-md"
                }`}
              >
                <svg
                  className={`w-5 h-5 transition-all duration-300 ${isActive("/requests") ? "animate-pulse" : "group-hover:scale-110"}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
                <span className="font-medium">Requests</span>
                <NotificationBadge count={requestsCount} />
                {isActive("/requests") && <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-pink-500 rounded-full animate-bounce"></div>}
              </Link>

              {/* Mobile Navigation Icons */}
              <div className="flex lg:hidden items-center space-x-1">
                <Link
                  to="/"
                  className={`p-3 rounded-full transition-all duration-300 transform hover:scale-110 hover:-translate-y-0.5 ${
                    isActive("/")
                      ? "bg-pink-100 text-pink-600 scale-110 shadow-md"
                      : "text-gray-600 hover:bg-pink-50 hover:text-pink-500"
                  }`}
                >
                  <svg
                    className={`w-5 h-5 transition-transform duration-300 ${isActive("/") ? "animate-pulse" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </Link>

                <Link
                  to="/connections"
                  className={`p-3 rounded-full transition-all duration-300 transform hover:scale-110 hover:-translate-y-0.5 ${
                    isActive("/connections")
                      ? "bg-pink-100 text-pink-600 scale-110 shadow-md"
                      : "text-gray-600 hover:bg-pink-50 hover:text-pink-500"
                  }`}
                >
                  <svg
                    className={`w-5 h-5 transition-transform duration-300 ${isActive("/connections") ? "animate-pulse" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </Link>

                <Link
                  to="/requests"
                  className={`p-3 rounded-full transition-all duration-300 transform hover:scale-110 hover:-translate-y-0.5 relative ${
                    isActive("/requests")
                      ? "bg-pink-100 text-pink-600 scale-110 shadow-md"
                      : "text-gray-600 hover:bg-pink-50 hover:text-pink-500"
                  }`}
                >
                  <svg
                    className={`w-5 h-5 transition-transform duration-300 ${isActive("/requests") ? "animate-pulse" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                    />
                  </svg>
                  <NotificationBadge count={requestsCount} />
                </Link>
              </div>

              {/* Profile Dropdown */}
              <div className="dropdown dropdown-end ml-2">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-pink-200 transform hover:scale-110 hover:-translate-y-0.5 group"
                >
                  <div className="w-10 rounded-full overflow-hidden ring-2 ring-pink-200 ring-offset-2 group-hover:ring-pink-300 group-hover:ring-offset-4 transition-all duration-300">
                    {(userData?.photoURL || userData?.photo || userData?.photoUrl || userData?.picture || userData?.avatar) ? (
                      <img
                        alt="Profile"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        src={userData?.photoURL || userData?.photo || userData?.photoUrl || userData?.picture || userData?.avatar}
                        onError={(e) => {
                          // Try fallback avatar URL
                          const fallbackUrl = `https://ui-avatars.com/api/?name=${userData?.firstName}+${userData?.lastName}&background=ec4899&color=fff&size=200`;
                          if (e.target.src !== fallbackUrl) {
                            e.target.src = fallbackUrl;
                          } else {
                            // If even fallback fails, hide image and show default icon
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }
                        }}
                      />
                    ) : null}
                    <div
                      className="w-full h-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center group-hover:from-pink-400 group-hover:to-purple-500 transition-all duration-300"
                      style={{
                        display: (userData?.photoURL || userData?.photo || userData?.photoUrl || userData?.picture || userData?.avatar) ? "none" : "flex",
                      }}
                    >
                      <svg
                        className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                  </div>
                  {/* Online status indicator */}
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full animate-pulse"></div>
                </div>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content bg-white rounded-2xl z-[1] mt-3 w-64 p-3 shadow-2xl border border-gray-100 animate-[fadeInUp_0.3s_ease-out] transform origin-top-right"
                >
                  <li className="menu-title px-4 py-2">
                    <div className="flex items-center space-x-3 animate-[slideInLeft_0.4s_ease-out]">
                      <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-pink-200 hover:ring-pink-300 transition-all duration-300">
                        {(userData?.photoURL || userData?.photo || userData?.photoUrl || userData?.picture || userData?.avatar) ? (
                          <img
                            src={userData?.photoURL || userData?.photo || userData?.photoUrl || userData?.picture || userData?.avatar}
                            alt="Profile"
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              // Try fallback avatar URL
                              const fallbackUrl = `https://ui-avatars.com/api/?name=${userData?.firstName}+${userData?.lastName}&background=ec4899&color=fff&size=200`;
                              if (e.target.src !== fallbackUrl) {
                                e.target.src = fallbackUrl;
                              } else {
                                // If even fallback fails, hide image and show default icon
                                e.target.style.display = "none";
                                e.target.nextSibling.style.display = "flex";
                              }
                            }}
                          />
                        ) : null}
                        <div
                          className="w-full h-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center"
                          style={{
                            display: (userData?.photoURL || userData?.photo || userData?.photoUrl || userData?.picture || userData?.avatar) ? "none" : "flex",
                          }}
                        >
                          <svg
                            className="w-6 h-6 text-white"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800 hover:text-pink-600 transition-colors duration-300">
                          {userData?.firstName} {userData?.lastName}
                        </div>
                        <div className="text-xs text-gray-500 -mt-1">
                          {userData?.emailId || userData?.email}
                        </div>
                      </div>
                    </div>
                  </li>
                  <div className="divider my-2"></div>

                  <li className="animate-[slideInLeft_0.5s_ease-out_0.1s_both]">
                    <Link
                      to="/profile"
                      className="flex items-center space-x-3 p-3 hover:bg-pink-50 rounded-xl transition-all duration-300 transform hover:scale-105 hover:translate-x-1 group"
                    >
                      <svg
                        className="w-5 h-5 text-gray-500 group-hover:text-pink-500 group-hover:scale-110 transition-all duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <span className="group-hover:font-medium transition-all duration-300">Edit Profile</span>
                    </Link>
                  </li>

                  <li className="animate-[slideInLeft_0.5s_ease-out_0.2s_both]">
                    <Link
                      to="/premium"
                      className="flex items-center space-x-3 p-3 hover:bg-orange-50 rounded-xl transition-all duration-300 transform hover:scale-105 hover:translate-x-1 group"
                    >
                      <svg
                        className="w-5 h-5 text-orange-500 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      <span className="group-hover:font-medium transition-all duration-300">Get Premium</span>
                      <span className="badge badge-warning badge-sm animate-pulse">Pro</span>
                    </Link>
                  </li>

                  <div className="divider my-2"></div>

                  <li className="animate-[slideInLeft_0.5s_ease-out_0.3s_both]">
                    <a
                      onClick={handleLogout}
                      className="flex items-center space-x-3 p-3 hover:bg-red-50 text-red-600 rounded-xl transition-all duration-300 cursor-pointer transform hover:scale-105 hover:translate-x-1 group"
                    >
                      <svg
                        className="w-5 h-5 group-hover:scale-110 transition-all duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      <span className="group-hover:font-medium transition-all duration-300">Sign Out</span>
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
