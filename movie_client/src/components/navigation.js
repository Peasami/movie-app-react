import { Link, Outlet } from "react-router-dom";
import  Search from './search.js';

const Navigation = () => {
  return (
    <>
      <nav>
        <a href="/">Movie App</a>
        <Search />
        <Link to="/register" className="signup-link">SignUp</Link>
      </nav>
      <Outlet />
    </>
  );
};

export default Navigation;
