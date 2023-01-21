import axios from "axios";

function App() {
  return (
    <div>
      <p>react app</p>
      <br />
      <br />
      <p>fetch</p>
      <button
        onClick={async () => {
          const resp = await fetch("http://localhost:8080/login", {
            method: "POST",
            body: JSON.stringify({
              username: "aniket",
              password: "password",
            }),
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          });
          const text = await resp.text();
          console.log(text);
        }}
      >
        login
      </button>
      <br />
      <button
        onClick={async () => {
          const resp = await fetch("http://localhost:8080/profile", {
            credentials: "include",
          });
          const text = await resp.text();
          console.log(text);
        }}
      >
        get profile
      </button>
      <br />
      <br />
      <p>axios</p>
      <button
        onClick={async () => {
          const resp = await axios.post(
            "http://localhost:8080/login",
            {
              username: "aniket",
              password: "password",
            },
            {
              withCredentials: true,
            }
          );
          console.log(resp.data);
        }}
      >
        login
      </button>
      <br />
      <button
        onClick={async () => {
          const resp = await axios.get("http://localhost:8080/profile", {
            withCredentials: true,
          });
          console.log(resp.data);
        }}
      >
        get profile
      </button>
    </div>
  );
}

export default App;
