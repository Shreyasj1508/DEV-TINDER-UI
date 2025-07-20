import { Routes, Route } from "react-router-dom";
import Body from "./Components/Body";
import Login from "./Components/Login";
import Feed from "./Components/Feed";
import { useDispatch } from "react-redux";
import { addUser } from "./utils/userSlice";
import { useEffect } from "react";
import { BASE_URL } from "./utils/constants";
import axios from "axios";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Body />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
