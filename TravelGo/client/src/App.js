import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import AboutPage from './pages/About/about';
import AuthProvider from './context/AuthContext/authcontext';
import DashboardPage from './pages/Dashboard/dashboard';
import ItineraryPage from './pages/Itinerary/itinerary';
import ItineraryProvider from './context/ItineraryContext/itinerarycontext';
import Layout from './components/Layout/layout';
import LoginPage from './pages/Login&Register/login';
import MapsPage from './pages/Maps/maps';
import ProtectedRoutes from './components/ProtectedRoutes/protectedroutes';
import RegisterPage from './pages/Login&Register/register';
import UserProvider from './context/UserContext/usercontext';
import WeatherPage from './pages/Weather/weather';
import Profile from './pages/Profile/profile';

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route element={<ProtectedRoutes />}>
                        <Route element={
                            <UserProvider>
                                <ItineraryProvider>
                                    <Layout />
                                </ItineraryProvider>
                            </UserProvider>
                        }>
                            <Route path="/about" element={<AboutPage />} />
                            <Route path="/dashboard" element={<DashboardPage />} />
                            <Route path="/weather" element={<WeatherPage />} />
                            <Route path="/itinerary" element={<ItineraryPage />} />
                            <Route path="/maps" element={<MapsPage />} />
                            <Route path="/profile" element={<Profile />} />
                            {/* This path is newly added, WIP */}
                        </Route>
                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter >
    );
}

export default App;
