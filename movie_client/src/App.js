import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import Main from './components/main';
import Reviews from './components/reviews';
import Groups from './components/groups';
import Login from './components/login';
import Profile from './components/profile';
import Register from './components/register';
import Navigation from './components/navigation';
import Group from './components/group';
import News from './components/news';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigation />}>
          <Route index element={<Main />} />
          <Route path="Reviews" element={<Reviews />} />
          <Route path="Groups" element={<Groups />} />
          <Route path="Login" element={<Login />} />
          <Route path="Profile/:username" element={<Profile />} />
          <Route path="Register" element={<Register />} />
          <Route path="Groups" element={<Groups />} />
          <Route path="Groups/:groupId" element={<Group />} />
          <Route path="News" element={<News />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
