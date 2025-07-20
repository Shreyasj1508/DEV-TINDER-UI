import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Login = () => {
  const [emailId, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoginFrom, setIsLoginForm] = useState(true);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/login",
        { emailId, password },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      dispatch(addUser(res.data.user));
      return navigate("/");
    } catch (err) {
      setError(err.response?.data || "Login failed");
      console.log(err);
    }
  };

  const handleSignUp = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/signup",
        { firstName, lastName, emailId, password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data.data));
      return navigate("/profile");
    } catch (error) {
      setError(error.response?.data || "Signup failed");
      console.log(error);
    }
  };

  return (
    <>
      {/* NAVBAR */}
      <div className="navbar bg-base-100 shadow-sm">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">DevTinder</a>
        </div>

        {/* Avatar Dropdown - updated styles */}
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar mr-3 border hover:shadow-lg transition duration-200"
          >
            <div className="w-12 rounded-full">
              <img
                alt="User Avatar"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu dropdown-content mt-4 z-[1] p-4 shadow-lg bg-base-200 rounded-xl w-56 space-y-2"
          >
            <li>
              <a className="flex justify-between items-center px-2 py-2 hover:bg-base-300 rounded-lg">
                Profile <span className="badge badge-accent">New</span>
              </a>
            </li>
            <li>
              <a className="px-2 py-2 hover:bg-base-300 rounded-lg">Settings</a>
            </li>
            <li>
              <a className="px-2 py-2 text-red-600 hover:bg-red-100 rounded-lg">Logout</a>
            </li>
          </ul>
        </div>
      </div>

      {/* LOGIN / SIGNUP FORM */}
      <div className="flex justify-center my-10">
        <div className="card bg-base-300 w-96 shadow-xl">
          <div className="card-body">
            <h2 className="card-title justify-center">
              {isLoginFrom ? "Login" : "Signup"}
            </h2>
            <div>
              {!isLoginFrom && (
                <>
                  <label className="form-control w-full max-w-xs my-2">
                    <div className="label">
                      <span className="label-text">Firstname</span>
                    </div>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="input input-bordered w-full max-w-xs"
                    />
                  </label>
                  <label className="form-control w-full max-w-xs my-2">
                    <div className="label">
                      <span className="label-text">Lastname</span>
                    </div>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="input input-bordered w-full max-w-xs"
                    />
                  </label>
                </>
              )}
              <label className="form-control w-full max-w-xs my-2">
                <div className="label">
                  <span className="label-text">Email</span>
                </div>
                <input
                  type="text"
                  value={emailId}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input input-bordered w-full max-w-xs"
                />
              </label>
              <label className="form-control w-full max-w-xs my-2">
                <div className="label">
                  <span className="label-text">Password</span>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input input-bordered w-full max-w-xs"
                />
              </label>
            </div>
            <p className="text-red-500 text-center">{error}</p>
            <div className="card-actions justify-center mt-2">
              <button
                className="btn btn-primary"
                onClick={isLoginFrom ? handleLogin : handleSignUp}
              >
                {isLoginFrom ? "Login" : "Signup"}
              </button>
            </div>
            <p
              className="text-center cursor-pointer py-2"
              onClick={() => setIsLoginForm((value) => !value)}
            >
              {isLoginFrom
                ? "New user? Signup here"
                : "Existing user? Login here"}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
