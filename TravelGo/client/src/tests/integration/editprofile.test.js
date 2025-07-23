import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { axiosInstance, renderWithProvAuth } from './test-helper';
import { mockUser1 } from '../mock-const';

beforeEach(() => axiosInstance.get.mockResolvedValueOnce({ data: { user: mockUser1 } }));

describe("Edit profile", () => {
    test("edit about me details", async () => {
        axiosInstance.post.mockResolvedValueOnce({
            data: {
                success: true,
                updatedUser: {
                    ...mockUser1,
                    name: "changed Name",
                    profileInfo: {
                        bio: "testing 123",
                        favouriteDestination: "here",
                        gender: "female",
                        dateOfBirth: "2015-07-23T00:00:00Z",
                        location: "msia",
                    }
                },
            }
        });

        renderWithProvAuth('/profile');
        await screen.findByText(/user profile/i);
        userEvent.click(within(screen.getByRole('heading', { name: /about me/i })).getByRole('button', { name: 'Edit Profile' }));

        await screen.findByRole('heading', { name: /edit profile/i });
        userEvent.type(screen.getByPlaceholderText(/enter new name/i), 'changed Name');
        userEvent.type(screen.getByPlaceholderText(/enter new bio/i), 'testing 123');
        userEvent.type(screen.getByPlaceholderText(/enter new favourite destination/i), 'here');
        userEvent.selectOptions(screen.getByRole('combobox', { name: /gender/i }), 'Female');
        userEvent.type(screen.getByLabelText(/date of birth/i), '2015-07-23');
        userEvent.type(screen.getByPlaceholderText(/enter new location/i), 'msia');
        userEvent.click(screen.getByRole('button', { name: /save/i }));

        await waitFor(() => {
            expect(screen.getByText('Profile updated successfully!')).toBeInTheDocument();
            expect(screen.getAllByText('changed Name')).toHaveLength(3);
            expect(screen.getAllByText('testing 123')).toHaveLength(2);
            expect(screen.getByText('here')).toBeInTheDocument();
            expect(screen.getByText('Female')).toBeInTheDocument();
            expect(screen.getByText('2015-07-23')).toBeInTheDocument();
        });
    });

    test("edit email", async () => {
        axiosInstance.post.mockResolvedValueOnce({ data: { success: true, message: 'Verification code sent to new email address. Please verify to complete the change.' } });
        axiosInstance.post.mockResolvedValueOnce({ data: { success: true, message: 'Email updated successfully.' } });

        renderWithProvAuth('/profile');
        await screen.findByText(/user profile/i);
        userEvent.click(within(screen.getByRole('textbox', { name: /email/i })).getByRole('button', { name: /edit/i }));

        await screen.findByText(/edit email/i);
        userEvent.clear(screen.getByPlaceholderText(/enter new email/i));
        userEvent.type(screen.getByPlaceholderText(/enter new email/i), 'test@user.com');
        userEvent.click(screen.getByRole('button', { name: /send code/i }));

        await waitFor(() => expect(screen.getByText('Verification code sent to new email address. Please verify to complete the change.')));

        userEvent.type(screen.getByPlaceholderText(/enter verification code/i), '123456');
        userEvent.click(screen.getByRole('button', { name: /verify/i }));

        await waitFor(() => {
            expect(screen.getByText('Email updated successfully.')).toBeInTheDocument();
        });

    });

    test("edit password", async () => {
        axiosInstance.post.mockResolvedValueOnce({ data: { success: true, message: 'Password updated successfully', updatedUser: mockUser1 } });

        renderWithProvAuth('/profile');
        await screen.findByText(/user profile/i);
        userEvent.click(within(screen.getByRole('textbox', { name: /password/i })).getByRole('button', { name: /edit/i }));

        await screen.findByText(/change password/i);
        userEvent.type(screen.getByPlaceholderText(/enter current password/i), 'PASSword123!');
        userEvent.type(screen.getByPlaceholderText(/enter new password/i), 'newPASS321!');
        userEvent.type(screen.getByPlaceholderText(/confirm new password/i), 'newPASS321!');
        userEvent.click(screen.getByRole('button', { name: /save/i }));

        await waitFor(() => expect(screen.getByText('Password updated successfully')).toBeInTheDocument());
    });

    test("edit password without filling in all fields", async () => {
        axiosInstance.post.mockResolvedValueOnce({ data: { success: false, message: 'All fields are required' } });

        renderWithProvAuth('/profile');
        await screen.findByText(/user profile/i);
        userEvent.click(within(screen.getByRole('textbox', { name: /password/i })).getByRole('button', { name: /edit/i }));

        await screen.findByText(/change password/i);
        userEvent.type(screen.getByPlaceholderText(/enter new password/i), 'newPASS321!');
        userEvent.type(screen.getByPlaceholderText(/confirm new password/i), 'newPASS321!');
        userEvent.click(screen.getByRole('button', { name: /save/i }));

        await waitFor(() => expect(screen.getByText('All fields are required')).toBeInTheDocument());
    });

    test("invalid current password", async () => {
        axiosInstance.post.mockResolvedValueOnce({ data: { success: false, message: 'Current password is incorrect' } });

        renderWithProvAuth('/profile');
        await screen.findByText(/user profile/i);
        userEvent.click(within(screen.getByRole('textbox', { name: /password/i })).getByRole('button', { name: /edit/i }));

        await screen.findByText(/change password/i);
        userEvent.type(screen.getByPlaceholderText(/enter current password/i), 'word123!');
        userEvent.type(screen.getByPlaceholderText(/enter new password/i), 'newPASS321!');
        userEvent.type(screen.getByPlaceholderText(/confirm new password/i), 'newPASS321!');
        userEvent.click(screen.getByRole('button', { name: /save/i }));

        await waitFor(() => expect(screen.getByText('Current password is incorrect')).toBeInTheDocument());
    });

    test("new passwords do not match", async () => {
        axiosInstance.post.mockResolvedValueOnce({ data: { success: false, message: 'New passwords do not match' } });

        renderWithProvAuth('/profile');
        await screen.findByText(/user profile/i);
        userEvent.click(within(screen.getByRole('textbox', { name: /password/i })).getByRole('button', { name: /edit/i }));

        await screen.findByText(/change password/i);
        userEvent.type(screen.getByPlaceholderText(/enter current password/i), 'PASSword123!');
        userEvent.type(screen.getByPlaceholderText(/enter new password/i), 'newPASS321!');
        userEvent.type(screen.getByPlaceholderText(/confirm new password/i), 'new321!');
        userEvent.click(screen.getByRole('button', { name: /save/i }));

        await waitFor(() => expect(screen.getByText('New passwords do not match')).toBeInTheDocument());
    });

    test("invalid new password", async () => {
        axiosInstance.post.mockResolvedValueOnce({ data: { success: false, message: 'New password cannot be the same as the current password' } });

        renderWithProvAuth('/profile');
        await screen.findByText(/user profile/i);
        userEvent.click(within(screen.getByRole('textbox', { name: /password/i })).getByRole('button', { name: /edit/i }));

        await screen.findByText(/change password/i);
        userEvent.type(screen.getByPlaceholderText(/enter current password/i), 'PASSword123!');
        userEvent.type(screen.getByPlaceholderText(/enter new password/i), 'PASSword123!');
        userEvent.type(screen.getByPlaceholderText(/confirm new password/i), 'PASSword123!');
        userEvent.click(screen.getByRole('button', { name: /save/i }));

        await waitFor(() => expect(screen.getByText('New password cannot be the same as the current password')).toBeInTheDocument());
    });

    test("edit receive email notifications", async () => {
        axiosInstance.post.mockResolvedValueOnce({ data: { success: true, updatedUser: { ...mockUser1, emailSignUp: false } } });

        renderWithProvAuth('/profile');
        await screen.findByText(/user profile/i);
        userEvent.click(within(screen.getByRole('textbox', { name: /signup/i })).getByRole('button', { name: /edit/i }));

        await screen.findByText(/edit notifications/i);
        userEvent.selectOptions(screen.getByRole('combobox', { name: /signup/i }), 'No');
        userEvent.click(screen.getByRole('button', { name: /save/i }));

        await waitFor(() => expect(screen.queryByText(/edit notifications/i)).not.toBeInTheDocument());
    });
});