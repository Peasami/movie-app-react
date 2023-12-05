import { Link, Outlet } from "react-router-dom";
import  Search from './search.js';

const Navigation = () => {
  return (
    <>
      <nav>
        <a href="/">Movie App</a>
        <Search />
        <Link to="/login" className="login-link">Log in</Link>
      </nav>
      <Outlet />
    </>
  );
};

export default Navigation;
