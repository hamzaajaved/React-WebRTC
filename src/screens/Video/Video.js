import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

import { ReactComponent as HangupIcon } from "../../assets/icons/hangup.svg";
import { ReactComponent as MoreIcon } from "../../assets/icons/more-vertical.svg";
import { ReactComponent as CopyIcon } from "../../assets/icons/copy.svg";

import "./video.css";

import { useRTCContext } from "../../context";
import { deleteOffer } from "../../helpers/firebase_helper";

const Video = (props) => {
  const { roomId } = useParams();
  const { peerConnection, joinCode } = useRTCContext();
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

  const handlehangUp = () => {
    deleteOffer(peerConnection, joinCode);
  };

  return (
    <div className="videos">
      <video
        ref={localStreamRef}
        autoPlay
        playsInline
        className="local"
        muted
      />
      <video ref={remoteStreamRef} autoPlay playsInline className="remote" />

      <div className="buttonsContainer">
        <button
          onClick={handlehangUp}
          disabled={!webcamActive}
          className="hangup button"
        >
          <HangupIcon />
        </button>
        <div tabIndex={0} role="button" className="more button">
          <MoreIcon />
          <div className="popover">
            <button
              onClick={() => {
                navigator.clipboard.writeText(roomId);
              }}
            >
              <CopyIcon /> Copy joining code
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Video;
