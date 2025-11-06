/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import { useDebounce } from "react-use";

const API_BASE_URL =
  "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc";
const API_KEY = import.meta.env.VITE_TMBD_API_KEY;

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debounceSearchTerm, setDebounceSearchTerm] = useState("");
  const [trendingMovies, setTrendingMovies] = useState([]);

  const BACKEND_URL = "http://localhost:4000/api/v1/movies/search";
  // **Replace the placeholder with your actual, full token**
  const API_ACCESS_TOKEN = import.meta.env.VITE_READ_ACCESS_TOKEN;

  const APIOPTIONS = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${API_ACCESS_TOKEN}`,
      accept: "application/json",
    },
  };

  useDebounce(() => setDebounceSearchTerm(searchTerm), 500, [searchTerm]);

  const fetchMovies = async (query = "", page = 1) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      // Use the full URL
      const endpoint = query
        ? `http://localhost:4000/api/v1/movies/search?searchTerm=${encodeURIComponent(
            query
          )}`
        : `http://localhost:4000/api/v1/movies/search?page=${page}`; // Default/discover path

      const response = await fetch(endpoint);

      if (!response.ok) {
        // You'll likely see a 401 Unauthorized error here if the token/headers are wrong
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.Resonse === "False") {
        setErrorMessage(data.Error || "Failed to fetch movies");
        setMovieList([]); // Clear movie list on error
        return;
      }

      setMovieList(data.results || []); // Update movie list

      if ((query && data.results) || []) {
        loadTrendingMovies();
      }
      console.log("Fetched movies:", data);
      return data; // Return the data
    } catch (error) {
      console.error("Error fetching movies:", error);
      setErrorMessage("Failed to fetch movies. Please try again later."); // Use this if it's in a component
    } finally {
      setIsLoading(false);
    }
  };

  const loadTrendingMovies = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/v1/movies/trending`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const moviesData = await response.json(); // <-- Await response.json()

      console.log("Trending movies data:", moviesData);

      setTrendingMovies(moviesData || []); // Use the parsed JSON data
    } catch (error) {
      console.error("Error loading trending movies:", error);
    }
  };

  // Call the function
  // fetchMovies();
  useEffect(() => {
    fetchMovies(debounceSearchTerm);
  }, [debounceSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  return (
    <main>
      <div className="pattern">
        <div className="wrapper">
          <header>
            <img src="./hero-img.png" alt="Hero Banner" />
            <h1>
              Find <span className="text-gradient">Movies</span> Youll enjoy
              without the Hassle
            </h1>
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </header>

          {trendingMovies.length > 0 && (
            <section className="trending">
              <h2>Trending movies</h2>

              <ul>
                {trendingMovies.map((movie, index) => (
                  <li key={movie.$id}>
                    <p>{index + 1}</p>
                    <img src={movie.posterPath} alt={movie.title} />
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="all-movies">
            <h2>All Movies</h2>
            {isLoading ? (
              <Spinner />
            ) : errorMessage ? (
              <p className="text-red-500">{errorMessage}</p>
            ) : (
              <ul>
                {movieList.map((movie) => (
                  <MovieCard key={movie.id} movie={movie}></MovieCard>
                ))}
              </ul>
            )}
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          </section>
        </div>
      </div>
    </main>
  );
};

export default App;
