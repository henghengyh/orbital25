import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { axiosInstance, renderWithProvAuth } from './test-helper';
import { mockItinerary, mockUser1, mockUser2 } from '../mock-const';

describe("Invite collaborators process", () => {
    const renderCollab = async (collaborators = []) => {
        axiosInstance.get.mockResolvedValueOnce({ data: { itinerary: mockItinerary[0] } });
        axiosInstance.get.mockResolvedValueOnce({ data: { isOwner: true } });
        axiosInstance.get.mockResolvedValueOnce({ data: { owner: mockUser1 } });
        axiosInstance.get.mockResolvedValueOnce({ data: { collaborators } });

        renderWithProvAuth('/itinerary/1');
        await waitFor(() => expect(screen.getByRole('heading', { name: /edit itinerary/i })).toBeInTheDocument());
        userEvent.click(screen.getByRole('button', { name: /invite collaborators/i }));
        await waitFor(() => expect(screen.getByRole('heading', { name: /invite collaborator/i })).toBeInTheDocument());
    };

    test("send invite to a friend", async () => {
        axiosInstance.post.mockResolvedValueOnce({ data: { success: true, message: "Invitation sent to anotheruser" } });

        await renderCollab();
        userEvent.type(screen.getByPlaceholderText(/collaborator's email/i), 'another@user.com');
        userEvent.type(screen.getByPlaceholderText(/invite message/i), 'testing');
        userEvent.click(screen.getByRole('button', { name: /send invite/i }));

        await waitFor(() => expect(within(screen.getByRole('heading', { name: /invite collaborator/i }).closest('div')).getByText(/invitation sent to anotheruser/i)).toBeInTheDocument());
    });

    test("inviting an existing user in the itinerary", async () => {
        axiosInstance.post.mockResolvedValueOnce({ data: { success: false, error: "User is already a collaborator on this itinerary" } });

        await renderCollab([mockUser2]);
        userEvent.type(screen.getByPlaceholderText(/collaborator's email/i), 'jane.doe@example.com');
        userEvent.click(screen.getByRole('button', { name: /send invite/i }));

        await waitFor(() => expect(within(screen.getByRole('heading', { name: /invite collaborator/i }).closest('div')).getByText(/user is already a collaborator on this itinerary/i)).toBeInTheDocument());
    });

    test("inviting a non exisiting user to the itinerary", async () => {
        axiosInstance.post.mockResolvedValueOnce({ data: { success: false, error: "User not found" } });

        await renderCollab();
        userEvent.type(screen.getByPlaceholderText(/collaborator's email/i), 'wrong@user.com');
        userEvent.click(screen.getByRole('button', { name: /send invite/i }));

        await waitFor(() => expect(within(screen.getByRole('heading', { name: /invite collaborator/i }).closest('div')).getByText(/user not found/i)).toBeInTheDocument());
    });
});