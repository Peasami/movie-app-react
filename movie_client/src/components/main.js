import { ShowGroupsForm } from "./groups";

function Main() {
    return (
        <div>
            <Trending />
            <Reviews />
            <ShowGroupsForm numberOfItems={5} />
        </div>
    );
}

function Trending() {
    return (
        <div>
            <h1>Trending Movies</h1>
        </div>
    );
}

function Reviews() {
    return (
        <div>
            <h1>Reviews</h1>
        </div>
    );
}

function Groups() {
    return (
        <div>
            <h1>Groups</h1>
        </div>
    );
}

export default Main;