import React, { useEffect, useRef, useState } from "react";
import Peer from "peerjs";

function useVideoCall({
  onPeerError,
  onCallError,
  onDataReceived,
  onDataError,
}) {
  const [peer, setPeer] = useState(null);
  const [peerId, setPeerId] = useState("");
  const [localStream, setLocalStream] = useState(null);
  const localVideoRef = useRef();

  const [remoteStream, setRemoteStream] = useState(null);
  const [remoteDataConn, setRemoteDataConn] = useState(null);
  const [call, setCall] = useState();
  const remoteVideoRef = useRef();

  const onCallReceiveRef = useRef();
  const onDataConnReceiveRef = useRef();

  //received call
  onCallReceiveRef.current = (call) => {
    if (localStream) {
      if (call) {
        setCall(call);

        call.answer(localStream);

        call.on("stream", (stream) => {
          console.trace("stream received from call");
          setRemoteStream(stream);
        });

        call.on("close", () => {
          console.trace("call closed");
          setRemoteStream(null);
          setCall(null);
        });

        call.on("error", (err) => {
          console.trace("error in call");
          onCallError(err);
        });
      } else {
        console.error("call is not defined");
      }
    } else {
      console.error("local stream is not defined");
    }
  };
  //when other user initializes data connection
  onDataConnReceiveRef.current = (dataConn) => {
    setRemoteDataConn(dataConn);
    dataConn.on("data", (data) => {
      console.trace("data received");
      onDataReceived(data);
    });
    dataConn.on("open", () => {
      console.trace("data conn open");
    });
    dataConn.on("close", () => {
      console.trace("data connection closed");
      setRemoteDataConn(null);
    });
    dataConn.on("error", (err) => {
      console.trace("data conn error");
      onDataError(err);
    });
  };

  const initiate = (peerId) => {
    const peerInstance = new Peer(peerId);
    peerInstance.on("open", (id) => {
      console.trace("connection open");
      setPeerId(id);
      setPeer(peerInstance);
    });

    peerInstance.on("connection", (dataConnection) => {
      console.trace("data connection received");
      onDataConnReceiveRef.current(dataConnection);
    });

    //when call is received
    peerInstance.on("call", (call) => {
      console.trace("call received");
      onCallReceiveRef.current(call);
    });

    peerInstance.on("close", () => {
      console.trace("peer closed");
    });

    peerInstance.on("disconnected", () => {
      console.trace("peer disconnected");
    });

    peerInstance.on("error", (err) => {
      console.trace("peer error occured");
      onPeerError(err);
    });
  };

  const cleanup = () => {
    endStream();
    if (remoteDataConn) {
      remoteDataConn.close();
      setRemoteDataConn(null);
    }
    if (call) {
      call.close();
      setCall(null);
    }
    if (peer && !peer.destroyed) {
      peer.destroy();
      setPeer(null);
      setPeerId("");
    }
    setLocalStream(null);
    setRemoteStream(null);
  };

  //sync videoref with stream
  useEffect(() => {
    if (localStream) {
      localVideoRef.current.srcObject = localStream;
      localVideoRef.current.muted = true;
      localVideoRef.current.play();
    }
  }, [localStream]);

  //sync videoref with stream
  useEffect(() => {
    if (remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
      remoteVideoRef.current.play();
    }
  }, [remoteStream]);

  const startStream = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setLocalStream(stream);
      })
      .catch((err) => console.log(err));
  };

  const endStream = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        track.stop();
      });
      setLocalStream(null);
    }
  };

  const endCall = () => {
    if (call) {
      call.close();
      setCall(null);
    }
    if (remoteDataConn) {
      remoteDataConn.close();
      setRemoteDataConn(null);
    }
    setRemoteStream(null);
  };

  //when call is made
  const startCall = (peerId) => {
    if (peer) {
      if (localStream) {
        //obtain call and setup
        const call = peer.call(peerId, localStream);
        if (!call) {
          throw new Error("call not connected");
        }
        onCallReceiveRef.current(call);
        //obtain dataConnection and setup
        const dataConn = peer.connect(peerId);
        if (!dataConn) {
          throw new Error("data connection is not defined");
        }
        onDataConnReceiveRef.current(dataConn);
      } else {
        console.error("localStream is not defined");
      }
    } else {
      console.error("peer is not defined");
    }
  };

  const sendData = (data) => {
    if (remoteDataConn) {
      remoteDataConn.send(data);
    } else {
      throw new Error("remote data connection not established");
    }
  };

  return {
    localStream,
    localVideoRef,
    remoteStream,
    remoteVideoRef,
    peerId,
    initiate,
    cleanup,
    startStream,
    endStream,
    startCall,
    sendData,
    endCall,
  };
}

/**
 * notes on using
 * when use comes on the page use initiate to create a peer js instance
 * to start his camera use startStream
 * this will populate localStream
 * to stop his camera use endStream this will set is back to null
 * to call someone use startCall with their id
 * to end the call use endCall
 * at the end while leaving use cleanup
 * use the localVideoRef and remoteVideoRef to show videos
 */
export default useVideoCall;
