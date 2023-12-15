import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../stylesheets/news.css";
import { userInfo } from "./signals";

const News = () => {

  const [newsData, setNewsData] = useState(null);
  const [renderUserGroups, setRenderUserGroups] = useState(null);

  useEffect(() => {
    // fetch the news articles
    const fetchData = async () => {
      const newsEndpoint = 'https://www.finnkino.fi/xml/News/';

      try {
        const response = await axios.get(newsEndpoint);
        const data = response.data;
        // Parse XML using DOMParser
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data, 'text/xml');
        // Convert XML document to JSON
        const articles = Array.from(xmlDoc.querySelectorAll('NewsArticle')).map((articleNode) => {
          const article = {};
          Array.from(articleNode.children).forEach((child) => {
            article[child.tagName] = child.textContent.trim();
          });

          return article;
        });

        setNewsData(articles);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchData();
  }, []);

  // find the groups that the user is a member of
  const getUserGroups = async (ArticleURL) => {
    // check if user is logged in
    if (userInfo.value) {
 
      const accountId = userInfo.value.userId;
      const getGroupsEndpoint = `https://movie-app-h3st.onrender.com/groups/getUsersGroup/${accountId}`;

      try {
        const response = await axios.get(getGroupsEndpoint);

        if (response.data && response.data.rows) {
          const data1 = response.data.rows.map(item => ({
            community_name: item.community_name,
            community_id: item.community_id
          }));
        
          // check if the user is in a group and render the groups so user can select to which share in 
          if (data1.length > 0) {
            const userGroups = data1.map(group => group.community_name);
          
            console.log('You are in the following group/s: ', userGroups);
            const groupButtons = data1.map((group, index) => (
            
              <button key={index} className="groupButtons" onClick={() => post(accountId, group.community_id, ArticleURL) && setRenderUserGroups(null)}>
                {group.community_name}
              </button>
            ));
            
            const groupButtonsContainer = (
              <div className="groupButtonsContainer">
                {groupButtons}
              </div>
            );
            
            setRenderUserGroups(groupButtonsContainer);
            
          } else {
            console.log('You are not in any groups.');
            const notInAnyGroups= (
              <p id='noGroups'>You have to be a member in a group to share</p>
            );
            setRenderUserGroups(notInAnyGroups);
          }
        } else {
          console.error('Invalid or empty response from the api');
        }

      } catch (error) {
        console.error("Error: ", error);
      }
    } else {
      console.error("Unauthorized");
      return;
    }
  };

  //post
  const post = async (accountId, community_id, ArticleURL) => {
    if (community_id !== undefined) {
      const postNewsEndpoint = `https://movie-app-h3st.onrender.com/News/AddNews/${accountId}`;
      try {
          const response = await axios.post(postNewsEndpoint, {
              accountId: accountId,
              community_id: community_id,
              news_url: ArticleURL,
          });
          console.log("posted successfully: ", response.data);
          
      } catch (error) {
          console.error("Error: ", error);
      }
    } else {
      console.error("Community_id is undefined");
    }
  }

  return (
    <div className='news'>
      <h2>News Articles:</h2>

      {newsData && (
        <ul className='newsList'>
          {newsData.map((article, index) => (
            <li id='listArticle' key={index}>
              <img id='articleImage' src={article.ImageURL} alt={article.Title} />
              <button id='share' onClick={() => getUserGroups(article.ArticleURL)}>Share</button>
              {renderUserGroups}
              <h3 id='articleTitle'>{article.Title}</h3>
              <p id='date'>Publish Date: {article.PublishDate.slice(0, 10)}</p>
              <p id='news-text'>{article.HTMLLead}</p>
              <p>
                <a id='link' href={article.ArticleURL} target="_blank">Lue lisää</a>
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default News;