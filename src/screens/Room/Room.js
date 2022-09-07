import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createAnswer,
  createOffer,
  initFirebase,
} from "../../helpers/firebase_helper";

import "./room.css";

import { useRTCContext } from "../../context";

const Room = () => {
  const navigate = useNavigate();
  const { peerConnection, joinCode, setJoinCode } = useRTCContext();

  const handleCreateRoom = async () => {
    const callerId = await createOffer(peerConnection);
    setJoinCode(callerId);
  };

  const handleJoinRoom = async () => {
    if (!joinCode) {
      alert("Please enter joining code");
      return;
    }

    createAnswer(peerConnection, joinCode);

    peerConnection.onconnectionstatechange = (event) => {
      if (peerConnection.connectionState === "disconnected") {
        hangUp();
      }
    };
    navigate(`/${joinCode}`, { replace: true });
  };

  const hangUp = async () => {
    peerConnection.close();

    if (joinCode) {
      const firestore = initFirebase();
      let roomRef = firestore.collection("calls").doc(joinCode);
      await roomRef
        .collection("answerCandidates")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            doc.ref.delete();
          });
        });
      await roomRef
        .collection("offerCandidates")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            doc.ref.delete();
          });
        });

      await roomRef.delete();
    }

    window.location.reload();
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
