import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { renderWithProvAuth } from "./test-helper"

describe("Toggling between Login and Register page", () => {
    test("navigate to Register page", async () => {
        renderWithProvAuth();
        userEvent.click(screen.getByText(/register/i));

        await waitFor(() => expect(screen.getByRole('heading', { name: /register/i })).toBeInTheDocument());
    });

    test("navigate to Login page", async () => {
        renderWithProvAuth('/register');
        userEvent.click(screen.getByText(/log in/i));

        await waitFor(() => expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument());
    });
})