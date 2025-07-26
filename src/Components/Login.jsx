import { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { apiService, setUseMockBackend } from "../utils/apiService";

const Login = () => {
  const [emailId, setEmailId] = useState("Alice1@gmail.com");
  const [password, setPassword] = useState("Alice1@@");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");
      
      console.log("Attempting login with:", emailId); // Debug log
      
      const response = await apiService.login(emailId, password);

      if (response.success) {
        console.log("Login successful:", response.data); // Debug log
        dispatch(addUser(response.data));
        navigate("/");
      }
    } catch (err) {
      console.error("Login error:", err); // Debug log
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await apiService.signup({
        firstName,
        lastName,
        email: emailId,
        password,
      });

      if (response.success) {
        dispatch(addUser(response.data));
        navigate("/profile");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Enhanced Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -top-10 -right-10 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

        {/* Floating Hearts */}
        <div className="absolute top-20 left-20 text-pink-400 text-2xl animate-float">
          💖
        </div>
        <div className="absolute top-40 right-32 text-purple-400 text-xl animate-float animation-delay-2000">
          🔥
        </div>
        <div className="absolute bottom-32 left-32 text-blue-400 text-lg animate-float animation-delay-4000">
          ⚡
        </div>
      </div>

      <div className="relative z-10 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-white/20 animate-card-pop">
        {/* Enhanced Header */}
        <div className="relative bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 px-8 py-8 text-center">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 animate-heart-beat">
              <span className="text-2xl">🔥</span>
            </div>
            <h2 className="text-3xl font-bold text-white drop-shadow-lg">
              {isLoginForm ? "Welcome Back!" : "Join DevTinder"}
            </h2>
            <p className="text-white/90 mt-2 drop-shadow-md">
              {isLoginForm
                ? "Sign in to find your coding match"
                : "Create your developer profile"}
            </p>

            {/* Fun Stats */}
            <div className="mt-4 flex justify-center gap-4 text-white/80 text-xs">
              <div className="text-center">
                <div className="font-bold">10K+</div>
                <div>Developers</div>
              </div>
              <div className="text-center">
                <div className="font-bold">5K+</div>
                <div>Matches</div>
              </div>
              <div className="text-center">
                <div className="font-bold">2K+</div>
                <div>Projects</div>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="px-8 py-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-6">
            {!isLoginForm && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-200 outline-none"
                      placeholder="John"
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-200 outline-none"
                      placeholder="Doe"
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={emailId}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-200 outline-none bg-gray-50 focus:bg-white"
                  placeholder="your@email.com"
                  onChange={(e) => setEmailId(e.target.value)}
                />
                <svg
                  className="absolute left-4 top-3.5 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-200 outline-none bg-gray-50 focus:bg-white"
                  placeholder="••••••••"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <svg
                  className="absolute left-4 top-3.5 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <button
            className="w-full mt-8 bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 hover:from-pink-600 hover:via-red-600 hover:to-orange-600 text-white font-bold py-4 px-6 rounded-xl shadow-xl transform transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={isLoginForm ? handleLogin : handleSignUp}
            disabled={
              loading ||
              !emailId ||
              !password ||
              (!isLoginForm && (!firstName || !lastName))
            }
          >
            <div className="flex items-center justify-center space-x-2">
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>
                    {isLoginForm ? "Signing In..." : "Creating Account..."}
                  </span>
                </>
              ) : (
                <>
                  <span>{isLoginForm ? "Sign In" : "Create Account"}</span>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </>
              )}
            </div>
          </button>

          {/* Divider */}
          <div className="mt-8 flex items-center">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-4 text-gray-500 text-sm">or</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* Social Login Placeholder */}
          <button className="w-full mt-6 flex items-center justify-center space-x-3 bg-white border-2 border-gray-200 hover:border-pink-300 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:shadow-lg">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="mt-8 text-center">
            <button
              className="text-pink-600 hover:text-pink-700 font-semibold transition-colors duration-200 relative group"
              onClick={() => setIsLoginForm((value) => !value)}
            >
              {isLoginForm
                ? "New to DevTinder? Create an account"
                : "Already have an account? Sign in"}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-pink-600 group-hover:w-full transition-all duration-300"></span>
            </button>
          </div>

          {/* Terms */}
          {!isLoginForm && (
            <p className="mt-6 text-xs text-gray-500 text-center leading-relaxed">
              By creating an account, you agree to our{" "}
              <a href="#" className="text-pink-600 hover:text-pink-700">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-pink-600 hover:text-pink-700">
                Privacy Policy
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
