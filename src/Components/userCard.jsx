import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";
import { apiService } from "../utils/apiService";
import { useState, useEffect } from "react";

const UserCard = ({ user, onSwipe }) => {
  const dispatch = useDispatch();
  const [isAnimating, setIsAnimating] = useState(false);
  const [error, setError] = useState(null);
  const { 
    _id, 
    firstName, 
    lastName, 
    photoUrl, 
    photoURL, 
    photo,
    about, 
    skills, 
    age, 
    gender,
    location,
    occupation,
    company,
    education,
    interests,
    github,
    linkedin,
    portfolio
  } = user;

  // Use the first available photo URL
  const profilePhoto = photoUrl || photoURL || photo;

  // Reset animation state when user changes
  useEffect(() => {
    setIsAnimating(false);
    setError(null);
  }, [_id]);

  const handleSendRequest = async (status, userId) => {
    if (isAnimating) return;
    setIsAnimating(true);
    // Always swipe/remove card immediately
    if (onSwipe) {
      onSwipe(status === "interested" ? "right" : "left", userId);
    } else {
      dispatch(removeUserFromFeed(userId));
    }
    // Fire API call in background, log errors but do not block UI
    apiService.sendConnectionRequest(status, userId)
      .then((response) => {
        if (!response.success) {
          const msg = response.data?.message || '';
          if (!(msg.includes('already exists') || msg.includes('pending'))) {
            console.warn('Request failed:', msg || `Failed to send ${status} request`);
          }
        }
      })
      .catch((err) => {
        const msg = err.message || '';
        if (!(msg.includes('already exists') || msg.includes('pending'))) {
          console.warn('Request error:', msg || `Failed to send ${status} request`);
        }
      });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-sm mx-auto border border-gray-100 h-fit">
      {/* Profile Image */}
      <div className="relative h-60 bg-gradient-to-br from-pink-100 to-purple-100">
        {profilePhoto ? (
          <img
            src={profilePhoto}
            alt={`${firstName} ${lastName}`}
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div 
          className={`w-full h-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center ${profilePhoto ? 'hidden' : 'flex'}`}
          style={{ display: profilePhoto ? 'none' : 'flex' }}
        >
          <div className="text-center text-white">
            <div className="text-4xl font-bold mb-1">
              {firstName ? firstName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="text-sm opacity-90">No Photo</div>
          </div>
        </div>
        
        {/* Age and Location Overlay */}
        {(age || location) && (
          <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-xs">
            {age && <span>{age}</span>}
            {age && location && <span> • </span>}
            {location && <span>{location}</span>}
          </div>
        )}
      </div>

      {/* Content - Columnar Layout */}
      <div className="p-3">
        {/* Name and Title */}
        <div className="mb-3">
          <h2 className="text-lg font-bold text-gray-900 mb-0.5 leading-tight">
            {firstName} {lastName}
            {gender && (
              <span className="ml-1 text-sm">
                {gender === 'male' || gender === 'Male' ? '♂️' : gender === 'female' || gender === 'Female' ? '♀️' : '🧑‍💼'}
              </span>
            )}
          </h2>
          {(occupation || company) && (
            <p className="text-gray-600 font-medium text-xs leading-tight">
              {occupation}
              {occupation && company && ' at '}
              {company}
            </p>
          )}
          {education && (
            <p className="text-gray-500 text-xs mt-0.5">{education}</p>
          )}
        </div>

        {/* Two Column Layout for Details */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          {/* Left Column */}
          <div className="space-y-2">
            {/* About */}
            {about && (
              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-1 flex items-center">
                  📝 About
                </h3>
                <p className="text-gray-600 text-xs leading-tight line-clamp-3">
                  {about}
                </p>
              </div>
            )}

            {/* Skills */}
            {skills && skills.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-1 flex items-center">
                  💻 Skills
                </h3>
                <div className="flex flex-wrap gap-1">
                  {skills.slice(0, 2).map((skill, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                  {skills.length > 2 && (
                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md text-xs font-medium">
                      +{skills.length - 2}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-2">
            {/* Interests */}
            {interests && interests.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-1 flex items-center">
                  🎯 Interests
                </h3>
                <div className="flex flex-wrap gap-1">
                  {interests.slice(0, 2).map((interest, index) => (
                    <span
                      key={index}
                      className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-md text-xs font-medium"
                    >
                      {interest}
                    </span>
                  ))}
                  {interests.length > 2 && (
                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md text-xs font-medium">
                      +{interests.length - 2}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Social Links */}
            {(github || linkedin || portfolio) && (
              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-1 flex items-center">
                  🔗 Links
                </h3>
                <div className="flex flex-col gap-1">
                  {github && (
                    <a
                      href={github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:text-blue-800 truncate"
                    >
                      🐙 GitHub
                    </a>
                  )}
                  {linkedin && (
                    <a
                      href={linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:text-blue-800 truncate"
                    >
                      💼 LinkedIn
                    </a>
                  )}
                  {portfolio && (
                    <a
                      href={portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:text-blue-800 truncate"
                    >
                      🌐 Portfolio
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons - Only show if there's an _id (not in preview mode) */}
        {_id && (
          <div className="space-y-2 mt-3">
            {/* Pass and Like Buttons */}
            <div className="flex gap-2">
              {/* Pass Button */}
              <button
                className={`flex-1 bg-gray-100 hover:bg-red-100 text-gray-700 hover:text-red-600 font-semibold py-2.5 px-4 rounded-xl border border-gray-200 hover:border-red-300 transition-all duration-300 ${
                  isAnimating ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:-translate-y-1'
                } flex items-center justify-center gap-2`}
                onClick={() => handleSendRequest("ignored", _id)}
                disabled={isAnimating}
              >
                <span className="text-lg">👎</span>
                {isAnimating ? '...' : 'Pass'}
              </button>

              {/* Like Button */}
              <button
                className={`flex-1 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-semibold py-2.5 px-4 rounded-xl shadow-lg hover:shadow-pink-300/50 transition-all duration-300 ${
                  isAnimating ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:-translate-y-1'
                } flex items-center justify-center gap-2`}
                onClick={() => handleSendRequest("interested", _id)}
                disabled={isAnimating}
              >
                <span className="text-lg">❤️</span>
                {isAnimating ? '...' : 'Like'}
              </button>
            </div>
          </div>
        )}

        {/* No error message for like/pass actions; errors are logged only */}
      </div>
    </div>
  );
};

export default UserCard;
