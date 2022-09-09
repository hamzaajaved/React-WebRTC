import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  checkIfUserExists,
  createAnswer,
  createOffer,
  deleteOffer,
} from "../../helpers/firebase_helper";

import "./room.css";

import { useRTCContext } from "../../context";

const Room = (props) => {
  const navigate = useNavigate();
  const { peerConnection, joinCode, setJoinCode } = useRTCContext();


  const handleCreateRoom = async () => {
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

    const callerId = await createOffer(peerConnection);
    navigate(`/${callerId}`, { replace: true });
    setJoinCode(callerId);
  };

  const handleJoinRoom = async () => {
    if (!joinCode) {
      alert("Please enter joining code");
      return;
    }

    const userExist = await checkIfUserExists(joinCode)

    if (!userExist) {
      alert("Please enter a valid roomId!");
    } else {
      createAnswer(peerConnection, joinCode);

      peerConnection.onconnectionstatechange = (event) => {
        if (peerConnection.connectionState === "disconnected") {
          hangUp();
        }
      };
      navigate(`/${joinCode}`, { replace: true });
    }
  };

  const hangUp = async () => {
    deleteOffer(peerConnection, joinCode);
  };

  return (
    <div id="lobby-container">
      <div id="form-container">
        <div id="form__container__header">
          <p>👋 Create OR Join a Room</p>
        </div>
        <div id="form__content__wrapper">
          <input
            placeholder="Join a Room"
            type="text"
            name="invite_link"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
          />
          <div id="lobby-btn__container">
            <button
              id="lobby-container__btn"
              type="submit"
              onClick={handleCreateRoom}
            >
              Create Room
            </button>
            <button
              id="lobby-container__btn"
              type="submit"
              onClick={handleJoinRoom}
            >
              Join Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Room;
