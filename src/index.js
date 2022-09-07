import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { RTCProvider } from "./context";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <RTCProvider>
    <App />
  </RTCProvider>
);

reportWebVitals();
