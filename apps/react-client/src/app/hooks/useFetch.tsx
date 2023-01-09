import { useState, useEffect, useCallback } from 'react';

interface useFetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: any;
}

const useFetch = (url: string) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(
    async (options: useFetchOptions) => {
      if (options.method === 'POST' || options.method === 'PUT') {
        options.body = JSON.stringify(options.body);
        options.headers = {
          'Content-Type': 'application/json',
        };
      }
      setLoading(true);
      setError(null);
      return await fetch(url, options)
        .then((response) => {
          if (!response.ok) {
            throw new Error(response.statusText);
          }
          return response.json()
        })
        .then((response) => setData(response))
        .catch((err) => setError(err))
        .finally(() => setLoading(false));
    },
    [url]
  );

  return { data, error, loading, fetchData };
};

export default useFetch;
