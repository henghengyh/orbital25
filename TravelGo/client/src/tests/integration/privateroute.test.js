import { useEffect } from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { render, screen } from "@testing-library/react";

import AuthProvider, { useAuth } from "../../context/AuthContext/authcontext";
import DashboardPage from "../../pages/Dashboard/dashboard";
import ItineraryProvider from "../../context/ItineraryContext/itinerarycontext";
import Layout from "../../components/Layout/layout";
import LoginPage from "../../pages/Login&Register/login";
import ProtectedRoute from "../../components/ProtectedRoutes/protectedroutes";
import UserProvider from "../../context/UserContext/usercontext";

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

describe("Private routes", () => {
    test("visiting private routes when authenticated", () => {
        renderWithMockAuth({ isAuthenticated: true, loading: false, logout: false });

        expect(screen.getByRole('button', { name: /create itinerary/i })).toBeInTheDocument();
    });

    test("visiting private routes when not authenticated and not logout", () => {
        renderWithMockAuth({ isAuthenticated: false, loading: false, logout: false });

        expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
        expect(screen.getByText(/please log in to continue/i)).toBeInTheDocument();
    });

    test("visiting private routes when not authenticated and logout", () => {
        renderWithMockAuth({ isAuthenticated: false, loading: false, logout: true });

        expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
        expect(screen.queryByText(/please log in to continue/i)).not.toBeInTheDocument();
    });
})