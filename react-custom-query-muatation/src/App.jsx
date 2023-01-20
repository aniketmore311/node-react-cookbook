import React from "react";
import { useState } from "react";
import useMutation from "./hooks/useMutation";
import useQuery from "./hooks/useQuery";

function sleep(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, ms);
  });
}

function App() {
  const [id, setId] = useState(0);
  const [idOne, setIdOne] = useState(1);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const { isLoading, isFetching, data, error, refetch, reload } = useQuery({
    queryFn: async ({ deps }) => {
      const id = deps[0];
      const resp = await fetch(`http://localhost:3000/notes`);
      if (!resp.ok) {
        const err = new Error("fetching error");
        err.statusCode = resp.status;
        throw err;
      }
      const data = await resp.json();
      await sleep(2000);
      return data;
    },
    deps: [],
  });

  const idOneData = useQuery({
    queryFn: async ({ deps }) => {
      const id = deps[0];
      const resp = await fetch(`http://localhost:3000/notes/${id}`);
      if (!resp.ok) {
        const err = new Error("fetching error");
        err.statusCode = resp.status;
        throw err;
      }
      const data = await resp.json();
      await sleep(2000);
      return data;
    },
    deps: [idOne],
  });

  const mutationData = useMutation(
    {
      mutationFn: async ({ id, title, content }, name) => {
        console.log(name);
        const resp = await fetch(`http://localhost:3000/notes`, {
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id, title, content }),
          method: "POST",
        });
        if (!resp.ok) {
          throw new Error("mutation error");
        }
        const data = await resp.json();
        await sleep(1500);
        return data;
      },
      onError: (err) => {
        console.log("error in mutation");
        console.log(err);
        setId(0);
        setTitle("");
        setContent("");
      },
      onSuccess: (data) => {
        console.log("data from mutation");
        console.log(data);
        refetch();
        setId(0);
        setTitle("");
        setContent("");
      },
    },
    [id, title, content]
  );

  return (
    <div>
      {!isLoading && !error && (
        <p>
          <code>{JSON.stringify(data, null, 2)}</code>
        </p>
      )}
      {isLoading && <p>loading...</p>}
      {isFetching && <p>fetching...</p>}
      {error && <p>{error.stack}</p>}
      <button
        onClick={() => {
          refetch();
        }}
      >
        refetch
      </button>
      <br />
      <button
        onClick={() => {
          reload();
        }}
      >
        reload
      </button>
      <br />
      <input
        type="text"
        name="id"
        id="id"
        value={id}
        onChange={(e) => {
          setId(e.target.value);
        }}
      />
      <br />
      <input
        type="text"
        name="id"
        id="id"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
        }}
      />
      <br />
      <input
        type="text"
        name="id"
        id="id"
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
        }}
      />
      <br />
      <button
        onClick={() => {
          mutationData.mutate({ id, title, content }, "aniket...");
        }}
      >
        {mutationData.isLoading && "loading.."}
        {!mutationData.isLoading && "add note"}
      </button>
      <br />
      <br />
      <input
        type="text"
        name="id_one"
        id="id_one"
        value={idOne}
        onChange={(e) => {
          setIdOne(e.target.value);
        }}
      />
      {!idOneData.isLoading && !idOneData.error && (
        <p>{JSON.stringify(idOneData.data)}</p>
      )}
      {idOneData.isLoading && <p>loading...</p>}
      {idOneData.isFetching && <p>fetching...</p>}
    </div>
  );
}

export default App;
