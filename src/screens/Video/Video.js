import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

import "./video.css";

import { useRTCContext } from "../../context";

const Video = (props) => {
  const { roomId } = useParams();
  const { peerConnection } = useRTCContext();
  const [webcamActive, setWebcamActive] = useState(false);
  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      const localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream);
      });

      const remoteStream = new MediaStream();

      peerConnection.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
          remoteStream.addTrack(track);
        });
      };

      localStreamRef.current = localStream;
      remoteStreamRef.current = remoteStream;

      setWebcamActive(true);
    };

    init();
  }, []);

  return <div>Video</div>;
};

export default Video;
