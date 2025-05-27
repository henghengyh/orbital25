import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import ProtectedRoutes from './components/ProtectedRoutes/protectedroutes';
import LoginPage from './pages/Login&Register/login';
import RegisterPage from './pages/Login&Register/register';
import AboutPage from './pages/About/about';
import DashboardPage from './pages/Dashboard/dashboard';
import WeatherPage from './pages/Weather/weather';
import ItineraryPage from './pages/Itinerary/itinerary';
import MapsPage from './pages/Maps/maps';
import BudgetPlannerPage from './pages/BudgetPlanner/budgetplanner';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Protected routes that require authentication */}
                <Route element={<ProtectedRoutes />}>
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/weather" element={<WeatherPage />} />
                    <Route path="/itinerary" element={<ItineraryPage />} />
                    <Route path="/maps" element={<MapsPage />} />
                    <Route path="/budgetplanner" element={<BudgetPlannerPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
