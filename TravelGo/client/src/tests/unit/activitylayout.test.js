import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { axiosInstance, fillForm, mockParams, renderWithAuth } from "./test-utils";
import { mockItinerary } from "../mock-const";
import ActivityLayout from "../../components/Layout/activitylayout";
import ActivityModal from "../../components/Modals/activitymodal";

describe("Activity layout component", () => {
    describe("Rendering layout", () => {
        beforeEach(() => mockParams.mockReturnValue({ id: undefined }));

        test("renders header with empty activity", () => {
            renderWithAuth(<ActivityLayout date="2025-07-17" activities={[]} />);

            expect(screen.getByText(/17th jul 2025/i)).toBeInTheDocument();
            expect(screen.getByTestId(/add-button/i)).toBeInTheDocument();
            expect(screen.getByText(/click the '\+ add' button to start adding your activity./i)).toBeInTheDocument();
        });

        test("renders header with all activities corresponding to the date", () => {
            renderWithAuth(<ActivityLayout date="2025-08-01" activities={mockItinerary[1].activities} />);

            expect(screen.getByText(/1st Aug 2025/i)).toBeInTheDocument();
            expect(screen.getByTestId(/add-button/i)).toBeInTheDocument();
            expect(screen.getByText(/bus ride/i)).toBeInTheDocument();
            expect(screen.getByText(/09:00 - 13:00/i)).toBeInTheDocument();
            expect(screen.getByText(/check-in hotel/i)).toBeInTheDocument();
            expect(screen.getByText(/14:00 - 14:30/i)).toBeInTheDocument();
            expect(screen.getAllByText(/transport/i)).toHaveLength(2);
            expect(screen.queryByText(/dinner at jalan alor/i)).not.toBeInTheDocument();
            expect(screen.queryByText(/19:00 - 20:30/i)).not.toBeInTheDocument();
            expect(screen.queryByText(/food/i)).not.toBeInTheDocument();
        });
    });

    describe("Activity modal", () => {
        test("renders activity modal when add button clicked", async () => {
            mockParams.mockReturnValue({ id: undefined });

            renderWithAuth(<ActivityLayout date="2025-07-17" activities={[]} />);
            await waitFor(() => expect(screen.getByText(/17th jul 2025/i)).toBeInTheDocument());
            userEvent.click(screen.getByTestId(/add-button/i));

            await waitFor(() => {
                expect(screen.getByRole('heading', { name: /add activity/i })).toBeInTheDocument();
                expect(screen.getByPlaceholderText(/activity name/i)).toBeInTheDocument();
                expect(screen.getByDisplayValue(/2025-07-17/i)).toBeInTheDocument();
                expect(screen.getByLabelText(/start time:/i)).toBeInTheDocument();
                expect(screen.getByLabelText(/end time:/i)).toBeInTheDocument();
                expect(screen.getByRole('combobox', { name: /type/i })).toBeInTheDocument();
                expect(screen.getByRole('combobox', { name: /type/i })).toHaveDisplayValue('Select type');
                expect(screen.getByPlaceholderText(/notes/i)).toBeInTheDocument();
                expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
            });
        });

        test("renders activity modal with info when edit button clicked", async () => {
            mockParams.mockReturnValue({ id: 2 });

            renderWithAuth(<ActivityLayout date="2025-08-01" activities={mockItinerary[1].activities} />);
            await waitFor(() => expect(screen.getByText(/1st aug 2025/i)).toBeInTheDocument());
            const card = screen.getAllByRole('article', { name: /activity card/i })[0];
            userEvent.hover(card);
            userEvent.click(within(card).getByRole('button', { name: /edit activity/i }));

            await waitFor(() => {
                expect(screen.getByRole('heading', { name: /edit activity/i })).toBeInTheDocument();
                expect(screen.getByPlaceholderText(/activity name/i)).toHaveDisplayValue('Bus Ride');
                expect(screen.getByDisplayValue(/2025-08-01/i)).toBeInTheDocument();
                expect(screen.getByLabelText(/start time:/i)).toHaveDisplayValue('09:00');
                expect(screen.getByLabelText(/end time:/i)).toHaveDisplayValue('13:00');
                expect(screen.getByRole('combobox', { name: /type/i })).toHaveDisplayValue('Transport');
                expect(screen.getByPlaceholderText(/notes/i)).toHaveDisplayValue('Express coach from Singapore');
                expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
                expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
            });
        });
    });

    describe("Add, Edit, Delete activity", () => {
        const sampleActivity = mockItinerary[1].activities[0];

        test.each([
            ["Invalid Activity Name", "", "10:00", "12:00", "Meal"],
            ["Invalid Start Time", "Visit Museum", "", "12:00", "Meal"],
            ["Invalid Start Time", "Visit Museum", "13:00", "12:00", "Meal"],
            ["Invalid End Time", "Visit Museum", "10:00", "", "Meal"],
            ["Invalid Activity Type", "Visit Museum", "10:00", "12:00", "-"]
        ])('shows "%s" error message for inputs activityName=%s, start=%s, end=%s, type=%s',
            async (error, activityName, startTime, endTime, type) => {
                renderWithAuth(<ActivityModal date="2025-07-17" mode="add" />);
                await fillForm({ activityName, startTime, endTime, type });
                userEvent.click(screen.getByRole('button', { name: /add/i }));
                await waitFor(() => expect(screen.getByText(error)).toBeInTheDocument());
            });

        describe("for new itinerary", () => {
            const mockAddActivity = jest.fn();
            const renderLayout = async ({ activities }) => {
                renderWithAuth(
                    <ActivityLayout
                        date="2025-08-01"
                        activities={activities}
                        setActivities={(cb) => mockAddActivity(cb(activities))}
                    />);
                await waitFor(() => expect(screen.getByText(/1st aug 2025/i)).toBeInTheDocument());
            };

            beforeEach(() => mockParams.mockReturnValue({ id: undefined }));

            test("activity is added when add button is clicked", async () => {
                await renderLayout({ activities: [sampleActivity] });
                userEvent.click(screen.getByTestId(/add-button/i));
                await waitFor(() => expect(screen.getByText(/add activity/i)).toBeInTheDocument());
                await fillForm({
                    activityName: "lunch",
                    startTime: "13:30",
                    endTime: "14:00",
                    type: "Meal",
                    notes: "",
                });
                userEvent.click(screen.getByRole('button', { name: /add/i }));

                await waitFor(() => {
                    expect(mockAddActivity).toHaveBeenCalledWith(expect.arrayContaining([
                        sampleActivity,
                        expect.objectContaining({
                            _id: expect.any(String),
                            activityName: "lunch",
                            date: new Date("2025-08-01"),
                            startTime: "13:30",
                            endTime: "14:00",
                            type: "Meal",
                            notes: "",
                        }),
                    ]));
                    expect(screen.getByText(/activity added/i)).toBeInTheDocument();
                });
            });

            test("activity is updated when save button is clicked", async () => {
                await renderLayout({ activities: [sampleActivity] });
                const card = screen.getAllByRole('article', { name: /activity card/i })[0];
                userEvent.hover(card);
                userEvent.click(within(card).getByRole('button', { name: /edit activity/i }));
                await fillForm({ notes: "big and lux bus" });
                userEvent.click(screen.getByRole('button', { name: /save/i }));

                await waitFor(() => {
                    expect(mockAddActivity).toHaveBeenCalledWith(expect.arrayContaining([
                        expect.objectContaining({
                            _id: "2a",
                            activityName: "Bus Ride",
                            date: new Date("2025-08-01"),
                            startTime: "09:00",
                            endTime: "13:00",
                            type: "Transport",
                            notes: "big and lux bus",
                        }),
                    ]));
                    expect(screen.getByText(/activity updated/i)).toBeInTheDocument();
                });
            });

            test("activity is deleted when delete button is clicked", async () => {
                await renderLayout({ activities: [sampleActivity] });
                const card = screen.getAllByRole('article', { name: /activity card/i })[0];
                userEvent.hover(card);
                userEvent.click(within(card).getByRole('button', { name: /edit activity/i }));
                userEvent.click(screen.getByRole('button', { name: /delete/i }));

                await waitFor(() => {
                    expect(mockAddActivity).not.toHaveBeenCalledWith(expect.arrayContaining([
                        expect.objectContaining({
                            _id: "2a",
                            activityName: "Bus Ride",
                            date: new Date("2025-08-01"),
                            startTime: "09:00",
                            endTime: "13:00",
                            type: "Transport",
                            notes: "Express coach from Singapore",
                        }),
                    ]));
                    expect(screen.getByText(/activity deleted/i)).toBeInTheDocument();
                });
            });

            test("shows error message when activity added or updated clashes with existing activities", async () => {
                await renderLayout({ activities: [sampleActivity, mockItinerary[1].activities[1]] });
                const card = screen.getAllByRole('article', { name: /activity card/i })[1];
                userEvent.hover(card);
                userEvent.click(within(card).getByRole('button', { name: /edit activity/i }));
                await fillForm({ startTime: "12:00", endTime: "14:00" });
                userEvent.click(screen.getByRole('button', { name: /save/i }));

                await waitFor(() => {
                    expect(mockAddActivity).not.toHaveBeenCalled();
                    expect(screen.getByText(/invalid activity/i)).toBeInTheDocument();
                });
            });
        });

        describe("for existing itinerary", () => {
            const mockUpdateActivity = jest.fn();
            const renderLayout = async ({ activities }) => {
                renderWithAuth(
                    <ActivityLayout
                        date="2025-08-01"
                        activities={activities}
                        updateActivities={mockUpdateActivity}
                    />);
                await waitFor(() => expect(screen.getByText(/1st aug 2025/i)).toBeInTheDocument());
            };

            beforeEach(() => mockParams.mockReturnValue({ id: 2 }));

            test("activity is added when add button is clicked", async () => {
                const newActivities = [
                    {
                        _id: "2a",
                        activityName: "Bus Ride",
                        date: "2025-08-01",
                        startTime: "09:00",
                        endTime: "13:00",
                        type: "Transport",
                        notes: "Express coach from Singapore",
                    },
                    {
                        _id: "2b",
                        activityName: "lunch",
                        date: "2025-08-01",
                        startTime: "13:30",
                        endTime: "14:00",
                        type: "Meal",
                        notes: "",
                    },
                ];
                axiosInstance.post.mockResolvedValueOnce({
                    data: {
                        itinerary: { _id: "2", activities: newActivities },
                        message: "Activity added",
                    }
                });
                axiosInstance.get.mockResolvedValueOnce({ data: { activities: newActivities } });

                await renderLayout({ activities: [sampleActivity] });
                userEvent.click(screen.getByTestId(/add-button/i));
                await waitFor(() => expect(screen.getByText(/add activity/i)).toBeInTheDocument());
                await fillForm({
                    activityName: "lunch",
                    startTime: "13:30",
                    endTime: "14:00",
                    type: "Meal",
                    notes: "",
                });
                userEvent.click(screen.getByRole('button', { name: /add/i }));

                await waitFor(() => {
                    expect(mockUpdateActivity).toHaveBeenCalled();
                    expect(screen.getByText(/activity added/i)).toBeInTheDocument();
                });
            });

            test("activity is updated when save button is clicked", async () => {
                const newActivities = [
                    {
                        _id: "2a",
                        activityName: "Bus Ride",
                        date: "2025-08-01",
                        startTime: "09:00",
                        endTime: "13:00",
                        type: "Transport",
                        notes: "big and lux bus",
                    },
                ];
                axiosInstance.put.mockResolvedValueOnce({
                    data: {
                        itinerary: { _id: "2", activities: newActivities },
                        message: "Activity updated",
                    }
                });
                axiosInstance.get.mockResolvedValueOnce({ data: { activities: newActivities } });

                await renderLayout({ activities: [sampleActivity] });
                const card = screen.getAllByRole('article', { name: /activity card/i })[0];
                userEvent.hover(card);
                userEvent.click(within(card).getByRole('button', { name: /edit activity/i }));
                await fillForm({ notes: "big and lux bus" });
                userEvent.click(screen.getByRole('button', { name: /save/i }));

                await waitFor(() => {
                    expect(mockUpdateActivity).toHaveBeenCalled();
                    expect(screen.getByText(/activity updated/i)).toBeInTheDocument();
                });
            });

            test("activity is deleted when delete button is clicked", async () => {
                axiosInstance.delete.mockResolvedValueOnce({
                    data: {
                        itinerary: { _id: "2", activities: [] },
                        message: "Activity deleted",
                    }
                });
                axiosInstance.get.mockResolvedValueOnce({ data: { activities: [] } });

                await renderLayout({ activities: [sampleActivity] });
                const card = screen.getAllByRole('article', { name: /activity card/i })[0];
                userEvent.hover(card);
                userEvent.click(within(card).getByRole('button', { name: /edit activity/i }));
                userEvent.click(screen.getByRole('button', { name: /delete/i }));

                await waitFor(() => {
                    expect(mockUpdateActivity).toHaveBeenCalled();
                    expect(screen.getByText(/activity deleted/i)).toBeInTheDocument();
                });
            });

            test("shows error message when activity added or updated clashes with existing activities", async () => {
                axiosInstance.put.mockRejectedValueOnce({ response: { data: { error: "Invalid activity" } } });

                await renderLayout({ activities: [sampleActivity, mockItinerary[1].activities[1]] })
                const card = screen.getAllByRole('article', { name: /activity card/i })[1];
                userEvent.hover(card);
                userEvent.click(within(card).getByRole('button', { name: /edit activity/i }));
                await fillForm({ startTime: "12:00", endTime: "14:00" });
                userEvent.click(screen.getByRole('button', { name: /save/i }));

                await waitFor(() => {
                    expect(mockUpdateActivity).not.toHaveBeenCalled();
                    expect(screen.getByText(/invalid activity/i)).toBeInTheDocument();
                });
            });
        });
    });
});