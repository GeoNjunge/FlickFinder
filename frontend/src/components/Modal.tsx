import React from "react";
import Stylesheet from "react";

const FullMoviePage = () => {
  const movieDetails = {
    adult: false,
    backdrop_path: "/kHOfxq7cMTXyLbj0UmdoGhT540O.jpg",
    genre_ids: [878, 28, 35],
    id: 507244,
    original_language: "en",
    original_title: "Afterburn",
    overview:
      "Set against the backdrop of a postapocalyptic Earth whose Eastern Hemisphere was destroyed by a massive solar flare, leaving what life remains mutated from radiation and fallout. The story revolves around a group of treasure hunters who extract such objects as the Mona Lisa, the Rosetta Stone and the Crown Jewels while facing rival hunters, mutants and pirates.",
    popularity: 314.8576,
    poster_path: "/xR0IhVBjbNU34b8erhJCgRbjXo3.jpg",
    release_date: "2025-08-20",
    title: "Afterburn",
    video: false,
    vote_average: 6.8,
    vote_count: 95,
  };

  const getMovieDetails = () => {};
  return (
    <main className="overlay">
      <div className="modal">
        <h1>{movieDetails.title}</h1>
        <p>
          <img src="./star.svg" alt="rating" /> {movieDetails.vote_average}/10 (
          {movieDetails.vote_count} votes)
        </p>
      </div>
    </main>
  );
};

export default FullMoviePage;
