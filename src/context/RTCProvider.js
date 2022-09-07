import React, { useState } from "react";
import RTCContext from "./RTCContext";
import servers from "../data/servers";

const RTCProvider = ({ children }) => {
  const peerConnection = new RTCPeerConnection(servers);
  const [joinCode, setJoinCode] = useState("");

  return (
    <RTCContext.Provider
      value={{
        peerConnection,
        joinCode,
        setJoinCode,
      }}
    >
      {children}
    </RTCContext.Provider>
  );
};

export default RTCProvider;
