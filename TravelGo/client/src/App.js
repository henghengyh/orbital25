import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import AboutPage from './pages/About/about';
import AllExpenditurePage from './pages/Budget/allexpenditure';
import AuthProvider from './context/AuthContext/authcontext';
import BudgetLayoutPage from './components/Layout/budgetlayout';
import BudgetPage from './pages/Budget/budget';
import CreateItineraryPage from './pages/Itinerary/createitinerary';
import DashboardPage from './pages/Dashboard/dashboard';
import ItineraryPage from './pages/Itinerary/itinerary';
import ItineraryProvider from './context/ItineraryContext/itinerarycontext';
import Layout from './components/Layout/layout';
import LoginPage from './pages/Login&Register/login';
import MapsPage from './pages/Maps/maps';
import ProfilePage from './pages/Profile/profile';
import ProtectedRoutes from './components/ProtectedRoutes/protectedroutes';
import RegisterPage from './pages/Login&Register/register';
import UserProvider from './context/UserContext/usercontext';
import WeatherPage from './pages/Weather/weather';
import AcceptSuccess from './pages/Collaboration/acceptsuccess';

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/collab-accepted" element={<AcceptSuccess />} />
                    <Route element={<ProtectedRoutes />}>
                        <Route element={
                            <UserProvider>
                                <ItineraryProvider>
                                    <Layout />
                                </ItineraryProvider>
                            </UserProvider>
                        }>
                            <Route path="/about" element={<AboutPage />} />
                            <Route path="/budget" element={<BudgetPage />} />
                            <Route path="/budget/:id" element={<BudgetLayoutPage />} />
                            <Route path="/budget/:id/:xRate/all-expenditure" element={<AllExpenditurePage />} />
                            <Route path="/create-itinerary" element={<CreateItineraryPage />} />
                            <Route path="/dashboard" element={<DashboardPage />} />
                            <Route path="/itinerary/:id" element={<ItineraryPage />} />
                            <Route path="/maps" element={<MapsPage />} />
                            <Route path="/profile" element={<ProfilePage />} />
                            <Route path="/weather" element={<WeatherPage />} />
                        </Route>
                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter >
    );
}

export default App;
