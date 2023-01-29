import React, { useEffect, useRef, useState } from "react";
import Peer from "peerjs";

function VideoCall() {
  const [peer, setPeer] = useState(null);
  const [peerId, setPeerId] = useState("");
  const [localStream, setLocalStream] = useState(null);
  const localVideoRef = useRef();

  const [remoteStream, setRemoteStream] = useState(null);
  const [remotePeerId, setRemotePeerId] = useState("");
  const [call, setCall] = useState();
  const remoteVideoRef = useRef();

  const onCallReceiveRef = useRef();

  onCallReceiveRef.current = (call) => {
    if (localStream) {
      if (call) {
        call.answer(localStream);
        call.on("stream", (stream) => {
          setRemoteStream(stream);
        });
        call.on("close", () => {
          console.log("call closed");
          setRemoteStream(null);
        });
        setCall(call);
      } else {
        console.log("call is not defined");
      }
    } else {
      console.log("local stream is not defined");
    }
  };

  useEffect(() => {
    if (peer == null) {
      const peerInstance = new Peer(
        "aniketmore" + Math.floor(100 * Math.random())
      );
      peerInstance.on("open", (id) => {
        setPeerId(id);
        setPeer(peerInstance);
      });
      //when call is received
      peerInstance.on("call", (call) => {
        onCallReceiveRef.current(call);
      });

      peerInstance.on("error", (err) => {
        console.log(err);
      });
    } else {
      console.log("peer already defined");
    }
  }, [peer, setPeerId, setPeer]);

  useEffect(() => {
    if (localStream) {
      localVideoRef.current.srcObject = localStream;
      localVideoRef.current.muted = true;
      localVideoRef.current.play();
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
      remoteVideoRef.current.play();
    }
  }, [remoteStream]);

  const setStream = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setLocalStream(stream);
      })
      .catch((err) => console.log(err));
  };

  const unsetStream = () => {
    localStream.getTracks().forEach((track) => {
      track.stop();
    });
    setLocalStream(null);
  };

  //when call is made
  const callPeer = () => {
    if (peer && localStream) {
      const call = peer.call(remotePeerId, localStream);
      if (!call) {
        throw new Error("call not connected");
      }
      console.log("call starting");
      setCall(call);
      call.on(
        "stream",
        (stream) => {
          setRemoteStream(stream);
        },
        (err) => {
          console.log(err);
        }
      );
      call.on("close", () => {
        console.log("call closed");
        setRemoteStream(null);
      });
    }
  };

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
            setStream();
          }}
        >
          set stream
        </button>
      )}
      {localStream && (
        <button
          onClick={() => {
            unsetStream();
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
              callPeer();
            }}
          >
            call
          </button>
        </>
      )}
      {remoteStream && (
        <button
          onClick={(e) => {
            call.close();
            unsetStream();
            setRemoteStream(null);
          }}
        >
          end call
        </button>
      )}
    </div>
  );
}

export default VideoCall;
