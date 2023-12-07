import { Link, Outlet } from "react-router-dom";
import React, { useEffect, useState } from "react";

import "../stylesheets/trending-window.css";
import "../stylesheets/navigation.css";


// Main component rendering Trending, Reviews, and Groups components
function Main() {
  return (
    <div>
      <Trending />
      <Reviews />
      <Groups />
    </div>
  );
}

// Component rendering image, title and overview of a trending movie
function TrendingObj({ movie }) {
  const imageSrcUrl = "https://image.tmdb.org/t/p/w500/" + movie.poster_path;
  const tmdbUrl = "https://www.themoviedb.org/movie/" + movie.id;
  return (
    <div className="flex-item">
      <a target="_blank" href={tmdbUrl}>
        <img src={imageSrcUrl} />
        <div className="overlay">
          <b>{movie.title}</b>
          <p>{movie.overview}</p>
        </div>
      </a>
    </div>
  );
}

function Trending() {
  // State to store the list of trending movies
  const [trendingMovies, setTrendingMovies] = useState([""]);

  // API key for making requests to The Movie Database (TMDB) API
  const API_KEY = process.env.REACT_APP_TMBD_API_KEY;

  useEffect(() => {
    const fetchData = async () => {
      // Fetch trending movies from TMDB API
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: "Bearer " + API_KEY,
        },
      };
      try {
        const response = await fetch(
          "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1",
          options
        );
        const data = await response.json();
        setTrendingMovies(data.results);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);
  return (
    <>
      <div>
        <h1>Trending Movies</h1>
        <div className="flex-container">
          {trendingMovies.map((movie) => (
            <TrendingObj movie={movie} />
          ))}
        </div>
      </div>
    </>
  );
}

function Reviews() {
  return (
    <div>
      <h1>
        <Link to="/reviews" style={{ textDecoration: "none" }}>
          Reviews
        </Link>
      </h1>
      <div
        style={{
          width: "300px",
          height: "250px",
          border: "solid",
          display: "flex",
        }}
      ></div>
    </div>
  );
}

function Groups() {
  return (
    <div>
      <h1>
        <Link to="/groups" style={{ textDecoration: "none" }}>
          Groups
        </Link>
      </h1>
      <div style={{ width: "300px", height: "250px", border: "solid" }}></div>
    </div>
  );
}

export default Main;
