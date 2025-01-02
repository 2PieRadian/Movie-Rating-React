import { useState, useEffect } from "react";

const api_key = "fda3bf5c";

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
      const controller = new AbortController();

      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          const url = `http://www.omdbapi.com/?apikey=${api_key}&s=${query}`;
          const res = await fetch(url, { signal: controller.signal });
          const data = await res.json();

          if (!res.ok) {
            throw new Error("An error occurred while fetching the data");
          }

          if (data.Response === "False") {
            throw new Error("Movie not found!");
          }
          setMovies(data.Search);
          setError("");
        } catch (err) {
          if (err.name !== "AbortError") setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }

      if (query === "") {
        setMovies([]);
        setError("");
        return;
      }

      fetchMovies();

      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return {movies, isLoading, error};
}
