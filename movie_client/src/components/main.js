import { Link, Outlet } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";

import "../stylesheets/trending-window.css";
import "../stylesheets/navigation.css";
import Reviews from './reviews.js';
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
      try {
        const response = await axios.get(
          "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1",
          {
            headers: {
              accept: "application/json",
              Authorization: "Bearer " + API_KEY,
            },
          }
        );
        setTrendingMovies(response.data.results);
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
        <div id="arrow-container">
            <span className="arrowRight" onClick={() => scroll(800)}>
              <span></span>
              <span></span>
            </span>
            <span className="arrowLeft" onClick={() => scroll(-800)}>
              <span></span>
              <span></span>
            </span>
          </div>
        <div className="flex-container" id="trending-container">
          {trendingMovies.map((movie) => (
            <TrendingObj movie={movie} key={movie.id} />
          ))}
        </div>
      </div>
    </>
  );
 
  function scroll(i) {
    const trendingContainer = document.getElementById("trending-container");
    if (trendingContainer) {
      trendingContainer.style.transition = "all 2s";
      trendingContainer.scrollLeft += i;

    }
  }
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
