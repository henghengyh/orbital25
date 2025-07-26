import { screen, waitFor } from "@testing-library/react";

import { axiosInstance, renderWithMockAuth } from "./test-helper";
import { mockItinerary } from "../mock-const";

describe("Private routes", () => {
    test("visiting private routes when authenticated", async () => {
        axiosInstance.get.mockResolvedValue({ data: { itineraries: mockItinerary } });

        renderWithMockAuth({ isAuthenticated: true, loading: false, logout: false });

        await waitFor(() => expect(screen.getByRole('button', { name: /create itinerary/i })).toBeInTheDocument());
    });

    test("visiting private routes when not authenticated and not logout", async () => {
        renderWithMockAuth({ isAuthenticated: false, loading: false, logout: false });

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
            expect(screen.getByText(/please log in to continue/i)).toBeInTheDocument();
        })
    });

    test("visiting private routes when not authenticated and logout", async () => {
        renderWithMockAuth({ isAuthenticated: false, loading: false, logout: true });

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
            expect(screen.queryByText(/please log in to continue/i)).not.toBeInTheDocument();
        })
    });
})