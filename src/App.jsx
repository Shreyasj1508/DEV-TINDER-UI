import { Routes, Route } from "react-router-dom";
import Body from "./Components/Body";
import Login from "./Components/Login";
import Profile from "./Components/Profile";
import Feed from "./Components/Feed";
import "./index.css";
import Premium from "./Components/Premium";
import Requests from "./Components/Requests";
import Connections from "./Components/Connections";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Body />} />
      <Route path="/" element={<Feed />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/premium" element={<Premium />} />
      <Route path="/requests" element={<Requests />} />
      <Route path="/connections" element={<Connections />} />
    </Routes>
  );
}

export default App;
