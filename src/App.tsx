import "./styles.css";

import React, { useState, useEffect } from "react";

interface Movie {
  title: string;
  episode_id: number;
  opening_crawl: string;
  director: string;
  producer: string;
  release_date: string;
  id: number;
}

const MovieApp: React.FC = () => {
  // State to hold the list of movies and selected movie
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"episode" | "year" | "">("");

  // Fetch movies from the API
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(
          "https://swapi.dev/api/films/?format=json"
        );
        const data = await response.json();
        const formattedMovies = data.results.map(
          (movie: any, index: number) => ({
            title: movie.title,
            episode_id: movie.episode_id,
            opening_crawl: movie.opening_crawl,
            director: movie.director,
            producer: movie.producer,
            release_date: movie.release_date,
            id: index + 1, // Just to give it an ID (since the API doesn't provide a unique one)
          })
        );
        setMovies(formattedMovies);
      } catch (error) {
        console.error("Error loading movies:", error);
        alert("Failed to load movie data.");
      }
    };

    fetchMovies();
  }, []);

  // Filter movies based on the search query
  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort movies based on the selected criterion
  const sortedMovies = [...filteredMovies].sort((a, b) => {
    if (sortBy === "episode") {
      return a.episode_id - b.episode_id;
    } else {
      return (
        new Date(a.release_date).getFullYear() -
        new Date(b.release_date).getFullYear()
      );
    }
  });

  // Function to handle movie selection
  const handleMovieSelect = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  // Function to handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Function to handle sorting option change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as "episode" | "year");
  };

  return (
    <div className="container">
      <header>
        <select id="sortBy" value={sortBy} onChange={handleSortChange}>
          <option value="">Sort by</option>
          <option value="episode">Sort by Episode</option>
          <option value="year">Sort by Release Year</option>
        </select>

        <input
          type="text"
          id="searchInput"
          placeholder="Search for movies..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </header>

      <div className="content">
        <div className="movie-list">
          <ul id="movieList">
            {sortedMovies.map((movie) => (
              <li key={movie.id} onClick={() => handleMovieSelect(movie)}>
                {movie.title} (Episode {movie.episode_id})
              </li>
            ))}
          </ul>
        </div>

        <div className="movie-details">
          <div id="movieDetail">
            {selectedMovie ? (
              <>
                <h2>{selectedMovie.title}</h2>
                <p>
                  <strong>Episode:</strong> {selectedMovie.episode_id}
                </p>
                <p>
                  <strong>Director:</strong> {selectedMovie.director}
                </p>
                <p>
                  <strong>Producers:</strong> {selectedMovie.producer}
                </p>
                <p>
                  <strong>Release Date:</strong>{" "}
                  {new Date(selectedMovie.release_date).toLocaleDateString()}
                </p>
                <p>
                  <strong>Opening Crawl:</strong>
                </p>
                <p>{selectedMovie.opening_crawl}</p>
              </>
            ) : (
              <p>Select a movie to see details.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieApp;
