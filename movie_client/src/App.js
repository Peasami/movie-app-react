import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import Main from './components/main';
import Reviews from './components/reviews';
import Login from './components/login';
import Profile from './components/profile';
import Register from './components/register';

function App() {
  return (
    <BrowserRouter>
    <Link to="/">Main</Link>
    <Link to ="/Reviews">Reviews</Link>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/Reviews" element={<Reviews />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Profile/:username" element={<Profile />} />
        <Route path="/Register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
