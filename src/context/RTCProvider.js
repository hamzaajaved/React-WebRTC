import React from "react";
import RTCContext from "./RTCContext";
import servers from "../data/servers";

const RTCProvider = ({ children }) => {
  const pc = new RTCPeerConnection(servers);

  return <RTCContext.Provider value={{ pc }}>{children}</RTCContext.Provider>;
};

export default RTCProvider;
