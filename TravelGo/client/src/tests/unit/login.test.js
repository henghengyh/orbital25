import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { axiosInstance, mockLocation, mockSetAuth, renderWithAuth } from './test-utils';
import Login from '../../pages/Login&Register/login';

beforeEach(() => renderWithAuth(<Login />));

describe("Login component", () => {
    test("renders email, password inputs and login button", () => {
        expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
        expect(screen.getByText(/don't have an account?/i)).toBeInTheDocument();
        expect(screen.getByText(/register/i)).toBeInTheDocument();
    });

    test("login successfully with correct auth state", async () => {
        axiosInstance.post.mockResolvedValue({
            data: {
                token: "fake-token",
                user: { _id: '123', name: 'testuser', email: 'unit@test.com' },
            }
        });

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

        userEvent.type(screen.getByPlaceholderText(/email/i), 'unit@test.co');
        userEvent.type(screen.getByPlaceholderText(/password/i), 'PASSword123!!');
        userEvent.click(screen.getByRole('button', { name: /log in/i }));

        expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
    });

    test("show message after successful registration", async () => {
        mockLocation.state = {
            fromRegister: true,
            message: "Registration successful! Please log in.",
        };

        renderWithAuth(<Login />)

        expect(screen.getByText(/registration successful! please log in/i)).toBeInTheDocument();
    });

    test("show message when visiting protected routes without being authenticated", async () => {
        mockLocation.state = {
            fromProtectedRoute: true,
            message: "Please log in to continue.",
        };

        renderWithAuth(<Login />)

        expect(screen.getByText(/please log in to continue/i)).toBeInTheDocument();
    });
});