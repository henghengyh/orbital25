import { useEffect } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render } from '@testing-library/react';
import Modal from 'react-modal';

import { mockUser1 } from '../mock-const';
import AboutPage from '../../pages/About/about';
import AllExpenditurePage from '../../pages/Budget/allexpenditure';
import AuthProvider, { useAuth } from '../../context/AuthContext/authcontext';
import axiosInstance from '../../utils/axiosInstance';
import BudgetLayoutPage from '../../components/Layout/budgetlayout';
import BudgetPage from '../../pages/Budget/budget';
import CreateItineraryPage from '../../pages/Itinerary/createitinerary';
import DashboardPage from '../../pages/Dashboard/dashboard';
import ItineraryPage from '../../pages/Itinerary/itinerary';
import ItineraryProvider from '../../context/ItineraryContext/itinerarycontext';
import Layout from '../../components/Layout/layout';
import LoginPage from '../../pages/Login&Register/login';
import MapsPage from '../../pages/Maps/maps';
import ProfilePage from '../../pages/Profile/profile';
import ProtectedRoute from '../../components/ProtectedRoutes/protectedroutes';
import RegisterPage from '../../pages/Login&Register/register';
import UserProvider from '../../context/UserContext/usercontext';
import WeatherPage from '../../pages/Weather/weather';

jest.mock('../../utils/axiosInstance', () => ({
    post: jest.fn(),
    get: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
}));

beforeAll(() => {
    const root = document.createElement('div');
    root.id = 'root';
    document.body.appendChild(root);
    Modal.setAppElement('#root');
});

beforeEach(() => {
    // mock AuthContext
    axiosInstance.get.mockResolvedValue({ data: { user: { _id: '123', name: 'testuser', email: 'unit@test.com' } } });
    // mock UserContext
    axiosInstance.get.mockResolvedValueOnce({ data: { user: mockUser1 } });
    localStorage.setItem('token', 'fake-token');
});
afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
});

const renderWithProvAuth = (initialRoute = '/') => {
    return render(
        <MemoryRouter initialEntries={[initialRoute]}>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route path='/register' element={<RegisterPage />} />
                    <Route element={<ProtectedRoute />}>
                        <Route element={
                            <UserProvider>
                                <ItineraryProvider>
                                    <Layout />
                                </ItineraryProvider>
                            </UserProvider>}>
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
        </MemoryRouter>
    )
};

const AuthStateInjector = ({ override, children }) => {
    const { setAuth } = useAuth();

    useEffect(() => {
        if (override) {
            setAuth(prev => ({
                ...prev,
                ...override,
                loading: false,
            }));
        }
    }, [override, setAuth]);

    return children;
};

const TestAuthProvider = ({ authOverride, children }) => {
    return (
        <AuthProvider>
            <AuthStateInjector override={authOverride}>
                {children}
            </AuthStateInjector>
        </AuthProvider>
    );
};

const renderWithMockAuth = (authValue, initialRoute = '/dashboard') => {
    return render(
        <MemoryRouter initialEntries={[initialRoute]}>
            <TestAuthProvider authOverride={authValue}>
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route element={<ProtectedRoute />}>
                        <Route element={
                            <UserProvider>
                                <ItineraryProvider>
                                    <Layout />
                                </ItineraryProvider>
                            </UserProvider>}>
                            <Route path='/dashboard' element={<DashboardPage />} />
                        </Route>
                    </Route>
                </Routes>
            </TestAuthProvider>
        </MemoryRouter>
    );
};

export { axiosInstance, renderWithMockAuth, renderWithProvAuth };