import { useState, useEffect, useCallback } from "react";

function useQuery({ queryFn, deps }) {
  if (deps == undefined) {
    deps = [];
  }
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    reload()
  }, deps);

  const reload = useCallback(() => {
    (async () => {
      setIsLoading(true);
      setIsFetching(true);
      setError(null);

      try {
        const res = await queryFn({ deps });
        setData(res);
      } catch (err) {
        setError(err);
      }

      setIsLoading(false);
      setIsFetching(false);
    })();
  }, deps);

  const refetch = useCallback(() => {
    (async () => {
      setIsFetching(true);
      setError(null);

      try {
        const res = await queryFn({ deps });
        setData(res);
      } catch (err) {
        setError(err);
      }

      setIsFetching(false);
    })();
  }, deps);


  return { data, isLoading, isFetching, error, reload, refetch };
}

export default useQuery;
