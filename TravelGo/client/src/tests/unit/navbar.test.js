import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { axiosInstance, mockLocation, mockNavigate, renderWithAuth } from './test-utils';
import { mockItinerary, mockUser1 } from '../mock-const';
import { useItinerary } from '../../context/ItineraryContext/itinerarycontext';
import Navbar from '../../components/Navbar/navbar';

jest.mock('../../context/ItineraryContext/itinerarycontext', () => ({
    useItinerary: jest.fn(),
}));

const mockSearchResults = jest.fn();

beforeEach(() => {
    useItinerary.mockReturnValue({
        setLoading: jest.fn(),
        setSearched: jest.fn(),
        setSearchResults: mockSearchResults,
    });
    mockLocation.pathname = '/dashboard';
    renderWithAuth(<Navbar user={mockUser1} />);
});

describe("Navbar component", () => {
    test("renders logo, search bar, tabs and profile icon", () => {
        expect(screen.getByText(/travelgo/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/search itinerary/i)).toBeInTheDocument();
        expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
        expect(screen.getByText(/budget/i)).toBeInTheDocument();
        expect(screen.getByText(/weather/i)).toBeInTheDocument();
        expect(screen.getByText(/map/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /profile icon/ })).toBeInTheDocument();
    });

    test("navigates to about page when logo is clicked", () => {
        userEvent.click(screen.getByText(/travelgo/i));

        expect(mockNavigate).toHaveBeenCalledWith('/about');
    });

    test("able to search for itineraries using the search bar", async () => {
        axiosInstance.get.mockResolvedValue({ data: { itineraries: mockItinerary[0] } });

        userEvent.type(screen.getByPlaceholderText(/search itinerary/i), 'test');
        userEvent.click(screen.getByRole('button', { name: /search/i }));

        await waitFor(() => expect(mockSearchResults).toHaveBeenCalledWith(mockItinerary[0]));
    });

    test("navigates to dashboard page when dashboard tab is clicked", () => {
        userEvent.click(screen.getByText(/dashboard/i));

        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });

    test("navigates to budget page when budget tab is clicked", () => {
        userEvent.click(screen.getByText(/budget/i));

        expect(mockNavigate).toHaveBeenCalledWith('/budget');
    });

    test("navigates to weather page when weather tab is clicked", () => {
        userEvent.click(screen.getByText(/weather/i));

        expect(mockNavigate).toHaveBeenCalledWith('/weather');
    });

    test("navigates to map page when map tab is clicked", () => {
        userEvent.click(screen.getByText(/map/i));

        expect(mockNavigate).toHaveBeenCalledWith('/maps');
    });

    test("navigates to profile page when profile tab is clicked", () => {
        userEvent.click(screen.getByRole('button', { name: /profile icon/i }));

        expect(mockNavigate).toHaveBeenCalledWith('/profile');
    });
});