import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import Main from './components/pages/main';
import Reviews from './components/pages/reviews';
import Groups from './components/pages/groups';
import Login from './components/pages/login';
import Profile from './components/pages/profile';
import Register from './components/pages/register';
import Navigation from './components/widgets/navigation';

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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
