//@ts-check
import React from "react";
import config from "../config";
import useCognitoLogin from "./useCognitoLogin";

function useCostomCognitoLogin() {
  return useCognitoLogin({
    client_id: config.cognitoClientId,
    redirect_uri: "http://localhost:3000/auth/cognito/cb",
    logout_uri: "http://localhost:3000/logout",
    authorization_endpoint: `${config.congnitoBaseURL}/oauth2/authorize`,
    logout_endpoint: `${config.congnitoBaseURL}/logout`,
  });
}

export default useCostomCognitoLogin;
