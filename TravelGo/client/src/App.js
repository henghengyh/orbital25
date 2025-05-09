import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import LoginPage from './pages/Login&Register/login';
import HomePage from './pages/Home/home';
import RegisterPage from './pages/Login&Register/register';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
