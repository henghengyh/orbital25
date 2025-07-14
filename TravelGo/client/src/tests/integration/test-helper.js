import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render } from '@testing-library/react';

import { mockUser } from './mock-const';
import AuthProvider from '../../context/AuthContext/authcontext';
import axiosInstance from '../../utils/axiosInstance';
import DashboardPage from '../../pages/Dashboard/dashboard';
import ItineraryProvider from '../../context/ItineraryContext/itinerarycontext';
import Layout from '../../components/Layout/layout';
import LoginPage from '../../pages/Login&Register/login';
import ProfilePage from '../../pages/Profile/profile';
import ProtectedRoute from '../../components/ProtectedRoutes/protectedroutes';
import RegisterPage from '../../pages/Login&Register/register';
import UserProvider from '../../context/UserContext/usercontext';

jest.mock('../../utils/axiosInstance', () => ({
    post: jest.fn(),
    get: jest.fn(),
}));

beforeEach(() => {
    // mock AuthContext
    axiosInstance.get.mockResolvedValue({ data: { user: { _id: '123', name: 'testuser', email: 'unit@test.com' } } });
    // mock UserContext
    axiosInstance.get.mockResolvedValueOnce({ data: { user: mockUser } });
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
                            <Route path='/dashboard' element={<DashboardPage />} />
                            <Route path='/profile' element={<ProfilePage />} />
                        </Route>
                    </Route>
                </Routes>
            </AuthProvider>
        </MemoryRouter>
    )
};

export { axiosInstance, renderWithProvAuth };