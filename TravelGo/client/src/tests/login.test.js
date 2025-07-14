import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithAuth, mockSetAuth, axiosInstance } from './test-utils';
import AuthProvider from '../context/AuthContext/authcontext';
import DashboardPage from '../pages/Dashboard/dashboard';
import ItineraryProvider from '../context/ItineraryContext/itinerarycontext';
import Layout from '../components/Layout/layout';
import Login from '../pages/Login&Register/login';
import UserProvider from '../context/UserContext/usercontext';

let mockLocation = null;
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => ({ state: mockLocation }),
}));

beforeEach(() => {
    mockLocation = null;
});

// unit test
describe("Login component", () => {
    test("renders email, password inputs and login button", () => {
        renderWithAuth(<Login />);

        expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
    });

    test("login successfully with correct auth state", async () => {
        axiosInstance.post.mockResolvedValue({
            data: {
                token: "fake-token",
                user: { _id: '123', name: 'testuser', email: 'unit@test.com' },
            }
        });

        renderWithAuth(<Login />);
        userEvent.type(screen.getByPlaceholderText(/email/i), 'unit@test.com');
        userEvent.type(screen.getByPlaceholderText(/password/i), 'PASSword123!');
        userEvent.click(screen.getByRole('button', { name: /log in/i }));

        await waitFor(() => {
            expect(mockSetAuth).toHaveBeenCalledWith({
                user: { _id: '123', name: 'testuser', email: 'unit@test.com' },
                token: 'fake-token',
                isAuthenticated: true,
                loading: false,
            })
        })
    });

    test("show error on invalid email", async () => {
        renderWithAuth(<Login />);
        userEvent.type(screen.getByPlaceholderText(/email/i), 'invalidemail');
        userEvent.type(screen.getByPlaceholderText(/password/i), 'password123');
        userEvent.click(screen.getByRole('button', { name: /log in/i }));

        expect(await screen.findByText(/invalid email/i)).toBeInTheDocument();
    });

    test("show error on incorrect email and/or password", async () => {
        axiosInstance.post.mockRejectedValue({
            response: {
                data: { message: "Invalid credentials" },
            },
        });

        renderWithAuth(<Login />);
        userEvent.type(screen.getByPlaceholderText(/email/i), 'unit@test.co');
        userEvent.type(screen.getByPlaceholderText(/password/i), 'PASSword123!!');
        userEvent.click(screen.getByRole('button', { name: /log in/i }));

        expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
    });

    test("show message after successful registration", async () => {
        mockLocation = {
            fromRegister: true,
            message: "Registration successful! Please log in.",
        };

        renderWithAuth(<Login />);

        expect(screen.getByText(/registration successful! please log in/i)).toBeInTheDocument();
    });

    test("no message if not from registering successfully", async () => {
        renderWithAuth(<Login />);

        expect(screen.queryByText(/registration successful! please log in/i)).not.toBeInTheDocument();
    });
});

// integration test
describe("Login flow", () => {
    test("successful (new user) login and redirects to dashboard", async () => {
        axiosInstance.post.mockResolvedValue({
            data: {
                token: "fake-token",
                user: { _id: '123', name: 'testuser', email: 'unit@test.com' },
            }
        });
        axiosInstance.get.mockResolvedValueOnce({
            data: {
                user: { _id: '123', name: 'testuser', email: 'unit@test.com' },
            }
        });
        axiosInstance.get.mockResolvedValueOnce({
            data: {
                itineraries: [],
            }
        });

        render(
            <MemoryRouter initialEntries={['/']}>
                <AuthProvider>
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route element={<UserProvider>
                            <ItineraryProvider>
                                <Layout />
                            </ItineraryProvider>
                        </UserProvider>}>
                            <Route path='/dashboard' element={<DashboardPage />} />
                        </Route>
                    </Routes>
                </AuthProvider>
            </MemoryRouter>
        );
        userEvent.type(screen.getByPlaceholderText(/email/i), 'unit@test.com');
        userEvent.type(screen.getByPlaceholderText(/password/i), 'PASSword123!');
        userEvent.click(screen.getByRole('button', { name: /log in/i }));

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /create itinerary/i })).toBeInTheDocument();
            expect(screen.getByText((text) => text.includes("Click the '+' button to start creating your itinerary"))).toBeInTheDocument();
        })
    });

    test("successful (existing) login and redirects to dashboard", async () => {
        axiosInstance.post.mockResolvedValue({
            data: {
                token: "fake-token",
                user: { _id: '123', name: 'testuser', email: 'unit@test.com' },
            }
        });
        axiosInstance.get.mockResolvedValueOnce({
            data: {
                user: { _id: '123', name: 'testuser', email: 'unit@test.com' },
            }
        });
        axiosInstance.get.mockResolvedValueOnce({
            data: {
                itineraries: [
                    {
                        _id: "1",
                        tripName: "Test Trip",
                        destination: "Singapore",
                        imageNumber: 3,
                        startDate: "2025-07-13",
                        endDate: "2025-07-13",
                        numberOfPeople: 1,
                    },
                ],
            }
        });

        render(
            <MemoryRouter initialEntries={['/']}>
                <AuthProvider>
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route element={<UserProvider>
                            <ItineraryProvider>
                                <Layout />
                            </ItineraryProvider>
                        </UserProvider>}>
                            <Route path='/dashboard' element={<DashboardPage />} />
                        </Route>
                    </Routes>
                </AuthProvider>
            </MemoryRouter>
        );
        userEvent.type(screen.getByPlaceholderText(/email/i), 'unit@test.com');
        userEvent.type(screen.getByPlaceholderText(/password/i), 'PASSword123!');
        userEvent.click(screen.getByRole('button', { name: /log in/i }));

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /create itinerary/i })).toBeInTheDocument();
            expect(screen.getByText(/test trip/i)).toBeInTheDocument();
            expect(screen.getByText(/singapore/i)).toBeInTheDocument();
            expect(screen.getByText(/13th jul 2025/i)).toBeInTheDocument();
            expect(screen.getByText(/number of people: 1/i)).toBeInTheDocument();
        })
    })
});