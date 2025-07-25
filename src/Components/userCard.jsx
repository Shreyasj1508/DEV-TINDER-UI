import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";
import { apiService } from "../utils/apiService";
import { useState } from "react";

const UserCard = ({ user }) => {
  const dispatch = useDispatch();
  const [isAnimating, setIsAnimating] = useState(false);
  const [error, setError] = useState(null);
  const { _id, firstName, lastName, photoUrl, about, skills } = user;

  const handleSendRequest = async (status, userId) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setError(null);
    
    try {
      const response = await apiService.sendConnectionRequest(status, userId);
      
      if (response.success) {
        dispatch(removeUserFromFeed(userId));
      }
    } catch (err) {
      console.error("Error sending request:", err);
      setError(err.message);
      setIsAnimating(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden max-w-sm mx-auto">
      {/* Profile Image */}
      <div className="relative h-64 bg-gray-200">
        <img
          src={photoUrl}
          alt={`${firstName} ${lastName}`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Username */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {firstName} {lastName}
        </h2>

        {/* About */}
        {about && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">About</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {about}
            </p>
          </div>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          {/* Pass Button */}
          <button
            className="flex-1 bg-gray-100 hover:bg-red-100 text-gray-700 hover:text-red-600 font-semibold py-3 px-6 rounded-xl border border-gray-200 hover:border-red-300 transition-all duration-200 hover:scale-105"
            onClick={() => handleSendRequest("ignored", _id)}
          >
            Pass
          </button>

          {/* Like Button */}
          <button
            className="flex-1 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-pink-300/50 transition-all duration-200 hover:scale-105"
            onClick={() => handleSendRequest("interested", _id)}
          >
            Like
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
