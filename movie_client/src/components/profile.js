import { useParams, } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { jwtToken, userInfo } from "./signals";
//import "../stylesheets/profile.css";

function Profile() {
  const { username } = useParams();
  const [Udata, setData] = useState([]);
  
  const [accessDeniedMessage, setAccessDeniedMessage] = useState(null);


  useEffect(() => {
    const GetUserData = async () => {
      try {
        if (jwtToken.value.length > 0 && userInfo.value.userId !== undefined) {
          console.log("UserInfo = ", userInfo.value.userId);
          console.log ("token = ", jwtToken.value);

          const account_id = userInfo.value.userId;

          
          

          
          if (username && userInfo.value.username !== username) {
            
            console.log("Access denied - Mismatch between username in URL and token");
            // Redirect to an access denied page or handle it as needed
            setAccessDeniedMessage("Access denied");
          return;
           
          }

          // Käy hakemassa käyttäjän datan
          const response = await axios.get(`http://localhost:3001/account/${account_id}`);
          setData(response.data);
        }
      } catch (error) {
        console.error("API request error: ", error);
        console.error("API response data: ", error.response.data);
      } 
    };

    // Fetch user data on component mount
    GetUserData();
  }, [jwtToken.value, userInfo.value.userId, username,]);

  if (accessDeniedMessage) {
    return (
      <div>
        <h1>{accessDeniedMessage}</h1>
      </div>
    );
  }

  return (
    <div>
      <h1>Profile for {username}</h1>
      
        <ShowUserData userDATA={Udata} />
      
    </div>
  );
}



function ShowUserData({ userDATA }) {
  return (
    <div>
      <h2>User Data</h2>
      
      {/* Ryhmät */}
      <div>
        <h3>Groups</h3>
        {userDATA.Groups && userDATA.Groups.map((group) => (
          <div key={group.community_name}>
            <p>Name: {group.community_name}</p>
            <p>Description: {group.community_desc}</p>
          </div>  
        ))}
      </div>

      {/* Lempi elokuvat */}
      <div>
        <h3>Favourites</h3>
        {userDATA.favourites && userDATA.favourites.map((favourite) => (
          <div key={favourite.favourite_id}>
            <p>Favourite ID: {favourite.favourite_id}</p>
            <p>Movie ID: {favourite.movie_id}</p>
            <p>Account ID: {favourite.account_id}</p>
          </div>
        ))}
      </div>

      {/*Uutiset */}
      <div>
        <h3>News</h3>
        {userDATA.news && userDATA.news.map((news) => (
          <div key={news.news_url}>
            <p>News URL: {news.news_url}</p>
          </div>
        ))}
      </div>

      {/* arvostelut */}
      <div>
        <h3>Reviews</h3>
        {userDATA.Review && userDATA.Review.map((review) => (
          <div key={review.review_id}>
            <p>Review ID: {review.review_id}</p>
            <p>Account ID: {review.account_id}</p>
            <p>Text: {review.text}</p>
            <p>Movie ID: {review.movie_id}</p>
            <p>Rating: {review.rating}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Profile;