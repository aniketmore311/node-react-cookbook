import jwtDecode from "jwt-decode";
import React, { useEffect, useState, useCallback } from "react";
/**
 * @typedef {Object} useCognitoLoginProps
 * @property {string} client_id
 * @property {string} redirect_uri
 * @property {string} logout_uri
 * @property {string} authorization_endpoint
 * @property {string} logout_endpoint
 */

/**
 *
 * @param {useCognitoLoginProps} props
 * @returns
 */
function useCognitoLogin(props) {
  if (!props) {
    props = {};
  }
  const tokenKey = "access_token";
  const [loginURL, setLoginURL] = useState(null);
  const [logoutURL, setLogoutURL] = useState(null);

  console.log({ loginURL, logoutURL });

  let userData = null;
  const token = localStorage.getItem(tokenKey);
  if (token) {
    userData = jwtDecode(token);
  }
  const [user, setUser] = useState(userData);
  //possible states are "idle"|"loading" | "success" | "error"
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    if (props.client_id && props.redirect_uri && props.authorization_endpoint) {
      const urlParams = new URLSearchParams([
        ["client_id", props.client_id],
        ["response_type", "code"],
        ["scope", "openid email profile"],
        ["redirect_uri", props.redirect_uri],
      ]);
      const genLoginUrl = `${
        props.authorization_endpoint
      }?${urlParams.toString()}`;
      setLoginURL(genLoginUrl);
    }
  }, [props.client_id, props.redirect_uri, props.authorization_endpoint]);

  useEffect(() => {
    if (props.client_id && props.logout_endpoint && props.logout_uri) {
      const urlParams = new URLSearchParams([
        ["client_id", props.client_id],
        ["logout_uri", props.redirect_uri],
        ["redirect_uri", props.redirect_uri],
        ["response_type", "code"],
        ["scope", "openid email profile"],
      ]);
      const genLogoutUrl = `${props.logout_endpoint}?${urlParams.toString()}`;
      setLogoutURL(genLogoutUrl);
    }
  }, [
    props.client_id,
    props.logout_endpoint,
    props.logout_uri,
    props.redirect_uri,
  ]);

  const processAccessToken = useCallback(async ({ getToken }) => {
    setStatus("loading");
    const code = new URLSearchParams(window.location.href.split("?")[1]).get(
      "code"
    );
    if (code === null || code === undefined) {
      throw new Error("code not found in url");
    }
    const accessToken = await getToken({ code });
    const userData = jwtDecode(accessToken);
    console.log({ accessToken, userData });
    //
    localStorage.setItem("access_token", accessToken);
    setUser(userData);
    setStatus("success");
  }, []);

  const logout = useCallback(async () => {
    localStorage.clear("access_token");
    setUser(null);
    setStatus("idle");
    window.location.href = logoutURL;
  }, [logoutURL]);

  const login = useCallback(async () => {
    window.location.href = loginURL;
  }, [loginURL]);

  return {
    loginURL,
    logoutURL,
    user,
    processAccessToken,
    logout,
    login,
    status,
  };
}

export default useCognitoLogin;
