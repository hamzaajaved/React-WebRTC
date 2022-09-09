import React, { useState, useEffect, useRef } from "react";

import { ReactComponent as HangupIcon } from "../../assets/icons/hangup.svg";

import "./video.css";

import { RoomConstants } from "../../constants";
import { useRTCContext } from "../../context";
import { createAnswer, createOffer, deleteOffer } from "../../helpers/firebase_helper";

const Video = (props) => {
  const { peerConnection, joinCode, setJoinCode, currentRoomState } = useRTCContext();
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

      localStreamRef.current.srcObject = localStream;
      remoteStreamRef.current.srcObject = remoteStream;

      setWebcamActive(true);

      if (currentRoomState === RoomConstants.CREATE_ROOM) {
        const callerId = await createOffer(peerConnection);
        console.log("🚀 ~ file: Video.js ~ line 47 ~ init ~ callerId", callerId)
        setJoinCode(callerId);
      }

      if (currentRoomState === RoomConstants.JOIN_ROOM) {
        createAnswer(peerConnection, joinCode);
      }

    };

    init();
  }, []);

  const handlehangUp = () => {
    deleteOffer(peerConnection, joinCode);
  };

  const handleCameraDisable = async () => {
    localStreamRef.current.srcObject.getTracks().forEach(track => track.stop())
  }

  return (
    <div className="videos">
      <video
        ref={localStreamRef}
        autoPlay
        playsInline
        className="local"
        controls={false}
        muted
      />
      <video ref={remoteStreamRef} autoPlay playsInline controls={false} className="remote" />

      <div className="buttonsContainer">
        <button
          onClick={handlehangUp}
          disabled={!webcamActive}
          className="hangup button"
        >
          <HangupIcon />
        </button>

        <button
          onClick={handleCameraDisable}
          disabled={!webcamActive}
          className="camera button"

        >
          <img className="camera-img" src={require("../../assets/icons/camera.png")} />
        </button>

      </div>
    </div>
  );
};

export default Video;
