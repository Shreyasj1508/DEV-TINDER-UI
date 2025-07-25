import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";
import { apiService } from "../utils/apiService";
import { useState } from "react";

const UserCard = ({ user }) => {
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
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-sm mx-auto border border-gray-100">
      {/* Profile Image */}
      <div className="relative h-80 bg-gradient-to-br from-pink-100 to-purple-100">
        {profilePhoto ? (
          <img
            src={profilePhoto}
            alt={`${firstName} ${lastName}`}
            className="w-full h-full object-cover"
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
            <div className="text-6xl font-bold mb-2">
              {firstName ? firstName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="text-lg opacity-90">No Photo</div>
          </div>
        </div>
        
        {/* Age and Location Overlay */}
        {(age || location) && (
          <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
            {age && <span>{age}</span>}
            {age && location && <span> • </span>}
            {location && <span>{location}</span>}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Name and Title */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            {firstName} {lastName}
            {gender && (
              <span className="ml-2 text-lg">
                {gender === 'male' || gender === 'Male' ? '♂️' : gender === 'female' || gender === 'Female' ? '♀️' : '🧑‍💼'}
              </span>
            )}
          </h2>
          {(occupation || company) && (
            <p className="text-gray-600 font-medium">
              {occupation}
              {occupation && company && ' at '}
              {company}
            </p>
          )}
          {education && (
            <p className="text-gray-500 text-sm">{education}</p>
          )}
        </div>

        {/* About */}
        {about && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
              📝 About
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {about}
            </p>
          </div>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              💻 Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {skills.slice(0, 6).map((skill, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium"
                >
                  {skill}
                </span>
              ))}
              {skills.length > 6 && (
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                  +{skills.length - 6} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Interests */}
        {interests && interests.length > 0 && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              🎯 Interests
            </h3>
            <div className="flex flex-wrap gap-2">
              {interests.slice(0, 4).map((interest, index) => (
                <span
                  key={index}
                  className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium"
                >
                  {interest}
                </span>
              ))}
              {interests.length > 4 && (
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                  +{interests.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Social Links */}
        {(github || linkedin || portfolio) && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              🔗 Links
            </h3>
            <div className="flex gap-3">
              {github && (
                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-3 py-2 bg-gray-900 text-white rounded-lg text-xs hover:bg-gray-800 transition-colors"
                >
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
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
                  className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
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
                  className="flex items-center px-3 py-2 bg-purple-600 text-white rounded-lg text-xs hover:bg-purple-700 transition-colors"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <div className="flex gap-3">
            {/* Pass Button */}
            <button
              className={`flex-1 bg-gray-100 hover:bg-red-100 text-gray-700 hover:text-red-600 font-semibold py-3 px-6 rounded-xl border border-gray-200 hover:border-red-300 transition-all duration-200 ${
                isAnimating ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
              }`}
              onClick={() => handleSendRequest("ignored", _id)}
              disabled={isAnimating}
            >
              {isAnimating ? '...' : 'Pass'}
            </button>

            {/* Like Button */}
            <button
              className={`flex-1 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-pink-300/50 transition-all duration-200 ${
                isAnimating ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
              }`}
              onClick={() => handleSendRequest("interested", _id)}
              disabled={isAnimating}
            >
              {isAnimating ? '...' : 'Like'}
            </button>
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
