import React, { useState, useEffect } from "react";
import axios from "axios";
import "../stylesheets/reviews.css";
import { BrowserRouter as Route, Routes } from 'react-router-dom';

const Reviews = () => {

  const [reviews, setReviews] = useState([]);
  
  const [account_id, setAccountId] = useState('');
  const [text, setText] = useState('');
  const [movie_id, setMovieId] = useState('');
  const [rating, setRating] = useState('');

  useEffect(() => {

    const getReviews = async () => {

      const dbReviewEndpoint = 'http://localhost:3001/reviews/getReviews';

      try {
        // fetch reviews data from the server
        const response = await axios.get(dbReviewEndpoint);
        const data = response.data;

        if (data) {
          // process each review item
          const updatedReviews = await Promise.all(
            data.map(async (reviewItem) => {
              const { movie_id, account_id, text, rating } = reviewItem;
              // fetch movie title
              const movieTitle = await fetchMovieTitle(movie_id);
              // fetch username
              const usernames = await fetchUsername(account_id);
              const username = usernames?.[0]?.username || null;
              return { movieTitle, username, text, rating };
            })
          );
          // update state with the processed reviews
          setReviews(updatedReviews);
        }
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    getReviews();
  }, []);


  // post review
  const postReview = async () => {
    const url = `http://localhost:3001/reviews/Review/${account_id}`;
    
    try {
      const response = await axios.post(url, { account_id, text, movie_id, rating });
      console.log('Review posted successfully:', response.data);

      // Optionally, refetch the reviews after posting a new review
      // getReviews();
    } catch (error) {
      console.error('Error posting review:', error.message);
    }
  };

  // fetch movie title from tmdb
  const fetchMovieTitle = async (movie_id) => {
    const tmdbEndpoint = `https://api.themoviedb.org/3/movie/${movie_id}?language=en-US`;
    const API_KEY = process.env.REACT_APP_TMBD_API_KEY;
    try {
      const response = await axios.get(tmdbEndpoint, {
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer ' + API_KEY,
        }
      });
      return response.data.title;

    } catch (error) {
      console.error("Error fetching movie title", error);
      return null;
    }
  };

  // get username from the server
  const fetchUsername = async (account_id) => {
    const dbUsernameEndpoint = `http://localhost:3001/account/getUsername/${account_id}`;
    try {
      const response = await axios.get(dbUsernameEndpoint);
      return response.data;
    } catch (error) {
      console.error("Error fetching username", error);
      return null;
    }
  };

  return (
    <div>
      <h1>Reviews:</h1>

      {window.location.pathname === '/reviews' && (
        <form>
          <input placeholder="account_id" value={account_id} onChange={(e) => setAccountId(e.target.value)} />
          <input placeholder="review" value={text} onChange={(e) => setText(e.target.value)} />
          <input placeholder="movie_id" value={movie_id} onChange={(e) => setMovieId(e.target.value)} />
          <input placeholder="rating" value={rating} onChange={(e) => setRating(e.target.value)} />
          <button type="button" onClick={postReview}>Create Review</button>
        </form>
      )}

      <ul className="reviews-list">
        {reviews.map((reviewItem, index) => (
          <li className="review" key={`${index}`}>
            <div>
              <div className="title">{reviewItem.movieTitle}</div>
              <div className="username">{reviewItem.username}</div>
              <div className="text">{reviewItem.text}</div>
            </div>
            <div className="rating">{reviewItem.rating}/5</div>
          </li>
        ))}
      </ul>
    </div>
  );



};

export default Reviews;