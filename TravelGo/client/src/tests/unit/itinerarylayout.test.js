import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { axiosInstance, mockNavigate, mockParams, renderWithAuth } from "./test-utils";
import { mockItinerary, mockUser1, mockUser2, mockUser3 } from "../mock-const";
import AddItineraryPage from "../../pages/Itinerary/createitinerary";
import EditItineraryPage from "../../pages/Itinerary/itinerary";

describe("Itinerary layout component", () => {
    describe("Add itinerary page", () => {
        const renderAddItinerary = async () => {
            mockParams.mockReturnValue({ id: undefined });

            renderWithAuth(<AddItineraryPage />);
            await waitFor(() => expect(screen.getByRole('heading', { name: /add itinerary/i })).toBeInTheDocument());
        };

        test("renders heading, input fields, buttons and empty activity layout for a new itinerary", async () => {
            await renderAddItinerary();

            expect(screen.getByRole('heading', { name: /add itinerary/i })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /invite collaborators/i })).toBeInTheDocument();
            expect(screen.getByPlaceholderText(/trip name/i)).toBeInTheDocument();
            expect(screen.getByPlaceholderText(/destination/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/from:/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/to:/i)).toBeInTheDocument();
            expect(screen.getByPlaceholderText(/1/i)).toBeInTheDocument();
            expect(screen.getByPlaceholderText(/notes/i)).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
            expect(screen.getByText(/please select the start and end dates to start adding activities for your itinerary./i)).toBeInTheDocument();
        });

        test("renders warning modal after clicking invite collaborators for new itinerary", async () => {
            await renderAddItinerary();
            userEvent.click(screen.getByRole('button', { name: /invite collaborators/i }));

            await waitFor(() => {
                expect(screen.getByText(/unable to invite collaborators/i)).toBeInTheDocument();
                expect(screen.getByText(/please create the itinerary first before inviting collaborators./i)).toBeInTheDocument();
                expect(screen.getByText(/ok/i)).toBeInTheDocument();
            });
        });

        test("activity layout is shown when start and end date are entered", async () => {
            await renderAddItinerary();
            userEvent.type(screen.getByLabelText(/from:/i), '2025-07-17');
            userEvent.type(screen.getByLabelText(/to:/i), '2025-07-17');

            await waitFor(() => expect(screen.getByText(/click the '\+ add' button to start adding your activity./i)).toBeInTheDocument());
        });

        test("itinerary is added when add button is clicked", async () => {
            axiosInstance.post.mockResolvedValueOnce({
                data: {
                    savedItinerary: {
                        _id: "t1a",
                        user: "testuser",
                        tripName: "unit test",
                        destination: "Singapore",
                        imageNumber: "2",
                        startDate: "2025-07-17",
                        endDate: "2025-07-17",
                        numberOfPeople: 2,
                        notes: "",
                        activities: [],
                        collaborators: [],
                    },
                    message: "Itinerary added"
                }
            });

            await renderAddItinerary();
            userEvent.type(screen.getByPlaceholderText(/trip name/i), 'unit test');
            userEvent.type(screen.getByPlaceholderText(/destination/i), 'Singapore');
            userEvent.type(screen.getByLabelText(/from:/i), '2025-07-17');
            userEvent.type(screen.getByLabelText(/to:/i), '2025-07-17');
            const input = screen.getByPlaceholderText(/1/i);
            userEvent.clear(input);
            userEvent.type(input, '2');
            userEvent.click(screen.getByRole('button', { name: /add/i }));

            await waitFor(() => {
                expect(axiosInstance.post).toHaveBeenCalledWith("/itineraries", {
                    tripName: "unit test",
                    destination: "Singapore",
                    startDate: "2025-07-17",
                    endDate: "2025-07-17",
                    numberOfPeople: "2",
                    notes: "",
                    activities: [],
                });
                expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { state: { message: "Itinerary added" } });
            });
        });
    });

    describe("Edit itinerary page", () => {
        const renderEditItinerary = async (itinerary, isOwner) => {
            axiosInstance.get.mockResolvedValueOnce({ data: { itinerary } });
            axiosInstance.get.mockResolvedValueOnce({ data: { isOwner } });
            mockParams.mockReturnValue({ id: itinerary._id });

            renderWithAuth(<EditItineraryPage />);
            await waitFor(() => expect(screen.getByRole('heading', { name: /edit itinerary/i })).toBeInTheDocument());
        };

        test("renders heading, input fields with info, buttons and activity layout with no activities for existing itinerary", async () => {
            await renderEditItinerary(mockItinerary[0], true);

            await waitFor(() => {
                expect(screen.getByRole('heading', { name: /edit itinerary/i })).toBeInTheDocument();
                expect(screen.getByRole('button', { name: /invite collaborators/i })).toBeInTheDocument();
                expect(screen.getByPlaceholderText(/trip name/i)).toHaveDisplayValue('Test Trip');
                expect(screen.getByPlaceholderText(/destination/i)).toHaveDisplayValue('Singapore');
                expect(screen.getByLabelText(/from:/i)).toHaveDisplayValue('2025-07-13');
                expect(screen.getByLabelText(/to:/i)).toHaveDisplayValue('2025-07-13');
                expect(screen.getByPlaceholderText(/1/i)).toHaveDisplayValue(1);
                expect(screen.getByPlaceholderText(/notes/i)).toHaveDisplayValue('mock itinerary');
                expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
                expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
                expect(screen.getByText(/click the '\+ add' button to start adding your activity./i)).toBeInTheDocument();
            });
        });

        test("renders activity layout with activities for existing itinerary", async () => {
            await renderEditItinerary(mockItinerary[2], true);

            await waitFor(() => {
                expect(screen.getByRole('heading', { name: /edit itinerary/i })).toBeInTheDocument();
                expect(screen.getByRole('button', { name: /invite collaborators/i })).toBeInTheDocument();
                expect(screen.getByPlaceholderText(/trip name/i)).toHaveDisplayValue('Nature Retreat');
                expect(screen.getByLabelText(/to:/i)).toHaveDisplayValue('2025-09-15');
                expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
                expect(screen.getAllByTestId('add-button')).toHaveLength(6);
            });
        });

        test("renders save and leave button for collaborators of the itinerary", async () => {
            await renderEditItinerary(mockItinerary[0], false);

            await waitFor(() => {
                expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
                expect(screen.getByRole('button', { name: /leave/i })).toBeInTheDocument();
            });
        });

        test("itinerary is added when save button is clicked", async () => {
            axiosInstance.put.mockResolvedValueOnce({
                data: {
                    itinerary: {
                        _id: "1",
                        user: "testuser",
                        tripName: "another name",
                        destination: "Singapore",
                        imageNumber: 3,
                        startDate: "2025-07-13",
                        endDate: "2025-07-13",
                        numberOfPeople: 1,
                        activities: [],
                        notes: "mock itinerary",
                        collaborators: [],
                    },
                    message: "Itinerary updated",
                }
            });

            await renderEditItinerary(mockItinerary[0], true);
            const input = screen.getByPlaceholderText(/trip name/i);
            userEvent.clear(input);
            userEvent.type(input, 'another name');
            userEvent.click(screen.getByRole('button', { name: /save/i }));

            await waitFor(() => {
                expect(axiosInstance.put).toHaveBeenCalledWith("/itineraries/1", {
                    tripName: "another name",
                    destination: "Singapore",
                    startDate: "2025-07-13",
                    endDate: "2025-07-13",
                    numberOfPeople: 1,
                    notes: "mock itinerary",
                });
                expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { state: { message: "Itinerary updated" } });
            });
        });

        test("itinerary is deleted when delete button is clicked", async () => {
            axiosInstance.delete.mockResolvedValueOnce({
                data: {
                    itinerary: {
                        _id: "1",
                        user: "testuser",
                        tripName: "Test Trip",
                        destination: "Singapore",
                        imageNumber: 3,
                        startDate: "2025-07-13",
                        endDate: "2025-07-13",
                        numberOfPeople: 1,
                        activities: [],
                        notes: "mock itinerary",
                        collaborators: [],
                    },
                    message: "Itinerary deleted",
                }
            });

            await renderEditItinerary(mockItinerary[0], true);
            await waitFor(() => expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument());
            userEvent.click(screen.getByRole('button', { name: /delete/i }));
            const modal = screen.getByRole('alert', { name: /delete leave modal/i });
            await waitFor(() => expect(modal).toBeInTheDocument());
            userEvent.click(within(modal).getByRole('button', { name: /delete/i }));

            await waitFor(() => {
                expect(axiosInstance.delete).toHaveBeenCalledWith("/itineraries/1");
                expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { state: { message: "Itinerary deleted" } });
            });
        });

        test("collaborator left the itinerary when leave button is clicked", async () => {
            axiosInstance.post.mockResolvedValueOnce({ data: { message: "You have left the itinerary" } });

            await renderEditItinerary(mockItinerary[0], false);
            await waitFor(() => expect(screen.getByRole('button', { name: /leave/i })).toBeInTheDocument());
            userEvent.click(screen.getByRole('button', { name: /leave/i }));
            const modal = screen.getByRole('alert', { name: /delete leave modal/i });
            await waitFor(() => expect(modal).toBeInTheDocument());
            userEvent.click(within(modal).getByRole('button', { name: /leave/i }));

            await waitFor(() => {
                expect(axiosInstance.post).toHaveBeenCalledWith("/itineraries/1/quit");
                expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { state: { message: "You have left the itinerary" } });
            });
        });
    });

    describe("Collaborator modal", () => {
        const renderCollab = async (collaborators) => {
            axiosInstance.get.mockResolvedValueOnce({ data: { itinerary: mockItinerary[1] } });
            axiosInstance.get.mockResolvedValueOnce({ data: { isOwner: true } });
            axiosInstance.get.mockResolvedValueOnce({ data: { owner: mockUser1 } });
            axiosInstance.get.mockResolvedValueOnce({ data: { collaborators } });
            mockParams.mockReturnValue({ id: "2" });

            renderWithAuth(<EditItineraryPage />);
            await waitFor(() => expect(screen.getByRole('heading', { name: /edit itinerary/i })).toBeInTheDocument());
            userEvent.click(screen.getByRole('button', { name: /invite collaborators/i }));
        };

        test("renders invite modal with no collaborators after clicking invite collaborators for existing itinerary", async () => {
            await renderCollab([]);

            await waitFor(() => {
                expect(screen.getByRole('heading', { name: /invite collaborator/i })).toBeInTheDocument();
                expect(screen.getByText(/owner/i)).toBeInTheDocument();
                expect(screen.getByText(/testuser/i)).toBeInTheDocument();
                expect(screen.getByText(/unit@test.com/i)).toBeInTheDocument();
                expect(screen.getByPlaceholderText(/collaborator's email/i)).toBeInTheDocument();
                expect(screen.getByPlaceholderText(/invite message/i)).toBeInTheDocument();
                expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
                expect(screen.getByRole('button', { name: /send invite/i })).toBeInTheDocument();
            });
        });

        test("renders invite modal with collaborators after clicking invite collaborators for existing itinerary", async () => {
            await renderCollab([mockUser2, mockUser3]);

            await waitFor(() => {
                expect(screen.getByRole('heading', { name: /invite collaborator/i })).toBeInTheDocument();
                expect(screen.getByText(/owner/i)).toBeInTheDocument();
                expect(screen.getByText(/testuser/i)).toBeInTheDocument();
                expect(screen.getByText(/unit@test.com/i)).toBeInTheDocument();
                expect(screen.getByRole('heading', { name: /collaborators/i })).toBeInTheDocument();
                expect(screen.getByText(/janedoe/i)).toBeInTheDocument();
                expect(screen.getByText(/jane.doe@example.com/i)).toBeInTheDocument();
                expect(screen.getByText(/alexwander/i)).toBeInTheDocument();
                expect(screen.getByText(/alex@wanderlust.dev/i)).toBeInTheDocument();
                expect(screen.getByPlaceholderText(/collaborator's email/i)).toBeInTheDocument();
                expect(screen.getByPlaceholderText(/invite message/i)).toBeInTheDocument();
                expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
                expect(screen.getByRole('button', { name: /send invite/i })).toBeInTheDocument();
            });
        });

        test("only show first 3 collaborators when itinerary has more than 3 collaborators", async () => {
            await renderCollab([mockUser1, mockUser2, mockUser3, mockUser2, mockUser3]);

            await waitFor(() => {
                expect(screen.getByRole('heading', { name: /invite collaborator/i })).toBeInTheDocument();
                expect(screen.getByText(/owner/i)).toBeInTheDocument();
                expect(screen.getAllByText(/testuser/i)).toHaveLength(2);
                expect(screen.getAllByText(/unit@test.com/i)).toHaveLength(2);
                expect(screen.getByRole('heading', { name: /collaborators/i })).toBeInTheDocument();
                expect(screen.getByText(/janedoe/i)).toBeInTheDocument();
                expect(screen.getByText(/jane.doe@example.com/i)).toBeInTheDocument();
                expect(screen.getByText(/alexwander/i)).toBeInTheDocument();
                expect(screen.getByText(/alex@wanderlust.dev/i)).toBeInTheDocument();
                expect(screen.getByRole('button', { name: /more.../i })).toBeInTheDocument();
            });
        });

        test("shows all collaborators modal when 'more' button is clicked", async () => {
            await renderCollab([mockUser1, mockUser2, mockUser3, mockUser2, mockUser3]);
            await waitFor(() => expect(screen.getByRole('heading', { name: /invite collaborator/i })).toBeInTheDocument());
            userEvent.click(screen.getByRole('button', { name: /more.../i }));

            await waitFor(() => {
                const allCollab = screen.getByRole('textbox', { name: /all collaborators/i });
                expect(within(allCollab).getByRole('heading', { name: /all collaborators/i })).toBeInTheDocument();
                expect(within(allCollab).getByText(/testuser/i)).toBeInTheDocument();
                expect(within(allCollab).getByText(/unit@test.com/i)).toBeInTheDocument();
                expect(within(allCollab).getAllByText(/janedoe/i)).toHaveLength(2);
                expect(within(allCollab).getAllByText(/jane.doe@example.com/i)).toHaveLength(2);
                expect(within(allCollab).getAllByText(/alexwander/i)).toHaveLength(2);
                expect(within(allCollab).getAllByText(/alex@wanderlust.dev/i)).toHaveLength(2);
            });
        });
    });
});