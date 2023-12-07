import { Link, Outlet } from "react-router-dom";
import  Search from './search.js';
import { jwtToken, userInfo } from "./signals";

const Navigation = () => {
  return (
    <>
      <nav>
        <a href="/">Movie App</a>
        <Search />
        <Link to="/login" className="login-link">Log in</Link>
        {userInfo.value && (
          <Link to={`/profile/${userInfo.value.username}`} className="profile-link">Profile</Link>
        )}
      </nav>
      <Outlet />
    </>
  );
};

export default Navigation;
