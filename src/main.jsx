import { Buffer } from 'buffer';
window.Buffer = window.Buffer || Buffer;
window.global = window;
window.process = { env: {} };
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// test changessss