/* eslint-disable react/prop-types */
import "./index.css";
import { useEffect, useState } from "react";
import StarRating from "./StarRating";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const api_key = "fda3bf5c";

export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedID, setSelectedID] = useState(null);

  function handleCloseMovieDetails() {
    setSelectedID(null);
  }

  function handleAddWatchedMovie(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

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
          setError("")
        } catch (err) {
          if (err.name !== 'AbortError')
            setError(err.message);
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
      }
    },
    [query]
  );

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>

      <Content>
        <Box>
          {isLoading && <Loading />}
          {!isLoading && !error && (
            <MovieList
              movies={movies}
              selectedID={selectedID}
              setSelectedID={setSelectedID}
            />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>

        <Box>
          {selectedID ? (
            <MovieDetails
              selectedID={selectedID}
              setSelectedID={setSelectedID}
              onCloseMovieDetails={handleCloseMovieDetails}
              onAddWatchedMovie={handleAddWatchedMovie}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Content>
    </>
  );
}

function Loading() {
  return <p className="loader">Loading...</p>;
}

function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>⛔</span> {message}
    </p>
  );
}

function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}

// NavBar
function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function Search({ query, setQuery }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

function NumResults({ movies }) {
  return (
    <div className="num-results">
      {movies.length > 0 && (
        <p className="num-results" style={{ padding: "3px 10px" }}>
          Found <strong>{movies.length}</strong> results
        </p>
      )}
    </div>
  );
}

function Content({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

function MovieList({ movies, selectedID, setSelectedID, onAddWatchedMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie
          movie={movie}
          key={movie.imdbID}
          selectedID={selectedID}
          setSelectedID={setSelectedID}
          onAddWatchedMovie={onAddWatchedMovie}
        />
      ))}
    </ul>
  );
}

function Movie({ movie, selectedID, setSelectedID }) {
  return (
    <li
      onClick={() => {
        selectedID == movie.imdbID
          ? setSelectedID(null)
          : setSelectedID(movie.imdbID);
      }}
    >
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function MovieDetails({
  selectedID,
  onAddWatchedMovie,
  onCloseMovieDetails,
  watched,
}) {
  const [movieDetail, setMovieDetail] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState(0);

  // Creating a new array of watched movies' imdbIDs and then checking if the selected movie is already watched
  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedID);
  // Getting the rating set by the user to each movie object in the 'watched' movies array of movies objects
  const watchedMovieUserRating = watched.find(
    (movie) => movie.imdbID == selectedID
  )?.userRating;

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movieDetail;

  useEffect(
    function () {
      // Common function to run for both Mount and CleanUp function
      function keyListener(e) {
        if (e.key == "Escape") {
          onCloseMovieDetails();
        }
      }

      document.addEventListener("keydown", keyListener);

      return function () {
        document.removeEventListener("keydown", keyListener);
      };
    },
    [onCloseMovieDetails]
  );

  useEffect(
    function () {
      async function getMovieDetails() {
        setIsLoading(true);
        const url = `http://www.omdbapi.com/?apikey=${api_key}&i=${selectedID}`;
        const res = await fetch(url);
        const data = await res.json();

        setMovieDetail(data);
        setIsLoading(false);
      }

      getMovieDetails();
    },
    [selectedID]
  );

  useEffect(
    function () {
      if (!title) return;
      document.title = title;

      return function () {
        document.title = "usePopcorn";
      };
    },
    [title]
  );

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedID,
      imdbRating: Number(imdbRating),
      poster,
      runtime: Number(runtime.split(" ")[0]),
      title,
      userRating,
      year,
    };

    onAddWatchedMovie(newWatchedMovie);
  }

  return (
    <div className="details">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovieDetails}>
              <span className="back-arrow">&larr;</span>
            </button>

            <img src={poster} alt={`Poster of ${title}`} />

            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDb Rating
              </p>
            </div>
          </header>

          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={30}
                    setOutsideRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      + Add to list
                    </button>
                  )}{" "}
                </>
              ) : (
                <p>{`Already watched ✅ - You gave this movie a rating of ⭐ ${watchedMovieUserRating} stars`}</p>
              )}
            </div>

            <p>
              <em>&quot;{plot}&quot;</em>
            </p>
            <p>
              Starring <b>{actors}</b>
            </p>
            <p>
              Directed by <b>{director}</b>
            </p>
          </section>
        </>
      )}
    </div>
  );
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime.toFixed(2)} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedMoviesList({ watched, onDeleteWatched }) {
  return (
    <ul className="list" style={{ height: "calc(100% - 109px)" }}>
      {watched.map((movie) => (
        <WatchedMovie
          movie={movie}
          key={movie.imdbID}
          onDeleteWatched={onDeleteWatched}
        />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie, onDeleteWatched }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>

        <button
          className="btn-delete"
          onClick={() => onDeleteWatched(movie.imdbID)}
        >
          &#10006;
        </button>
      </div>
    </li>
  );
}
