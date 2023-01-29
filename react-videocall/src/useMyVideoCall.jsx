import React from "react";
import useVideoCall from "./useVideoCall";

function useMyVideoCall() {
  return useVideoCall({
    onCallError: (err) => {
      console.log("error in call");
      console.error(err);
    },
    onPeerError: (err) => {
      console.log("error from peer");
      console.error(err);
    },
    onDataError: (err) => {
      console.log("data error occured");
      console.error(err);
    },
    onDataReceived: (data) => {
      console.log("data received");
      console.log(data);
      console.log(typeof data);
    },
  });
}

export default useMyVideoCall;
