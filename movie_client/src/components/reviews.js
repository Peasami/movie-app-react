import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import "../stylesheets/reviews.css";
import { userInfo } from "./signals";

const Reviews = () => {
  const [searchParams] = useSearchParams();
  const mediaId = searchParams.get("mediaId");

  const [reviews, setReviews] = useState([]);
  const [text, setText] = useState("");
  const [rating, setRating] = useState("");
  const [movieDetails, setMovieDetails] = useState(null);
  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (mediaId) {
        const movieDetails = await fetchData(mediaId);
        setMovieDetails(movieDetails);
      }
    };

    // getReviews
    const getReviews = async () => {
      const getReviewEndpoint = "http://localhost:3001/reviews/getReviews";
      try {
        const response = await axios.get(getReviewEndpoint);
        const data = response.data;
        if (data) {
          const updatedReviews = await Promise.all(
            data.map(async (reviewItem) => {
              const { movie_id, account_id, text, rating } = reviewItem;
              const movieDetails = await fetchData(movie_id);
              const usernames = await fetchUsername(account_id);
              const username = usernames?.[0]?.username || null;
              return {
                movieDetails,
                username,
                text,
                rating,
              };
            })
          );
          // order reviews chronologically by deafult
          updatedReviews.reverse();
          setReviews(updatedReviews);
        }
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchMovieDetails();
    getReviews();
    if (mediaId) {
      fetchData(mediaId);
    }
  }, [mediaId]);
  


  //post reviews
  const postReview = async () => {
    if (!userInfo.value) {
      console.error("Unauthorized");
      return;
    }
    const accountId = userInfo.value.userId;
    const postReviewEndpoint = `http://localhost:3001/reviews/Review/${accountId}`;
    try {
      const response = await axios.post(postReviewEndpoint, {
        accountId,
        text,
        movie_id: mediaId,
        rating,
      });

      console.log("Review posted successfully:", response.data);
      window.location.reload();
    } catch (error) {
      console.error("Error posting review", error);
    }
  };

  //fetch username from db
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

  // fetch required data from tmdb for old reviews
  const fetchData = async (movie_id) => {
    const API_KEY = process.env.REACT_APP_TMBD_API_KEY;
    const tmdbEndpoint = `https://api.themoviedb.org/3/movie/${movie_id}?language=en-US`;

    try {
      const response = await axios.get(tmdbEndpoint, {
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer ' + API_KEY,
        },
      });

      if (response.status === 404) {
        console.error('No data received from the API');
        return null;
      }

      return response.data;
    } catch (error) {
      console.error('Error fetching movie/TV series details', error);
      return null;
    }
  };
//sort reviews by highest and lowest ratings
  const sortReviews = (reviews, order) => {
    return reviews.sort((a, b) => {
      if (order === "high") {
          return a.rating - b.rating;
      } else if (order === "low") {
          return b.rating - a.rating;
      }
    });
  };

  const handleSortChange = (order) => {
    const sortedReviews = sortReviews(reviews, order);
    setReviews([...sortedReviews]);
  };

  return (
    <div>
      < a href="/reviews">Reviews:</a>
      {window.location.pathname === "/reviews" && (
        <ul id="createReviewView" className="hidden">
          <li>
            <h1>{movieDetails?.title || ''}</h1>
            <textarea
              id="reviewInput"
              placeholder="Review"
              size="220"
              maxLength="255"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <br></br>
            <label htmlFor="rating">Rating: </label>
            <select
              id="rating"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            >
              {[1, 2, 3, 4, 5].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
            <button id="post" onClick={postReview}>Create review</button>
          </li>
        </ul>
      )}

      {window.location.pathname === "/reviews" && (
        <div className="dropdown">
          <button className="dropbtn">Sort by</button>
          <div className="dropdown-content">
          <a href="#" onClick={() => handleSortChange("high")}>
            Highest ratings
          </a>
          <a href="#" onClick={() => handleSortChange("low")}>
            Lowest ratings
          </a>
        </div>
        </div>
      )}

      <br></br>
      <ul className="reviews-list">
        {reviews.map((reviewItem, index) => (
          <li className="review" key={index}>
            {reviewItem.movieDetails && (
              <img
                src={`https://image.tmdb.org/t/p/w500/${reviewItem.movieDetails.poster_path}`}
                alt={`Poster for ${reviewItem.movieDetails.title || reviewItem.movieDetails.name}`}
              />
            )}
            <div className="card-content">
              <div className="title-and-rating">
                <div className="title">
                  {reviewItem.movieDetails
                    ? reviewItem.movieDetails.title
                    : 'Title not available'}
                </div>
                <div className="rating">{reviewItem.rating}/5</div>
              </div>
              <div className="text">{reviewItem.text}</div>
              <div className="user-info">
                <div className="username">- {reviewItem.username}</div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Reviews;