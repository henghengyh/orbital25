import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithAuth, mockSetAuth, axiosInstance } from './UnitTest/test-utils';
import Register from '../pages/Login&Register/register';

describe("Register component", () => {
    // test("")

    test("renders username, email, password inputs and register button", () => {
        renderWithAuth(<Register />);

        expect(screen.getByRole('heading', {name: /register/i})).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
    });
});