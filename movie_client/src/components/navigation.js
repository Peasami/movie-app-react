// Navigation bar at the top
import { Link, Outlet } from "react-router-dom";

const Navigation = () => {
    return (
        <>
            <nav>
                <form>
                    <Link to="/" style={{ color: "red", fontSize: 40, margin: 40 }}>Movie App</Link>
                    <input type="text" style={{margin: 40 }}></input>
                    <Link to="/register" style={{marginLeft: 200}}>Register</Link>
                </form>
            </nav>

            <Outlet />
        </>
    )
}

export default Navigation;