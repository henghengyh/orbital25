import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { axiosInstance, renderWithProvAuth } from "./test-helper";
import { mockBreakdown, mockExpenses, mockItinerary, mockLatestExpenses, mockRecentExpenses, mockSplitExpenses, mockWeeklyOverview } from "../mock-const";

beforeAll(() => {
    global.ResizeObserver = class ResizeObserver {
        constructor(callback) {
            this.callback = callback;
        }
        observe() { }
        unobserve() { }
        disconnect() { }
    };
});

describe("Expenses tracking", () => {
    describe("Choosing itinerary to track", () => {
        const budgetAxios = ({ itineraryTitle = "Test Trip", budget = 1000 } = {}) => {
            axiosInstance.get.mockResolvedValueOnce({ data: { budget: [{ itineraryTitle, budget }] } });
            axiosInstance.get.mockResolvedValueOnce({ data: { allExpenses: [] } });
            axiosInstance.get.mockResolvedValueOnce({ data: { recentExpenses: [] } });
            axiosInstance.get.mockResolvedValueOnce({ data: { weeklyOverview: [] } });
            axiosInstance.get.mockResolvedValueOnce({ data: { latestExpenses: [] } });
            axiosInstance.get.mockResolvedValueOnce({ data: { expensesBreakdown: [] } });
            axiosInstance.get.mockResolvedValueOnce({ data: { splitExpenses: [] } });
        };

        test("itinerary has input budget already", async () => {
            axiosInstance.get.mockResolvedValueOnce({ data: { itineraries: mockItinerary } });
            axiosInstance.get.mockResolvedValueOnce({ data: { itineraries: mockItinerary } });
            axiosInstance.get.mockResolvedValueOnce({ data: { budget: [{ itineraryTitle: "Test Trip", budget: 1000 }] } });
            budgetAxios();

            renderWithProvAuth('/budget');
            await waitFor(() => expect(screen.getAllByRole('option').length).toBeGreaterThan(1));
            userEvent.selectOptions(screen.getByRole('combobox'), 'Test Trip (2025-07-13 - 2025-07-13)');

            await waitFor(() => expect(screen.getByRole('button', { name: 'Continue Budgeting' })));

            userEvent.click(screen.getByRole('button', { name: 'Continue Budgeting' }));

            await waitFor(() => {
                expect(screen.getByText('Itinerary:')).toBeInTheDocument();
                expect(screen.getByText('Current Currency:')).toBeInTheDocument();
                expect(screen.getByRole('heading', { name: 'Total Budget:' })).toBeInTheDocument();
                expect(screen.getByRole('heading', { name: 'Total Expenses:' })).toBeInTheDocument();
                expect(screen.getByRole('heading', { name: 'Remaining Amount:' })).toBeInTheDocument();
                expect(screen.getByRole('button', { name: 'Add Expenses' })).toBeInTheDocument();
            });
        });

        test("itinerary does not have input budget", async () => {
            axiosInstance.get.mockResolvedValueOnce({ data: { itineraries: mockItinerary } });
            axiosInstance.get.mockResolvedValueOnce({ data: { itineraries: mockItinerary } });
            axiosInstance.get.mockResolvedValueOnce({ data: { budget: [] } });
            axiosInstance.post.mockResolvedValueOnce({ data: { message: "Budget added" } });
            budgetAxios();

            renderWithProvAuth('/budget');
            await waitFor(() => expect(screen.getAllByRole('option').length).toBeGreaterThan(1));
            userEvent.selectOptions(screen.getByRole('combobox'), 'Test Trip (2025-07-13 - 2025-07-13)');

            await waitFor(() => {
                expect(screen.getByPlaceholderText('2000')).toBeInTheDocument();
                expect(screen.getByRole('button', { name: 'Start Budgeting' })).toBeInTheDocument();
            });

            userEvent.clear(screen.getByPlaceholderText('2000'));
            userEvent.type(screen.getByPlaceholderText('2000'), '1000');
            userEvent.click(screen.getByRole('button', { name: 'Start Budgeting' }));

            await waitFor(() => {
                expect(axiosInstance.post).toHaveBeenCalledWith('/budget', {
                    itineraryIdString: "1",
                    budget: 1000,
                    itineraryTitle: "Test Trip",
                });
                expect(screen.getByText('Itinerary:')).toBeInTheDocument();
                expect(screen.getByText('Current Currency:')).toBeInTheDocument();
                expect(screen.getByRole('heading', { name: 'Total Budget:' })).toBeInTheDocument();
                expect(screen.getByRole('heading', { name: 'Total Expenses:' })).toBeInTheDocument();
                expect(screen.getByRole('heading', { name: 'Remaining Amount:' })).toBeInTheDocument();
                expect(screen.getByRole('button', { name: 'Add Expenses' })).toBeInTheDocument();
            });
        });

        test("changing to another itinerary", async () => {
            budgetAxios();
            axiosInstance.get.mockResolvedValueOnce({ data: { itineraries: mockItinerary } });
            axiosInstance.get.mockResolvedValueOnce({ data: { itineraries: mockItinerary } });
            axiosInstance.get.mockResolvedValueOnce({ data: { budget: [{ itineraryTitle: "Weekend Getaway", budget: 2000 }] } });
            budgetAxios({ itineraryTitle: "Weekend Getaway", budget: 2000 });

            renderWithProvAuth('/budget/1');
            await screen.findByText('Itinerary:');
            userEvent.click(screen.getByTestId('change itinerary'));

            await waitFor(() => {
                expect(screen.getByRole('heading', { name: 'Change Itinerary' })).toBeInTheDocument();
                expect(screen.getByText(/select your trip/i)).toBeInTheDocument();
                expect(screen.getByRole('combobox', { name: /select your trip/i })).toBeInTheDocument();
                expect(screen.getByRole('combobox', { name: /select your trip/i })).toHaveDisplayValue('Select one:');
                expect(screen.getByRole('button', { name: 'Change' })).toBeInTheDocument();
            });

            userEvent.selectOptions(screen.getByRole('combobox', { name: /select your trip/i }), 'Weekend Getaw... (2025-08-01 - 2025-08-03)');
            userEvent.click(screen.getByRole('button', { name: 'Change' }));

            await waitFor(() => expect(screen.getByText('\$2,000.00')).toBeInTheDocument());
        });
    });

    describe("Add, edit, delete expenses", () => {
        const expenseInfo = ({ allExpenses = [], date = "2025-07-28" }) => {
            axiosInstance.get.mockResolvedValueOnce({ data: { recentExpenses: mockRecentExpenses(allExpenses) } });
            axiosInstance.get.mockResolvedValueOnce({ data: { weeklyOverview: mockWeeklyOverview(date, allExpenses) } });
            axiosInstance.get.mockResolvedValueOnce({ data: { latestExpenses: mockLatestExpenses(allExpenses) } });
            axiosInstance.get.mockResolvedValueOnce({ data: { expensesBreakdown: mockBreakdown(allExpenses) } });
            axiosInstance.get.mockResolvedValueOnce({ data: { splitExpenses: mockSplitExpenses(allExpenses) } });
        };

        const budgetAxios = ({ allExpenses = [] } = {}) => {
            axiosInstance.get.mockResolvedValueOnce({ data: { budget: [{ itineraryTitle: "Weekend Getaway", budget: 2000 }] } });
            axiosInstance.get.mockResolvedValueOnce({ data: { allExpenses } });
            expenseInfo({ allExpenses });
        };

        const fillExpenses = async ({ title, date, amount, currency, type, whoPaid, notes }) => {
            if (title !== undefined) {
                userEvent.clear(screen.getByPlaceholderText('title'));
                if (title) userEvent.type(screen.getByPlaceholderText('title'), title);
            }

            if (date !== undefined) {
                userEvent.clear(screen.getByLabelText('Date:'));
                if (date) userEvent.type(screen.getByLabelText('Date:'), date);
            }

            if (amount !== undefined) {
                userEvent.clear(screen.getByPlaceholderText('0'));
                if (amount) userEvent.type(screen.getByPlaceholderText('0'), amount);
            }

            if (currency !== undefined) {
                userEvent.clear(screen.getByPlaceholderText('Type or select a code'));
                if (currency) userEvent.type(screen.getByPlaceholderText('Type or select a code'), currency);
            }

            if (whoPaid !== undefined) {
                userEvent.clear(screen.getByPlaceholderText('Me'));
                if (whoPaid) userEvent.type(screen.getByPlaceholderText('Me'), whoPaid);
            }

            if (type !== undefined) {
                userEvent.selectOptions(screen.getByRole('combobox', { name: 'Type:' }), type);
            }

            if (notes !== undefined) {
                userEvent.clear(screen.getByPlaceholderText('notes'));
                if (notes) userEvent.type(screen.getByPlaceholderText('notes'), notes);
            }
        };

        test.each([
            ["Invalid Title", "", "2025-08-01", "100", "MYR", "activities", "John", ""],
            ["Invalid Date", "Visit Museum", "", "100", "MYR", "activities", "John", ""],
            ["Invalid Amount", "Visit Museum", "2025-08-01", "", "MYR", "activities", "John", ""],
            ["Invalid Currency", "Visit Museum", "2025-08-01", "100", "", "activities", "John", ""],
            ["Invalid Expenses Type", "Visit Museum", "2025-08-01", "100", "MYR", "", "John", ""],
            ["Invalid Person Paid", "Visit Museum", "2025-08-01", "100", "MYR", "activities", "", ""],
        ])('shows "%s" error message for inputs title=%s, date=%s, amount=%s, currency=%s, type=%s, whoPaid=%s',
            async (error, title, date, amount, currency, type, whoPaid, notes) => {
                budgetAxios();

                renderWithProvAuth('/budget/2');
                await screen.findByRole('button', { name: 'Add Expenses' });
                userEvent.click(screen.getByRole('button', { name: 'Add Expenses' }));
                await screen.findByRole('heading', { name: 'Add Expenses' });
                await fillExpenses({ title, date, amount, currency, type, whoPaid, notes });
                userEvent.click(screen.getByRole('button', { name: 'Add' }));
                await waitFor(() => expect(screen.getByText(error)).toBeInTheDocument());
            });

        test("add expenses", async () => {
            budgetAxios();
            axiosInstance.post.mockResolvedValueOnce({ data: { "MYR": { value: 3.0 } } });
            axiosInstance.post.mockResolvedValueOnce({ data: { newExpenses: mockExpenses[0], message: "Expenses added" } });
            expenseInfo({ allExpenses: [mockExpenses[0]] });

            renderWithProvAuth('/budget/2');
            await screen.findByRole('button', { name: 'Add Expenses' });
            userEvent.click(screen.getByRole('button', { name: 'Add Expenses' }));

            await waitFor(() => {
                expect(screen.getByRole('heading', { name: 'Add Expenses' })).toBeInTheDocument();
                expect(screen.getByPlaceholderText('title')).toBeInTheDocument();
                expect(screen.getByLabelText('Date:')).toBeInTheDocument();
                expect(screen.getByPlaceholderText('0')).toBeInTheDocument();
                expect(screen.getByPlaceholderText('Type or select a code')).toBeInTheDocument();
                expect(screen.getByPlaceholderText('Me')).toBeInTheDocument();
                expect(screen.getByRole('combobox', { name: 'Type:' })).toBeInTheDocument();
                expect(screen.getByPlaceholderText('notes')).toBeInTheDocument();
                expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
            });

            await fillExpenses({
                title: "Hotel Stay at Traders Hotel",
                date: "2025-08-01",
                amount: "960",
                currency: "MYR",
                type: "accommodation",
                whoPaid: "John",
                notes: "2-night stay with breakfast"
            });
            userEvent.click(screen.getByRole('button', { name: 'Add' }));

            await waitFor(() => {
                expect(axiosInstance.post).toHaveBeenCalledWith('/expenses/2', {
                    title: "Hotel Stay at Traders Hotel",
                    date: "2025-08-01",
                    amount: 320,
                    currency: "MYR",
                    type: "accommodation",
                    whoPaid: "John",
                    notes: "2-night stay with breakfast"
                });
                expect(screen.getByText('Expenses added')).toBeInTheDocument();
                expect(screen.getByText('\$2,000.00')).toBeInTheDocument();
                expect(screen.getByText('\$320.00')).toBeInTheDocument();
                expect(screen.getByText('\$1,680.00')).toBeInTheDocument();
            });
        });

        test("edit expenses", async () => {
            budgetAxios({ allExpenses: [mockExpenses[0]] });
            axiosInstance.post.mockResolvedValueOnce({ data: { "MYR": { value: 3.0 } } });
            axiosInstance.put.mockResolvedValueOnce({ data: { message: "Expenses updated", amount: -120 } });
            expenseInfo({ allExpenses: [{ ...mockExpenses[0], amount: 200 }] });

            renderWithProvAuth('/budget/2');
            await screen.findByText('Itinerary:');
            const card = screen.getByRole('article', { name: 'recent card' });
            await within(card).findByText('Hotel Stay at Traders Hotel');
            userEvent.hover(within(card).getByText('Hotel Stay at Traders Hotel').closest('div'));
            userEvent.click(within(card).getByTestId('pencil'));
            await screen.findByText('Edit Expenses');
            await fillExpenses({ amount: "600" });
            userEvent.click(screen.getByRole('button', { name: 'Save' }));

            await waitFor(() => {
                expect(axiosInstance.put).toHaveBeenCalledWith('/expenses/2/e1a', {
                    title: "Hotel Stay at Traders Hotel",
                    date: "2025-08-01",
                    amount: 200,
                    currency: "MYR",
                    type: "accommodation",
                    whoPaid: "John",
                    notes: "2-night stay with breakfast"
                });
                expect(screen.getByText('Expenses updated')).toBeInTheDocument();
                expect(screen.getByText('\$2,000.00')).toBeInTheDocument();
                expect(screen.getByText('\$200.00')).toBeInTheDocument();
                expect(screen.getByText('\$1,800.00')).toBeInTheDocument();
            });
        });

        test("delete expenses on the outside", async () => {
            budgetAxios({ allExpenses: [mockExpenses[0], mockExpenses[1]] });
            axiosInstance.delete.mockResolvedValueOnce({ data: { message: "Expenses deleted", amount: 320 } });
            expenseInfo({ allExpenses: [mockExpenses[1]] });

            renderWithProvAuth('/budget/2');
            await screen.findByText('Itinerary:');
            const card = screen.getByRole('article', { name: 'recent card' });
            await within(card).findByText('Hotel Stay at Traders Hotel');
            userEvent.hover(within(card).getByText('Hotel Stay at Traders Hotel').closest('div'));
            userEvent.click(within(card).getAllByTestId('trash')[1]);
            await screen.findByText('Confirm Delete');
            userEvent.click(screen.getByRole('button', { name: 'Delete' }));

            await waitFor(() => {
                expect(axiosInstance.delete).toHaveBeenCalledWith('/expenses/2/e1a');
                expect(screen.getByText('Expenses deleted')).toBeInTheDocument();
                expect(screen.getByText('\$2,000.00')).toBeInTheDocument();
                expect(screen.getByText('\$40.00')).toBeInTheDocument();
                expect(screen.getByText('\$1,960.00')).toBeInTheDocument();
            });
        });

        test("delete expenses via expenses modal", async () => {
            budgetAxios({ allExpenses: [mockExpenses[0], mockExpenses[1]] });
            axiosInstance.delete.mockResolvedValueOnce({ data: { message: "Expenses deleted", amount: 320 } });
            expenseInfo({ allExpenses: [mockExpenses[1]] });

            renderWithProvAuth('/budget/2');
            await screen.findByText('Itinerary:');
            const card = screen.getByRole('article', { name: 'recent card' });
            await within(card).findByText('Hotel Stay at Traders Hotel');
            userEvent.hover(within(card).getByText('Hotel Stay at Traders Hotel').closest('div'));
            userEvent.click(within(card).getAllByTestId('pencil')[1]);
            await screen.findByText('Edit Expenses');
            userEvent.click(screen.getByRole('button', { name: 'Delete' }));

            await waitFor(() => {
                expect(axiosInstance.delete).toHaveBeenCalledWith('/expenses/2/e1a');
                expect(screen.getByText('Expenses deleted')).toBeInTheDocument();
                expect(screen.getByText('\$2,000.00')).toBeInTheDocument();
                expect(screen.getByText('\$40.00')).toBeInTheDocument();
                expect(screen.getByText('\$1,960.00')).toBeInTheDocument();
            });
        });
    });
});