import { Link, Outlet } from "react-router-dom";
import React, { useEffect, useState } from 'react';

function Main() {
    return (
        <div>
            <Trending />
            <Reviews />
            <Groups />
        </div>
    );
}

function TrendingTitle({ movie }) {
    return (
        <li><b>{movie.title}</b>
            <br />
            {movie.overview}
        </li>
    );
}

function Trending() {
    const [trendingMovies, setTrendingMovies] = useState([]);


    const API_KEY = process.env.REACT_APP_TMBD_API_KEY;

    useEffect(() => {

        const fetchData = async () => {
            const options = {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    Authorization: "Bearer " + API_KEY,
                },
            };
            try {
                const response = await fetch(
                    'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1',
                    options
                );
                const data = await response.json();
                setTrendingMovies(data.results);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);
    return (
        <>
            <div>
                <h1>Trending Movies</h1>
                <div style={{ width: '300px', height: '250px', border: 'solid' }}>
                    <ul>
                        {trendingMovies.map((movie) => (
                            <TrendingTitle movie={movie} />
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
}

function Reviews() {
    return (
        <div>
            <h1>
                <Link to="/reviews" style={{ textDecoration: 'none' }}>Reviews</Link>
            </h1>
            <div style={{ width: '300px', height: '250px', border: 'solid', display: 'flex' }}></div>
        </div>
    );
}

function Groups() {
    return (
        <div>
            <h1>
                <Link to="/groups" style={{ textDecoration: 'none' }}>Groups</Link>
            </h1>
            <div style={{ width: '300px', height: '250px', border: 'solid' }}></div>
        </div>
    );
}

export default Main;