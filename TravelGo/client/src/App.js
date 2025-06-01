import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import AboutPage from './pages/About/about';
import AuthProvider from './context/AuthContext/authcontext';
import DashboardPage from './pages/Dashboard/dashboard';
import ItineraryPage from './pages/Itinerary/itinerary';
import Layout from './components/Layout/layout';
import LoginPage from './pages/Login&Register/login';
import MapsPage from './pages/Maps/maps';
import ProtectedRoutes from './components/ProtectedRoutes/protectedroutes';
import RegisterPage from './pages/Login&Register/register';
import UserProvider from './context/UserContext/usercontext';
import WeatherPage from './pages/Weather/weather';

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route element={<ProtectedRoutes />}>
                        {/* Render the Navbar on all protected routes */}
                        <Route element={
                            <UserProvider>
                                <Layout />
                            </UserProvider>
                        }>
                            {/* Protected routes that require authentication */}
                            <Route path="/about" element={<AboutPage />} />
                            <Route path="/dashboard" element={<DashboardPage />} />
                            <Route path="/weather" element={<WeatherPage />} />
                            <Route path="/itinerary" element={<ItineraryPage />} />
                            <Route path="/maps" element={<MapsPage />} />
                        </Route>
                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter >
    );
}

export default App;
