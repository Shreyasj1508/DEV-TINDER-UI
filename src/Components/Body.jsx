import { Outlet, useNavigate, useLocation } from "react-router-dom";
import NavBar from "./Navbar";
import Footer from "./Footer";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useEffect, useState } from "react";
import { apiService } from "../utils/apiService";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((store) => store.user);
  const [isLoading, setIsLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  const fetchUser = async () => {
    if (authChecked) return; // Prevent multiple API calls
    
    try {
      setIsLoading(true);
      const response = await apiService.getProfile();
      
      if (response.success) {
        dispatch(addUser(response.data));
        setAuthChecked(true);
      }
    } catch (err) {
      if (err.message.includes('401') || err.message.includes('Unauthorized')) {
        // Only redirect to login if not already on login page
        if (location.pathname !== "/login") {
          navigate("/login");
        }
      }
      setAuthChecked(true);
      console.error("Error fetching user:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch user if not on login page and user not already loaded
    if (!user?.emailId && location.pathname !== "/login") {
      fetchUser();
    } else if (location.pathname === "/login") {
      setIsLoading(false);
      setAuthChecked(true);
    }
  }, [location.pathname]);

  // Show loading spinner while checking authentication
  if (isLoading && location.pathname !== "/login") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <NavBar />
      <div className="pt-20">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Body;
