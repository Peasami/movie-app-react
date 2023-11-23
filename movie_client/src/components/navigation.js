import { Link, Outlet } from "react-router-dom";

const Navigation = () => {
    return (
        <>
            <nav>
                <form>
                    <a className="logo" href="/" >Movie App</a>
                    <input className="search" type="text" style={{margin: 40 }}></input>
                    <Link to="/register" style={{marginLeft: 200}}>Register</Link>
                    <hr/>
                </form>
            </nav>
            <Outlet />
        </>
    )
}

export default Navigation;