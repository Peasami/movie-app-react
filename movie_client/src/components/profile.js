import React, { useState, useEffect } from "react";
import axios from "axios";
import { userInfo, jwtToken } from "./signals"; 
import { Link } from "react-router-dom"; 
//import "../stylesheets/userProfile.css";


function UserProfile() {
  const [userReviews, setUserReviews] = useState([]);
  const [personalGroups, setPersonalGroups] = useState([]);
  
  

  useEffect(() => {
    console.log("UserProfile component mounted");
    
    const fetchUserReviews = async () => {
      console.log("Fetching user reviews");
      try {
        if (userInfo.value && userInfo.value.userId) {
          const accountId = userInfo.value.userId;
          console.log("Account ID:", accountId);
          console.log("Token:", jwtToken);

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
      console.log("Fetching user groups");
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
       
      }
    };

    fetchUserReviews();
    fetchPersonalGroups();
    return () => {
      console.log("UserProfile component unmounted");
  
      if (userInfo.value && userInfo.value.userId) {
        console.log("Cleaning up with user ID:", userInfo.value.userId);
        // ... (cleanup logic)
      } else {
        console.log("User ID is undefined");
      }
    };
  }, [userInfo.value?.userId]);
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
  const handleDeleteAccount = async () => {
    try {
      console.log("käy täällä");
      if (userInfo.value && userInfo.value.userId) {
        const accountId = userInfo.value.userId;
        const response = await axios.delete(`http://localhost:3001/account/Delete/${accountId}`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });
  
      
        window.location.href = 'http://localhost:3000/';
        jwtToken.value = '';
      }
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };
 
  return (
    <div>
      {userInfo.value && userInfo.value.userId ? (
        <div>
          <h1>{userInfo.value.username}</h1>
          
          <h2>My reviews</h2>
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
          <h2>My Groups</h2>
          <ul>
            {personalGroups.map((group) => (
              <li key={group.community_id}>
                <h4>
                  <Link to={`/groups/${group.community_id}`}>{group.community_name}</Link>
                </h4>
                <p>ABOUT: {group.community_desc}</p>
              </li>
            ))}
          </ul>
          <div><button onClick={() => { handleDeleteAccount()}}>Delete Account</button></div>
        </div>
      ) : (
        <h1>Please log in</h1>
      )}
    </div>
  );
      }
export default UserProfile;
