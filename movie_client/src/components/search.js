import React, { useState, useEffect } from "react";
import "../stylesheets/search-results.css";
import "../stylesheets/navigation.css";

const Search = () => {
  // State to manage the search query and search results
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    // Function to fetch search results when the query changes
    const fetchSearchResults = async () => {
      if (query.trim() === "") {
        setSearchResults([]);
        return;
      }
      // Fetch data
      const API_KEY = process.env.REACT_APP_TMBD_API_KEY;
      const searchEndpoint = `https://api.themoviedb.org/3/search/multi?query=${query}&language=en-US&page=1&include_adult=false&api_key=${API_KEY}`;

      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: "Bearer " + API_KEY,
        },
      };

      try {
        // API request and update the search results state
        const response = await fetch(searchEndpoint, options);
        const data = await response.json();
        setSearchResults(data.results);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };
    // Call the fetchSearchResults function when the query changes
    fetchSearchResults();
  }, [query]);
  // Function to handle input changes and update the query state
  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    setQuery(inputValue);
  };

  return (
    <div>
      <input
        className="search"
        type="text"
        placeholder="Search..."
        value={query}
        onChange={handleInputChange}
      />
      {query.length > 0 && (
        <div className="search-container">
          <ul>
            {searchResults &&
              searchResults.map((result) => (
                <li className="search-result" key={result.id}>
                  <a
                    target="_blank"
                    href={`https://www.themoviedb.org/${result.media_type}/${result.id}`}
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/w500/${result.poster_path}`}
                      alt={result.title}
                      className="search-result-img"
                    />
                    <div className="search-result-content">
                      <b>{result.title || result.name}</b>
                      <p>{result.overview}</p>

                      
                      {window.location.pathname === '/reviews' && (
                          <button>+ Create a review</button>
                      )}

                    </div>
                  </a>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Search;
