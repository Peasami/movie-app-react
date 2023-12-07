import React, { useState, useEffect } from "react";
import axios from "axios";
import { userInfo, jwtToken } from "./signals"; 

function UserProfile() {
  const [userReviews, setUserReviews] = useState([]);
  const [personalGroups, setPersonalGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserReviews = async () => {
      try {
     
       
        if (userInfo.value && userInfo.value.userId) {
          const accountId = userInfo.value.userId;
          console.log(accountId);
          console.log("tässä on token " +jwtToken);
          const response = await axios.get(`http://localhost:3001/reviews/Review/${accountId}`);

          if (response.data) {
            const movieIds = response.data.map((review) => review.movie_id);
            const movieDetailsPromises = movieIds.map((movieId) => fetchMovieDetails(movieId));
            const movieDetails = await Promise.all(movieDetailsPromises);

            const userReviewsWithDetails = response.data.map((review, index) => ({
              ...review,
              movieDetails: movieDetails[index],
            }));

            setUserReviews(userReviewsWithDetails);


           
          }
        }
      } catch (error) {
        console.error("Error fetching user reviews:", error);
      
      }
    };

    const fetchPersonalGroups = async () => {
      try {
       
        if (userInfo.value && userInfo.value.userId) {
          const accountId = userInfo.value.userId;
          const response = await axios.get(`http://localhost:3001/groups/getYourGroups/${accountId}`);

          if (response.data) {
            setPersonalGroups(response.data);
          }
        }
      } catch (error) {
        console.error("Error fetching personal groups:", error);
        setIsLoading(false);
      }
    };

    fetchUserReviews();
    fetchPersonalGroups();
  }, []);
  const fetchMovieDetails = async (movieId) => {
    const API_KEY = process.env.REACT_APP_TMBD_API_KEY;
    const tmdbEndpoint = `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`;

    try {
      const response = await axios.get(tmdbEndpoint, {
        headers: {
          accept: "application/json",
          Authorization: "Bearer " + API_KEY,
        },
      });

      if (response.status === 404) {
        console.error("No data received from the API");
        return null;
      }

      const movieDetails = response.data;
      console.log("Fetched movie details:", movieDetails);

      return movieDetails;
    } catch (error) {
      console.error("Error fetching movie details", error);
      return null;
    }
  };
 
  return (
    <div>
      <h1>User Profile</h1>
      <h2>Reviews by {userInfo.value.username}</h2>
      <ul>
        {userReviews.map((review) => (
          <li key={review.review_id}>
            <h3>Review for {review.movieDetails ? review.movieDetails.title : "Movie Title not available"}</h3>
            {review.movieDetails && (
              <img
                src={`https://image.tmdb.org/t/p/w500/${review.movieDetails.poster_path}`}
                alt={`Poster for ${review.movieDetails.title || "Movie Title not available"}`}
              />
            )}
            {/* arvostelu*/}
            <p>Rating: {review.rating}</p>
            <p>Text: {review.text}</p>
          </li>
        ))}
      </ul>

      {/* ryhmät */}
      <h2>Personal Groups</h2>
      <ul>
        {personalGroups.map((group) => (
          <li key={group.community_id}>
            <h3>{group.community_name}</h3>
            <p>{group.community_desc}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default UserProfile;
