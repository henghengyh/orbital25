import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { axiosInstance, mockNavigate, renderWithAuth } from './test-utils';
import { mockItinerary } from '../mock-const';
import { useItinerary } from '../../context/ItineraryContext/itinerarycontext';
import Dashboard from '../../pages/Dashboard/dashboard';

jest.mock('../../context/ItineraryContext/itinerarycontext', () => ({
    useItinerary: jest.fn(),
}));

const mockAllItineraries = jest.fn();
const mockSearchResults = jest.fn();

beforeEach(() => {
    useItinerary.mockReturnValue({
        allItineraries: mockItinerary,
        setAllItineraries: mockAllItineraries,
        loading: false,
        setLoading: jest.fn(),
        searched: false,
        setSearched: jest.fn(),
        searchResults: [],
        setSearchResults: mockSearchResults,
    });
    axiosInstance.get.mockResolvedValueOnce({ data: { itineraries: mockItinerary } });
});

describe("Dashboard component", () => {
    test("renders dashboard with all itineraries, calender, create itinerary button", async () => {
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
        renderWithAuth(<Dashboard />);

        expect(screen.getByRole('article', { name: /itinerary card test trip/i })).toBeInTheDocument();
        expect(screen.getByAltText(/singapore/i)).toBeInTheDocument();
        expect(screen.getByText(/test trip/i)).toBeInTheDocument();
        expect(screen.getByText(/singapore/i)).toBeInTheDocument();
        expect(screen.getByText(text => text.includes("13th Jul 2025 - 13th Jul 2025"))).toBeInTheDocument();
        expect(screen.getByText(text => text.includes("Number Of People: 1"))).toBeInTheDocument();
    });

    test("navigate to itinerary page when create itinerary button is clicked", () => {
        renderWithAuth(<Dashboard />);
        userEvent.click(screen.getByRole('button', { name: /create itinerary/i }));

        expect(mockNavigate).toHaveBeenCalledWith('/create-itinerary');
    });

    test("navigate to itinerary page when itinerary card is clicked", () => {
        renderWithAuth(<Dashboard />);
        userEvent.click(screen.getByRole('article', { name: /itinerary card test trip/i }));

        expect(mockNavigate).toHaveBeenCalledWith('/itinerary/1');
    });

    // test("only weekend getaway itinerary shown when filtered by date range", async () => {
    // useItinerary.mockReturnValueOnce({
    //     allItineraries: mockItinerary,
    //     setAllItineraries: mockAllItineraries,
    //     loading: false,
    //     setLoading: jest.fn(),
    //     searched: false,
    //     setSearched: jest.fn(),
    //     searchResults: [],
    //     setSearchResults: mockSearchResults,
    // });
    // axiosInstance.get.mockResolvedValueOnce({ data: { itineraries: [mockItinerary[1]] } });

    // jest.useFakeTimers();
    // jest.setSystemTime(new Date("2025-07-15"));
    // renderWithAuth(<Dashboard />);
    // userEvent.click(screen.getAllByRole('button', { name: /go to the next month/i })[0]);
    // userEvent.click(screen.getAllByRole('gridcell', { name: '1' })[0]);
    // userEvent.click(screen.getAllByRole('gridcell', { name: '3' })[0]);

    // useItinerary.mockReturnValueOnce({
    //     allItineraries: mockItinerary,
    //     setAllItineraries: mockAllItineraries,
    //     loading: false,
    //     setLoading: jest.fn(),
    //     searched: true,
    //     setSearched: jest.fn(),
    //     searchResults: [mockItinerary[1]],
    //     setSearchResults: mockSearchResults,
    // });

    // await waitFor(() => {
    //             expect(axiosInstance.get).toHaveBeenCalledWith(
    //     expect.stringContaining("startDate=2025-08-01&endDate=2025-08-03")
    //   );
    // expect(mockSearchResults).toHaveBeenCalledWith([mockItinerary[1]]);
    //         expect(screen.getByRole("article", { name: /itinerary card weekend getaway/i })).toBeInTheDocument();
    //         expect(screen.queryByRole("article", { name: /itinerary card test trip/i })).not.toBeInTheDocument();
    //         expect(screen.queryByRole("article", { name: /itinerary card nature retreat/i })).not.toBeInTheDocument();
    //     });

    //     jest.useRealTimers();
    // });
});