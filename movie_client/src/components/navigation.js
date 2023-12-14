import { Link, Outlet } from "react-router-dom";
import Search from './search.js';
import { jwtToken, userInfo } from "./signals";
import { handleLogout } from "./login.js"

const Navigation = () => {

	function darkMode() {
		const element = document.body;
		element.classList.toggle("dark-mode");
		const darkMode = document.getElementById("dark");

		if (element.classList.contains("dark-mode")) {
			darkMode.textContent = "☀️";
		} else {
			darkMode.textContent = "🌙";
		}
	}
	
	return (
		<>

			<nav>
				<a className='logo' href="/">Movie App</a>
				<Search />
				<a className='nav-button' id="dark" onClick={() => darkMode()}>🌙</a>

				{userInfo.value && (
					<Link className='nav-button' onClick={() => jwtToken.value = ''}>Log out</Link>
				)}
				{!userInfo.value && (
					<Link to="/login" className='nav-button'>Log in</Link>
				)}


				<input type="checkbox" id="menuToggle" className="menu-toggle" />
				<label htmlFor="menuToggle" className="nav-button">&#9776;</label>

				<div className="menu">
					<label htmlFor="menuToggle" className="menu-close-button">&#9932;</label>
					<ul>
						{userInfo.value && (
							<>
								<Link to={`/profile/${userInfo.value.username}`} className="nav-button">Profile</Link>
								{/* 
        			    <button className="buttonn" onClick={handleLogout}>Logout</button>
									*/}
							</>
						)}

						<Link to="/reviews" className="nav-button">Reviews</Link>
						<Link to="/groups" className="nav-button">Groups</Link>
						<Link to="/news" className="nav-button">News</Link>
					</ul>
				</div>
			</nav>
			<Outlet />			
		</>
	);
};

export default Navigation;
