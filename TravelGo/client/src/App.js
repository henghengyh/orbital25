import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import LoginPage from './pages/Login&Register/login';
import HomePage from './pages/Home/home';
import RegisterPage from './pages/Login&Register/register';
import WeatherPage from './pages/Weather/weather';
import ItineraryPage from './pages/Itinerary/itinerary';
import MapsPage from './pages/Maps/maps';
import BudgetPlannerPage from './pages/BudgetPlanner/budgetplanner';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/weather" element={<WeatherPage />} />
                <Route path="/itinerary" element={<ItineraryPage />} />
                <Route path="/maps" element={<MapsPage />} />
                <Route path="/budgetplanner" element={<BudgetPlannerPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
