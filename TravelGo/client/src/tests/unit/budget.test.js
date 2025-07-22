import { act, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { axiosInstance, mockParams, renderWithAuth } from "./test-utils";
import { mockBreakdown, mockExpenses, mockItinerary, mockSplitExpenses, mockWeeklyOverview } from "../mock-const";
import AllExpenditure from "../../pages/Budget/allexpenditure";
import AllExpenses from "../../components/Cards/allexpenses";
import BudgetLayout from "../../components/Layout/budgetlayout";
import BudgetPage from "../../pages/Budget/budget";
import ExpensesDetailedCard from "../../components/Cards/expensesdetailedcard";
import RecentExpenses from "../../components/Cards/recentexpenses";
import SplitExpenses from "../../components/Cards/splitexpenses";
import ExpensesInfoCard from "../../components/Cards/expensesinfocard";
import Modal from "react-modal";

beforeAll(() => {
    const root = document.createElement('div');
    root.id = 'root';
    document.body.appendChild(root);
    Modal.setAppElement('#root');
});

describe("Budget component", () => {
    describe("Budget landing page", () => {
        test("renders layout", async () => {
            axiosInstance.get.mockResolvedValueOnce({ data: { itineraries: mockItinerary } });

            renderWithAuth(<BudgetPage />);

            await waitFor(() => {
                expect(screen.getByRole('heading', { name: 'Select Your Trip' })).toBeInTheDocument();
                expect(screen.getByText('Start by choosing a trip and budget to begin logging your expenses.')).toBeInTheDocument();
                expect(screen.getByAltText('Analytics')).toBeInTheDocument();
                expect(screen.getByAltText('calculator')).toBeInTheDocument();
                expect(screen.getByRole('combobox')).toBeInTheDocument();
                expect(screen.getByRole('combobox')).toHaveDisplayValue('Select one:');
            });
        });
    });

    describe("Budget main page", () => {
        test("renders layout", async () => {
            mockParams.mockReturnValue({ id: 1 });
            axiosInstance.get.mockResolvedValueOnce({ data: { budget: { "0": { itinerayTitle: "test trip", budget: 1000 } } } });
            axiosInstance.get.mockResolvedValueOnce({ data: { allExpenses: mockExpenses } });
            axiosInstance.get.mockResolvedValueOnce({ data: { recentExpenses: [...mockExpenses].reverse().slice(0, 4) } });
            axiosInstance.get.mockResolvedValueOnce({ data: { weeklyOverview: mockWeeklyOverview("2025-07-28", mockExpenses) } });
            axiosInstance.get.mockResolvedValueOnce({ data: { latestExpenses: [...mockExpenses].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8) } });
            axiosInstance.get.mockResolvedValueOnce({ data: { expensesBreakdown: mockBreakdown(mockExpenses) } });
            axiosInstance.get.mockResolvedValueOnce({ data: { splitExpenses: mockSplitExpenses(mockExpenses) } });

            renderWithAuth(<BudgetLayout />);

            await waitFor(() => {
                expect(screen.getByText('Itinerary:')).toBeInTheDocument();
                expect(screen.getByText('Current Currency:')).toBeInTheDocument();
                expect(screen.getByRole('heading', { name: 'Total Budget:' })).toBeInTheDocument();
                expect(screen.getByRole('heading', { name: 'Total Expenses:' })).toBeInTheDocument();
                expect(screen.getByRole('heading', { name: 'Remaining Amount:' })).toBeInTheDocument();
                expect(screen.getByRole('button', { name: 'Add Expenses' })).toBeInTheDocument();

                expect(screen.getByText('Expenses Overview')).toBeInTheDocument();
                expect(screen.getByText('Recent Expenditure')).toBeInTheDocument();
                expect(screen.getByText('Weekly Overview')).toBeInTheDocument();
                expect(screen.getByText('All Expenditure')).toBeInTheDocument();
                expect(screen.getByText('Expenses Breakdown')).toBeInTheDocument();
                expect(screen.getByText('Split Expenses')).toBeInTheDocument();
            });
        });

        test("renders recent expenditure", async () => {
            jest.useFakeTimers();
            renderWithAuth(<RecentExpenses recentExpenses={[...mockExpenses].reverse().slice(0, 4)} xRate={1} />);
            act(() => jest.advanceTimersByTime(1000));

            await waitFor(() => {
                expect(screen.getByText('Recent Expenditure')).toBeInTheDocument();
                expect(screen.getByText(/grab ride/i)).toBeInTheDocument();
                expect(screen.getByText(/250/i)).toBeInTheDocument();
                expect(screen.getByText(/laundry/i)).toBeInTheDocument();
                expect(screen.getByText(/1st aug 2025/i)).toBeInTheDocument();
            });

            jest.useRealTimers();
        });

        test("renders all expenditure", async () => {
            jest.useFakeTimers();
            renderWithAuth(<AllExpenses latestExpenses={[...mockExpenses].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8)} xRate={1} />);
            act(() => jest.advanceTimersByTime(1000));

            await waitFor(() => {
                expect(screen.getByText('All Expenditure')).toBeInTheDocument();
                expect(screen.getByRole('button', { name: 'Show More' })).toBeInTheDocument();
                expect(screen.getByText(/grab ride/i)).toBeInTheDocument();
                expect(screen.getByText(/250/i)).toBeInTheDocument();
                expect(screen.getByText(/laundry/i)).toBeInTheDocument();
                expect(screen.getByText(/souvenirs/i)).toBeInTheDocument();
                expect(screen.getByText(/65/i)).toBeInTheDocument();
                expect(screen.getByText(/petronas/i)).toBeInTheDocument();
                expect(screen.getByText(/320/i)).toBeInTheDocument();
            });

            jest.useRealTimers();
        });

        test("renders split expenses", async () => {
            jest.useFakeTimers();
            renderWithAuth(<SplitExpenses totalExpenses={mockExpenses} splitExpenses={mockSplitExpenses(mockExpenses)} xRate={1} />);
            act(() => jest.advanceTimersByTime(1000));

            await waitFor(() => {
                expect(screen.getByText('Split Expenses')).toBeInTheDocument();
                expect(screen.getByRole('button', { name: 'Show More' })).toBeInTheDocument();
                expect(screen.getByText(/From: Jane/i)).toBeInTheDocument();
                expect(screen.getByText(/To: John/i)).toBeInTheDocument();
                expect(screen.getByText(/15/i)).toBeInTheDocument();
            });

            jest.useRealTimers();
        });

        test("renders split expenses modal", async () => {
            jest.useFakeTimers();
            renderWithAuth(<SplitExpenses totalExpenses={850} splitExpenses={mockSplitExpenses(mockExpenses)} xRate={1} />);
            act(() => jest.advanceTimersByTime(1000));
            await waitFor(() => expect(screen.getByText('Split Expenses')).toBeInTheDocument());
            userEvent.click(screen.getByRole('button', { name: 'Show More' }));

            await waitFor(() => {
                expect(screen.getAllByText('Split Expenses')).toHaveLength(2);
                expect(screen.getByRole('button', { name: 'Show More' })).toBeInTheDocument();
                expect(screen.getByText(/Total Expenses: \$850.00/i)).toBeInTheDocument();
                expect(screen.getByText(/Expenses Per Person: \$425.00/i)).toBeInTheDocument();
                expect(screen.getByText(/Name/i)).toBeInTheDocument();
                expect(screen.getByText(/Paid/i)).toBeInTheDocument();
                expect(screen.getByText(/Net Balance/i)).toBeInTheDocument();
                expect(screen.getByText(/Who to Pay\?/i)).toBeInTheDocument();
            });

            jest.useRealTimers();
        });

        test("renders expenses info card", async () => {
            renderWithAuth(<ExpensesInfoCard data={mockExpenses[0]} xRate={1} />);

            await waitFor(() => {
                expect(screen.getByAltText('accommodation')).toBeInTheDocument();
                expect(screen.getByText(/hotel stay at/i)).toBeInTheDocument();
                expect(screen.getByText('1st Aug 2025')).toBeInTheDocument();
                expect(screen.getByText('$320.00')).toBeInTheDocument();
            });

            userEvent.hover(screen.getByText(/hotel stay at/i).closest('div'));

            await waitFor(() => {
                expect(screen.getByTestId('pencil')).toBeVisible();
                expect(screen.getByTestId('trash')).toBeVisible();
            });
        });
    });

    describe("All expenditure page", () => {
        test("renders layout", async () => {
            mockParams.mockReturnValue({ id: 2, xRate: 1 })
            axiosInstance.get.mockResolvedValueOnce({ data: { allExpenses: [] } });

            renderWithAuth(<AllExpenditure />);

            await waitFor(() => {
                expect(screen.getByText('All Expenditure for Itinerary')).toBeInTheDocument();
                expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument();
                expect(screen.getByRole('button', { name: 'Add Expenses' })).toBeInTheDocument();
                expect(screen.getByRole('button', { name: 'Filter By:' })).toBeInTheDocument();
            });

            userEvent.click(within(screen.getByRole('button', { name: 'Filter By:' })).getByTestId('filter-icon'));

            await waitFor(() => {
                expect(screen.getByText('Search by keyword:')).toBeInTheDocument();
                expect(screen.getByText('Type:')).toBeInTheDocument();
                expect(screen.getByText('Who Paid:')).toBeInTheDocument();
                expect(screen.getByText('Date')).toBeInTheDocument();
                expect(screen.getByText('Amount')).toBeInTheDocument();
                expect(screen.getByText('Currency:')).toBeInTheDocument();
                expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument();
                expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
            });
        });

        test("renders detailed expenses card", async () => {
            renderWithAuth(<ExpensesDetailedCard data={mockExpenses[0]} xRate={1} />);

            await waitFor(() => {
                expect(screen.getByText(/hotel stay at/i)).toBeInTheDocument();
                expect(screen.getByText('1st Aug 2025')).toBeInTheDocument();
                expect(screen.getByText('$320.00')).toBeInTheDocument();
                expect(screen.getByText('Type:')).toBeInTheDocument();
                expect(screen.getByText('accommodation')).toBeInTheDocument();
                expect(screen.getByText('Paid by:')).toBeInTheDocument();
                expect(screen.getByText('john')).toBeInTheDocument();
                expect(screen.getByText('Notes:')).toBeInTheDocument();
                expect(screen.getByText('2-night stay with breakfast')).toBeInTheDocument();
            });

            userEvent.hover(screen.getByText(/hotel stay at/i).closest('div'));

            await waitFor(() => {
                expect(screen.getByTestId('pencil')).toBeVisible();
                expect(screen.getByTestId('trash')).toBeVisible();
            });
        });
    });
});