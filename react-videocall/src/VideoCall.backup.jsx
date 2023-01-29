import React, { useState, useEffect, useRef } from "react";
import Peer from "peerjs";

const VideoCall = () => {
  const [peer, setPeer] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [connectedPeer, setConnectedPeer] = useState(null);
  const [peerId, setPeerId] = useState(null);
  const peerIdInput = useRef();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        console.log(stream)
        setLocalStream(stream);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (!peer) {
      const newPeer = new Peer();
      newPeer.on("open", (id) => {
        console.log(`My Peer ID is: ${id}`);
        setPeerId(id);
      });
      setPeer(newPeer);
    }
  }, [peer, setPeerId]);

  useEffect(() => {
    if (peer) {
      peer.on("call", (call) => {
        call.answer(localStream);
        call.on("stream", (remoteStream) => {
          setRemoteStream(remoteStream);
        });
      });
    }
  }, [peer, localStream]);

  const connectToPeer = (peerId) => {
    const call = peer.call(peerId, localStream);
    setConnectedPeer(peerId);
    call.on("stream", (remoteStream) => {
      setRemoteStream(remoteStream);
    });
  };

  return (
    <div>
      {peerId && <p>your id: {peerId}</p>}
      {remoteStream && <video src={remoteStream} autoPlay={true} />}
      {localStream && <video src={localStream} autoPlay={true} muted={true} />}
      {!connectedPeer && (
        <div>
          <input type="text" placeholder="Enter Peer ID" ref={peerIdInput} />
          <button onClick={() => connectToPeer(peerIdInput.current.value)}>
            Connect
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoCall;
