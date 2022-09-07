import React from "react";
import { Routes, BrowserRouter as Router, Route } from "react-router-dom";

import "./App.css";

import { Room } from "./screens/Room";
import { Video } from "./screens/Video";

function App() {
  return (
    <React.Fragment>
      <Router>
        <Routes>
          <Route exact path="/" element={<Room />} />
          <Route exact path="/:roomId" element={<Video />} />
        </Routes>
      </Router>
    </React.Fragment>
  );
}

export default App;
