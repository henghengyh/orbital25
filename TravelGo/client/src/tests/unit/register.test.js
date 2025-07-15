import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { axiosInstance, mockNavigate, renderWithAuth } from './test-utils';
import Register from '../../pages/Login&Register/register';

beforeEach(() => renderWithAuth(<Register />));

describe("Register component", () => {
    test("renders username, email, password inputs and register button", () => {
        expect(screen.getByRole('heading', { name: /register/i })).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
        expect(screen.getByText(/already have an account?/i)).toBeInTheDocument();
        expect(screen.getByText(/log in/i)).toBeInTheDocument();
    });

    test("register successfully and navigate to login page", async () => {
        axiosInstance.post.mockResolvedValue({
            data: {
                success: true,
                message: "User testuser registered successfully"
            }
        });

        userEvent.type(screen.getByPlaceholderText(/username/i), 'testuser');
        userEvent.type(screen.getByPlaceholderText(/email/i), 'unit@test.com');
        userEvent.type(screen.getByPlaceholderText(/password/i), 'PASSword123!');
        userEvent.click(screen.getByRole('button', { name: /register/i }));

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/', {
                state: {
                    fromRegister: true,
                    message: "Registration successful! Please log in."
                }
            });
        })
    });

    test("show error on invalid email", async () => {
        userEvent.type(screen.getByPlaceholderText(/username/i), 'testuser');
        userEvent.type(screen.getByPlaceholderText(/email/i), 'invalidemail');
        userEvent.type(screen.getByPlaceholderText(/password/i), 'password123');
        userEvent.click(screen.getByRole('button', { name: /register/i }));

        expect(await screen.findByText(/invalid email/i)).toBeInTheDocument();
    });

    test("show error on existing email", async () => {
        axiosInstance.post.mockRejectedValue({
            response: {
                data: { message: "Email already exists" },
            },
        });

        userEvent.type(screen.getByPlaceholderText(/username/i), "anotheruser");
        userEvent.type(screen.getByPlaceholderText(/email/i), 'unit@test.com');
        userEvent.type(screen.getByPlaceholderText(/password/i), 'password');
        userEvent.click(screen.getByRole('button', { name: /register/i }));

        expect(await screen.findByText(/email already exists/i)).toBeInTheDocument();
    });

    test("show error on weak password", async () => {
        axiosInstance.post.mockRejectedValue({
            response: {
                data: {
                    success: false,
                    message: "Password is too weak",
                    feedback: "Add another word or two. Uncommon words are better."
                },
            },
        });

        userEvent.type(screen.getByPlaceholderText(/username/i), "anotheruser");
        userEvent.type(screen.getByPlaceholderText(/email/i), 'new@email.com');
        userEvent.type(screen.getByPlaceholderText(/password/i), 'password');
        userEvent.click(screen.getByRole('button', { name: /register/i }));

        expect(await screen.findByText(/password too weak./i)).toBeInTheDocument();
    });
});