import React, { useState } from "react";
import UserCard from "./userCard";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

const EditProfile = ({ user }) => {
  const [firstName, setFirstname] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [photoURL, setPhotoURL] = useState(user.photoURL);
  const [age, setAge] = useState(user.age || "");
  const [gender, setGender] = useState(user.gender);
  const [about, setAbout] = useState(user.about);
  const [skills, setSkills] = useState(user.skills || []);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const dispatch = useDispatch();

  const saveProfile = async () => {
    //clearing the errors
    setError("");
    try {
      const res = await axios.post(
        BASE_URL + "/profile/edit",
        {
          firstName,
          lastName,
          photoURL,
          age,
          gender,
          about,
          skills,
        },
        {
          withCredentials: true,
        }
      );
      dispatch(addUser(res.data.data));
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (error) {
      setError(error.response.data);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Edit Your Profile
            </h1>
            <p className="text-gray-600 text-lg">Update your information to attract the right connections</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
            {/* Form Section */}
            <div className="lg:w-1/2">
              <div className="bg-white rounded-3xl shadow-2xl p-8">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstname(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-200 outline-none"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-200 outline-none"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Age
                      </label>
                      <input
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-200 outline-none"
                        placeholder="25"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Gender
                      </label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-200 outline-none"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Others">Others</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Profile Photo URL
                    </label>
                    <input
                      type="url"
                      value={photoURL}
                      onChange={(e) => setPhotoURL(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-200 outline-none"
                      placeholder="https://example.com/your-photo.jpg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Skills (comma separated)
                    </label>
                    <input
                      type="text"
                      value={Array.isArray(skills) ? skills.join(", ") : skills}
                      onChange={(e) => setSkills(e.target.value.split(",").map(skill => skill.trim()))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-200 outline-none"
                      placeholder="JavaScript, React, Node.js, Python"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      About You
                    </label>
                    <textarea
                      rows="4"
                      value={about}
                      onChange={(e) => setAbout(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-200 outline-none resize-none"
                      placeholder="Tell us about yourself, your interests, and what you're looking for..."
                    />
                  </div>

                  {error && (
                    <div className="p-4 bg-red-100 border border-red-300 text-red-700 rounded-xl text-sm">
                      {error}
                    </div>
                  )}

                  <button
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95"
                    onClick={saveProfile}
                  >
                    Save Profile
                  </button>
                </div>
              </div>
            </div>

            {/* Preview Section */}
            <div className="lg:w-1/2 flex justify-center">
              <div className="sticky top-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Preview</h3>
                <UserCard
                  user={{ firstName, lastName, photoURL, about, age, gender, skills }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {showToast && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Profile saved successfully!
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfile;
