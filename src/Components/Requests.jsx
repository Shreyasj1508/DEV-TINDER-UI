import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../utils/requestSlice";
import { useEffect, useState } from "react";

const Requests = () => {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();

  const reviewRequest = async (status, _id) => {
    try {
      const res = axios.post(
        BASE_URL + "/request/review/" + status + "/" + _id,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequest(_id));
    } catch (err) {}
  };

  const fetchRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
      });

      dispatch(addRequests(res.data.data));
    } catch (err) {}
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (!requests) return;

  if (requests.length === 0)
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-4">💌</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">No requests yet</h1>
          <p className="text-xl text-gray-600">You'll see connection requests here</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Connection Requests
          </h1>
          <p className="text-gray-600 text-lg">
            {requests.length} developer{requests.length !== 1 ? 's' : ''} want{requests.length === 1 ? 's' : ''} to connect
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {requests.map((request) => {
            const { _id, firstName, lastName, photoUrl, age, gender, about } =
              request.fromUserId;

            return (
              <div
                key={_id}
                className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Profile Image */}
                  <div className="md:w-1/3 h-64 md:h-auto relative overflow-hidden">
                    <img
                      alt={`${firstName} ${lastName}`}
                      className="w-full h-full object-cover"
                      src={photoUrl}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
                  </div>
                  
                  {/* Content */}
                  <div className="md:w-2/3 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h2 className="text-3xl font-bold text-gray-800">
                          {firstName} {lastName}
                        </h2>
                        {age && gender && (
                          <span className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                            {age}, {gender}
                          </span>
                        )}
                      </div>
                      
                      {about && (
                        <p className="text-gray-600 text-lg leading-relaxed mb-6">
                          {about}
                        </p>
                      )}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-4">
                      <button
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center"
                        onClick={() => reviewRequest("rejected", request._id)}
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Decline
                      </button>
                      <button
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center"
                        onClick={() => reviewRequest("accepted", request._id)}
                      >
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                        Accept
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default Requests;
