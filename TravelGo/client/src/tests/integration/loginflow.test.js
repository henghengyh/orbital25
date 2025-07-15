import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { axiosInstance, renderWithProvAuth } from './test-helper';
import { mockItinerary } from '../mock-const';

describe("Login flow", () => {
    test("successful (new user) login and redirects to dashboard", async () => {
        axiosInstance.post.mockResolvedValue({
            data: {
                token: "fake-token",
                user: { _id: '123', name: 'testuser', email: 'unit@test.com' },
            }
        });
        axiosInstance.get.mockResolvedValueOnce({ data: { itineraries: [] } });

        renderWithProvAuth();
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
        axiosInstance.get.mockResolvedValueOnce({ data: { itineraries: [mockItinerary] } });

        renderWithProvAuth();
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