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
  });
}

export default useMyVideoCall;
