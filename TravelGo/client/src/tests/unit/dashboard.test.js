import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { axiosInstance, mockNavigate, renderWithAuth } from './test-utils';
import { mockItinerary } from '../mock-const';
import { searchByDate } from '../../utils/helper';
import { useItinerary } from '../../context/ItineraryContext/itinerarycontext';
import Dashboard from '../../pages/Dashboard/dashboard';

jest.mock('../../context/ItineraryContext/itinerarycontext', () => ({
    useItinerary: jest.fn(),
}));

const mockAllItineraries = jest.fn();
const mockSearchResults = jest.fn();
const mockDateRange = jest.fn();
const mockLoading = jest.fn();
const mockSearched = jest.fn();

beforeEach(() => {
    useItinerary.mockReturnValue({
        allItineraries: mockItinerary,
        setAllItineraries: mockAllItineraries,
        loading: false,
        setLoading: mockLoading,
        searched: false,
        setSearched: mockSearched,
        searchResults: [],
        setSearchResults: mockSearchResults,
    });
});

describe("Dashboard component", () => {
    test("renders dashboard with all itineraries, calender, create itinerary button", async () => {
        axiosInstance.get.mockResolvedValueOnce({ data: { itineraries: mockItinerary } });

        renderWithAuth(<Dashboard />);
        const currentMonthYear = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

        await waitFor(() => {
            expect(mockAllItineraries).toHaveBeenCalledWith(mockItinerary);
            expect(screen.getByRole('article', { name: /itinerary card test trip/i })).toBeInTheDocument();
            expect(screen.getByRole('article', { name: /itinerary card weekend getaway/i })).toBeInTheDocument();
            expect(screen.getByRole('article', { name: /itinerary card nature retreat/i })).toBeInTheDocument();
            expect(within(screen.getByRole('listbox', { name: /calender/i })).getByText(text => text.includes(currentMonthYear))).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /create itinerary/i })).toBeInTheDocument();
        });
    });

    test("renders itinerary card with relevant info", () => {
        axiosInstance.get.mockResolvedValueOnce({ data: { itineraries: mockItinerary } });
        renderWithAuth(<Dashboard />);

        expect(screen.getByRole('article', { name: /itinerary card test trip/i })).toBeInTheDocument();
        expect(screen.getByAltText(/singapore/i)).toBeInTheDocument();
        expect(screen.getByText(/test trip/i)).toBeInTheDocument();
        expect(screen.getByText(/singapore/i)).toBeInTheDocument();
        expect(screen.getByText(text => text.includes("13th Jul 2025 - 13th Jul 2025"))).toBeInTheDocument();
        expect(screen.getByText(text => text.includes("Number Of People: 1"))).toBeInTheDocument();
    });

    test("navigate to itinerary page when create itinerary button is clicked", () => {
        axiosInstance.get.mockResolvedValueOnce({ data: { itineraries: mockItinerary } });

        renderWithAuth(<Dashboard />);
        userEvent.click(screen.getByRole('button', { name: /create itinerary/i }));

        expect(mockNavigate).toHaveBeenCalledWith('/create-itinerary');
    });

    test("navigate to itinerary page when itinerary card is clicked", () => {
        axiosInstance.get.mockResolvedValueOnce({ data: { itineraries: mockItinerary } });

        renderWithAuth(<Dashboard />);
        userEvent.click(screen.getByRole('article', { name: /itinerary card test trip/i }));

        expect(mockNavigate).toHaveBeenCalledWith('/itinerary/1');
    });

    test("no API calls when only one date is selected", async () => {
        searchByDate(
            { from: new Date('2025-08-01'), to: new Date('2025-08-01') },
            mockDateRange,
            mockLoading,
            mockSearched,
            mockSearchResults
        );

        await waitFor(() => {
            expect(axiosInstance.get).not.toHaveBeenCalled();
            expect(mockSearched).toHaveBeenCalledWith(false);
            expect(mockSearchResults).toHaveBeenCalledWith([]);
        });
    });

    test("only weekend getaway itinerary is shown when 2 dates are selected", async () => {
        axiosInstance.get.mockResolvedValueOnce({ data: { itineraries: [mockItinerary[1]] } });

        searchByDate(
            { from: new Date('2025-08-01'), to: new Date('2025-08-03') },
            mockDateRange,
            mockLoading,
            mockSearched,
            mockSearchResults
        );

        await waitFor(() => {
            expect(axiosInstance.get).toHaveBeenCalledWith("/itineraries/filter", {
                params: {
                    start: expect.stringContaining("2025-08-01"),
                    end: expect.stringContaining("2025-08-03"),
                },
            });
            expect(mockSearchResults).toHaveBeenCalledWith([mockItinerary[1]]);
            expect(mockSearched).toHaveBeenCalledWith(true);
        });
    });
});