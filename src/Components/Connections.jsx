import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import { Link } from "react-router-dom";
import { apiService } from "../utils/apiService";
import LoadingSpinner from "./LoadingSpinner";

const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchConnections = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getConnections();
      
      if (response.success) {
        dispatch(addConnections(response.data));
      }
    } catch (err) {
      console.error("Error fetching connections:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Connections</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchConnections}
            className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-semibold hover:from-pink-600 hover:to-purple-600 transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!connections || connections.length === 0) 
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 flex items-center justify-center relative overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-pink-300 rounded-full blur-xl animate-pulse opacity-60"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-300 rounded-full blur-xl animate-bounce opacity-40"></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-blue-300 rounded-full blur-xl animate-ping opacity-30"></div>
        </div>
        
        <div className="text-center relative z-10 animate-fade-in">
          <div className="text-8xl mb-6 animate-float">💬</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">No connections yet</h1>
          <p className="text-xl text-gray-600 mb-8">Start swiping to make connections!</p>
          <Link 
            to="/" 
            className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-semibold hover:from-pink-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            🔥 Start Swiping
          </Link>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 py-8 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-32 h-32 bg-pink-300 rounded-full blur-xl animate-blob"></div>
        <div className="absolute top-40 right-20 w-28 h-28 bg-purple-300 rounded-full blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-40 left-1/4 w-24 h-24 bg-blue-300 rounded-full blur-xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 animate-fade-in">
          <div className="mb-6">
            <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent mb-4 leading-tight">
              💕 Your Connections
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto rounded-full"></div>
          </div>
          
          <p className="text-gray-600 text-xl mb-6 max-w-2xl mx-auto">
            Amazing! You have <span className="font-bold text-pink-600">{connections.length}</span> meaningful connection{connections.length !== 1 ? 's' : ''} waiting for you
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            <div className="px-6 py-3 bg-white/80 backdrop-blur-lg rounded-2xl text-lg font-bold text-gray-700 shadow-xl border border-white/30 flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Ready to chat
              </span>
            </div>
            
            <Link 
              to="/" 
              className="px-6 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 text-white rounded-2xl text-lg font-bold shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center gap-3"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
              </svg>
              Find more matches
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {connections.map((connection, index) => {
            const { _id, firstName, lastName, photoURL, photoUrl, photo, picture, avatar, age, gender, about, skills } = connection;
            const imageUrl = photoURL || photoUrl || photo || picture || avatar;

            return (
              <div
                key={_id}
                className="group bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-2xl border border-white/30 animate-fade-in hover:bg-white relative h-[420px] flex flex-col"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Card Header with Image */}
                <div className="relative h-48 overflow-hidden flex-shrink-0">
                  <img
                    alt={`${firstName} ${lastName}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    src={imageUrl}
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=ec4899&color=fff&size=300&bold=true`;
                    }}
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70"></div>
                  
                  {/* Interactive Elements */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 flex items-center justify-center">
                    <div className="bg-white/90 backdrop-blur-md rounded-full p-3 transform scale-0 group-hover:scale-100 transition-transform duration-300">
                      <svg className="w-6 h-6 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    </div>
                  </div>

                  {/* Match Badge */}
                  <div className="absolute top-3 left-3">
                    <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white px-3 py-1 rounded-xl text-xs font-bold shadow-lg">
                      <span className="flex items-center gap-1">
                        💕 CONNECTED
                      </span>
                    </div>
                  </div>
                  
                  {/* Name and Basic Info */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="text-lg font-bold drop-shadow-2xl mb-1">
                      {firstName} {lastName}
                    </h3>
                    {age && gender && (
                      <p className="text-xs opacity-90 drop-shadow-md flex items-center gap-1">
                        <span className="bg-white/20 backdrop-blur-sm rounded-full px-2 py-0.5">
                          {age}
                        </span>
                        <span className="bg-white/20 backdrop-blur-sm rounded-full px-2 py-0.5">
                          {gender}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Card Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  {/* About Section */}
                  <div className="space-y-3 flex-1">
                    {about && (
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                          About
                        </h4>
                        <p className="text-gray-700 text-xs leading-relaxed line-clamp-2 bg-gray-50 rounded-lg p-2">
                          {about}
                        </p>
                      </div>
                    )}

                    {/* Skills/Interests */}
                    {skills && skills.length > 0 && (
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Skills
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {skills.slice(0, 3).map((skill, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full text-xs font-medium">
                              {skill}
                            </span>
                          ))}
                          {skills.length > 3 && (
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                              +{skills.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-3">
                    <Link to={"/chat/" + _id} className="flex-1">
                      <button className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 text-white font-bold py-2.5 px-4 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 group">
                        <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-3 12H7v-2h10v2zm0-3H7V9h10v2zm0-3H7V6h10v2z"/>
                        </svg>
                        <span className="font-bold text-sm">Chat</span>
                      </button>
                    </Link>
                    
                    <button className="px-3 py-2.5 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg group">
                      <svg className="w-4 h-4 text-gray-600 group-hover:text-pink-500 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-pink-400/10 via-purple-400/10 to-indigo-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Connections;
