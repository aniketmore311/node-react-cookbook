import React, { useState, useEffect, useCallback } from "react";

function useMutation({ mutationFn, onSuccess, onError }) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = useCallback((...args) => {
    (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await mutationFn(...args);
        setData(res);
        onSuccess(res);
      } catch (err) {
        setError(err);
        onError(err);
      }
      setIsLoading(false);
    })();
  }, []);

  console.log(isLoading)
//   console.log(data, isLoading, error, mutate);

  return { data, isLoading, error, mutate };
}

export default useMutation;
