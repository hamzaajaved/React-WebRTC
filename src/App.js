import React from "react";
import { Routes, BrowserRouter as Router, Route } from "react-router-dom";

import "./App.css";
import { useRTCContext } from "./context";

import { Room } from "./screens/Room";
import { Video } from "./screens/Video";

function App() {
  const { currentRoomState } = useRTCContext();
  return (
    <React.Fragment>
      <Router>
        <Routes>
          {!currentRoomState.length ? (
            <Route exact path="/" element={<Room />} />
          ) : (
            <Route exact path="/" element={<Video />} />
          )}
        </Routes>
      </Router>
    </React.Fragment>
  );
}

export default App;
