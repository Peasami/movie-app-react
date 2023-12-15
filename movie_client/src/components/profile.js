import React, { useState, useEffect } from "react";
import axios from "axios";
import { userInfo, jwtToken } from "./signals"; 
import { Link } from "react-router-dom"; 
import "../stylesheets/profile.css";


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

          const response = await axios.get(`https://movie-app-h3st.onrender.com/reviews/Review/${accountId}`);

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
          const response = await axios.get(`https://movie-app-h3st.onrender.com/groups/getYourGroups/${accountId}`);

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
        const response = await axios.delete(`https://movie-app-h3st.onrender.com/account/Delete/${accountId}`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });
  
      
        window.location.href = 'https://movie-app-h3st.onrender.com/';
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
          
          <h2>My reviews:</h2>
          <ul className="reviews-list">
            {userReviews.map((review) => (
              <li className="review" key={review.review_id}>          
                {review.movieDetails && (
                  <img id="reviewImage"
                    src={`https://image.tmdb.org/t/p/w500/${review.movieDetails.poster_path}`}
                    alt={`Poster for ${review.movieDetails.title || "Movie Title not available"}`}
                  />
                )}
								<div className="card-content">
									<h3 className="title">{review.movieDetails ? review.movieDetails.title : "Movie Title not available"}</h3>
                	{/* arvostelu*/}					
									<div className="title-and-rating">             		
                		<p className="text">{review.text}</p>
										<p className="rating">Rating: {review.rating}/5</p>
									</div>
								</div>
              </li>				
            ))}
          </ul>
          {/* ryhmät */}
          <h2>My Groups</h2>
          <ul className='group-list'>
            {personalGroups.map((group) => (
              <li className='group-item' key={group.community_id}>
                <h4 id="group-name">
                  <Link to={`/groups/${group.community_id}`}>{group.community_name}</Link>
                </h4>
                <p id="group-desc">ABOUT: {group.community_desc}</p>
              </li>
            ))}
          </ul>
          <div>
					<h3>Remove your data: </h3>
					<button id="btn" onClick={() => { handleDeleteAccount()}}>Delete Account</button></div>
        </div>
      ) : (
        <h1>Please log in</h1>
      )}
    </div>
  );
      }
export default UserProfile;
