import React, { useEffect } from "react";
import useCostomCognitoLogin from "../Components/useCostomCognitoLogin";

function Home() {
  const { logout, login, user } = useCostomCognitoLogin();

  return (
    <>
      {user && (
        <div>
          <p>welcome {user.name}</p>
          <p>{user.email}</p>
          <button
            onClick={() => {
              logout();
            }}
          >
            logout
          </button>
        </div>
      )}
      {!user && (
        <button
          onClick={() => {
            login();
          }}
        >
          login
        </button>
      )}
    </>
  );
}

export default Home;
