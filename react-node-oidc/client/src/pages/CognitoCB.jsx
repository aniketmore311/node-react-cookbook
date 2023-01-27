import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useCostomCognitoLogin from "../Components/useCostomCognitoLogin";

function CognitoCB() {
  const navigate = useNavigate();
  const { processAccessToken, status } = useCostomCognitoLogin();

  async function getToken({ code }) {
    const resp = await fetch("http://localhost:8080/auth/cognito/login", {
      method: "POST",
      body: JSON.stringify({ code }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await resp.json();
    const accessToken = data.accessToken;
    return accessToken;
  }

  useEffect(() => {
    (async () => {
      await processAccessToken({ getToken });
      navigate("/");
    })();
  }, [navigate,processAccessToken]);

  return (
    <>
      {status === "idle" && <p>idle...</p>}
      {status === "loading" && <p>loading...</p>}
      {status === "success" && <p>login successful</p>}
    </>
  );
}

export default CognitoCB;
