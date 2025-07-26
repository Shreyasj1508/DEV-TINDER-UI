import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";
import { apiService } from "../utils/apiService";
import { useState, useEffect } from "react";

const UserCard = ({ user, onSwipe, onSuperLike }) => {
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
    
    // If we have callback functions from Feed, use them for better animations
    if (onSwipe) {
      if (status === "ignored") {
        onSwipe("left", userId);
      } else if (status === "interested") {
        onSwipe("right", userId);
      }
      return;
    }
    
    // Fallback to direct API call if no callbacks provided
    setIsAnimating(true);
    setError(null);
    
    try {
      console.log(`Sending ${status} request for user ${userId}`);
      const response = await apiService.sendConnectionRequest(status, userId);
      
      if (response.success) {
        console.log(`${status} request successful, removing user from feed`);
        dispatch(removeUserFromFeed(userId));
      } else {
        console.log(`${status} request failed:`, response);
        setError(`Failed to send ${status} request`);
        setIsAnimating(false);
      }
    } catch (err) {
      console.error("Error sending request:", err);
      setError(err.message);
      setIsAnimating(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-xs mx-auto border border-gray-100 h-fit">
      {/* Profile Image */}
      <div className="relative h-48 bg-gradient-to-br from-pink-100 to-purple-100">
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

      {/* Content */}
      <div className="p-3">
        {/* Name and Title */}
        <div className="mb-2">
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

        {/* About */}
        {about && (
          <div className="mb-2">
            <h3 className="text-sm font-semibold text-gray-800 mb-1 flex items-center">
              📝 About
            </h3>
            <p className="text-gray-600 text-xs leading-tight line-clamp-2">
              {about}
            </p>
          </div>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
          <div className="mb-2">
            <h3 className="text-sm font-semibold text-gray-800 mb-1 flex items-center">
              💻 Skills
            </h3>
            <div className="flex flex-wrap gap-1">
              {skills.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md text-xs font-medium"
                >
                  {skill}
                </span>
              ))}
              {skills.length > 3 && (
                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md text-xs font-medium">
                  +{skills.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Interests */}
        {interests && interests.length > 0 && (
          <div className="mb-2">
            <h3 className="text-sm font-semibold text-gray-800 mb-1 flex items-center">
              🎯 Interests
            </h3>
            <div className="flex flex-wrap gap-1">
              {interests.slice(0, 3).map((interest, index) => (
                <span
                  key={index}
                  className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-md text-xs font-medium"
                >
                  {interest}
                </span>
              ))}
              {interests.length > 3 && (
                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md text-xs font-medium">
                  +{interests.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Social Links */}
        {(github || linkedin || portfolio) && (
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-gray-800 mb-1 flex items-center">
              🔗 Links
            </h3>
            <div className="flex gap-2">
              {github && (
                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-2 py-1 bg-gray-900 text-white rounded-md text-xs hover:bg-gray-800 transition-colors"
                >
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHub
                </a>
              )}
              {linkedin && (
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-2 py-1 bg-blue-600 text-white rounded-md text-xs hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  LinkedIn
                </a>
              )}
              {portfolio && (
                <a
                  href={portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-2 py-1 bg-purple-600 text-white rounded-md text-xs hover:bg-purple-700 transition-colors"
                >
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  Portfolio
                </a>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons - Only show if there's an _id (not in preview mode) */}
        {_id && (
          <div className="space-y-2 mt-3">
            {/* Super Like Button */}
            {onSuperLike && (
              <button
                className={`w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-2.5 px-4 rounded-xl shadow-lg hover:shadow-blue-300/50 transition-all duration-300 ${
                  isAnimating ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:-translate-y-1'
                } flex items-center justify-center gap-2`}
                onClick={() => onSuperLike(_id)}
                disabled={isAnimating}
              >
                <span className="text-lg">⭐</span>
                {isAnimating ? 'Super Liking...' : 'Super Like'}
              </button>
            )}
            
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

        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;
