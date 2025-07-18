import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { axiosInstance, renderWithProvAuth } from './test-helper';
import { mockUser1 } from "../mock-const";

describe("Logout flow", () => {
    test("logout modal appears when click on logout link in navbar", async () => {
        axiosInstance.get.mockResolvedValueOnce({ data: { itineraries: [] } });

        renderWithProvAuth('/dashboard');
        await screen.findByText((text) => text.includes("Click the '+' button to start creating your itinerary"));
        userEvent.click(screen.getByText(/logout/i));

        expect(screen.getByRole('heading', { name: /confirm logout/i })).toBeInTheDocument();
        expect(screen.getByText(/are you sure you want to log out?/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
        expect(within(screen.getByRole('dialog', { name: /logout modal/i })).getByRole('button', { name: /logout/i })).toBeInTheDocument();
    });

    test("logout modal appears when click on logout button in user profile info", async () => {
        axiosInstance.get.mockResolvedValue({ data: { user: mockUser1 } });

        renderWithProvAuth('/profile');
        await screen.findByText(/user profile/i);
        userEvent.click(screen.getByRole('button', { name: 'logout button' }));

        expect(screen.getByRole('heading', { name: /confirm logout/i })).toBeInTheDocument();
        expect(screen.getByText(/are you sure you want to log out?/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
        expect(within(screen.getByRole('dialog', { name: /logout modal/i })).getByRole('button', { name: /logout/i })).toBeInTheDocument();
    });

    test("successful logout after clicking logout button from logout modal", async () => {
        axiosInstance.get.mockResolvedValueOnce({ data: { itineraries: [] } });

        renderWithProvAuth('/dashboard');
        await screen.findByText((text) => text.includes("Click the '+' button to start creating your itinerary"));
        userEvent.click(screen.getByText(/logout/i));
        userEvent.click(within(screen.getByRole('dialog', { name: /logout modal/i })).getByRole('button', { name: /logout/i }));

        expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
        expect(localStorage.getItem("token")).toBeNull();
    });
})