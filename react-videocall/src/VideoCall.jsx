import React, { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import useMyVideoCall from "./useMyVideoCall";

const myPeerId = "aniketmore" + Math.floor(100 * Math.random());

function VideoCall() {
  const {
    initiate,
    cleanup,
    startStream,
    endStream,
    startCall,
    endCall,
    localVideoRef,
    localStream,
    remoteStream,
    remoteVideoRef,
    peerId,
    sendData,
  } = useMyVideoCall();
  const [remotePeerId, setRemotePeerId] = useState("");

  useEffect(() => {
    initiate(myPeerId);
    return () => {
      cleanup();
    };
  }, []);

  return (
    <div>
      <br />
      {localStream && (
        <video
          id="myVideo"
          width="320"
          height="240"
          controls
          ref={localVideoRef}
        ></video>
      )}
      {remoteStream && (
        <video
          id="remoteVideo"
          width="320"
          height="240"
          controls
          ref={remoteVideoRef}
        ></video>
      )}
      <br />
      {peerId && <p>your id: {peerId}</p>}

      <br />
      {!localStream && (
        <button
          onClick={() => {
            startStream();
          }}
        >
          set stream
        </button>
      )}
      {localStream && (
        <button
          onClick={() => {
            endStream();
          }}
        >
          unset stream
        </button>
      )}
      <br />
      <br />
      {!remoteStream && (
        <>
          <input
            type="text"
            value={remotePeerId}
            onChange={(e) => {
              setRemotePeerId(e.target.value);
            }}
          />
          <button
            onClick={(e) => {
              startCall(remotePeerId);
            }}
          >
            call
          </button>
        </>
      )}
      {remoteStream && (
        <button
          onClick={(e) => {
            endCall();
          }}
        >
          end call
        </button>
      )}
      <br />
      <button
        onClick={() => {
          cleanup();
        }}
      >
        cleanup
      </button>
      <br />
      <br />
      <button
        onClick={() => {
          sendData("ping from " + myPeerId);
        }}
      >
        ping
      </button>
    </div>
  );
}

export default VideoCall;
