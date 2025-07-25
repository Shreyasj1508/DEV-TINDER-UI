import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import { Link } from "react-router-dom";

const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const dispatch = useDispatch();
  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnections(res.data.data));
    } catch (err) {
      // Handle Error Case
      console.error(err);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections) return;

  if (connections.length === 0) 
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-4">💬</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">No connections yet</h1>
          <p className="text-xl text-gray-600">Start swiping to make connections!</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Your Connections
          </h1>
          <p className="text-gray-600 text-lg">
            You have {connections.length} connection{connections.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {connections.map((connection) => {
            const { _id, firstName, lastName, photoUrl, age, gender, about } = connection;

            return (
              <div
                key={_id}
                className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    alt={`${firstName} ${lastName}`}
                    className="w-full h-full object-cover"
                    src={photoUrl}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-2xl font-bold text-gray-800">
                      {firstName} {lastName}
                    </h2>
                    {age && gender && (
                      <span className="text-gray-600 text-sm bg-gray-100 px-3 py-1 rounded-full">
                        {age}, {gender}
                      </span>
                    )}
                  </div>
                  
                  {about && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{about}</p>
                  )}
                  
                  <Link to={"/chat/" + _id} className="block">
                    <button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95">
                      💬 Start Chat
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default Connections;
