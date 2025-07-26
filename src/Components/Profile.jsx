import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { addUser } from "../utils/userSlice";
import { apiService } from "../utils/apiService";
import EditProfile from "./EditProfile";
import LoadingSpinner from "./LoadingSpinner";

const Profile = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true); // Start with loading true
  const [error, setError] = useState(null);

  // Always fetch fresh profile data from backend when component mounts
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching fresh profile data from backend...');
        const response = await apiService.getProfile();
        
        if (response.success) {
          console.log('Fresh profile data received:', response.data);
          console.log('Profile fields available:', {
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            photoURL: response.data.photoURL,
            photo: response.data.photo,
            age: response.data.age,
            gender: response.data.gender,
            about: response.data.about,
            skills: response.data.skills,
            location: response.data.location,
            occupation: response.data.occupation,
            company: response.data.company,
            education: response.data.education
          });
          dispatch(addUser(response.data));
          console.log('User data dispatched to Redux store');
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Always fetch fresh data when component mounts
    fetchProfile();
  }, [dispatch]); // Only depend on dispatch, not user

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="text-gray-600 mt-4">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Profile</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-semibold hover:from-pink-600 hover:to-purple-600 transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {user ? (
        <>
          <EditProfile user={user} />
        </>
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner />
            <p className="text-gray-600 mt-4">Preparing your profile...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
