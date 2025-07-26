import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { renderWithAuth } from "./test-utils";
import { mockUser1 } from "../mock-const";
import { useUser } from "../../context/UserContext/usercontext";
import Profile from "../../pages/Profile/profile";

jest.mock("../../context/UserContext/usercontext", () => ({
    useUser: jest.fn()
}));

beforeEach(() => {
    useUser.mockReturnValue({ user: mockUser1, setUser: jest.fn() });
    renderWithAuth(<Profile />);
});

describe("Profile component", () => {
    test("render layout", () => {
        expect(screen.getByRole('heading', { name: /user profile/i })).toBeInTheDocument();
        expect(screen.getByRole('img', { name: /user initials/i })).toBeInTheDocument();

        expect(screen.getByText(/about me/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Edit Profile' })).toBeInTheDocument();
        expect(screen.getByText(/name/i)).toBeInTheDocument();
        expect(screen.getByText(/bio/i)).toBeInTheDocument();
        expect(screen.getByText(/favourite destination/i)).toBeInTheDocument();
        expect(screen.getByText(/gender/i)).toBeInTheDocument();
        expect(screen.getByText(/date of birth/i)).toBeInTheDocument();
        expect(screen.getByText(/friends with/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /edit profile photo/i })).toBeInTheDocument();

        expect(screen.getByText(/security information/i)).toBeInTheDocument();
        expect(screen.getByText('Email')).toBeInTheDocument();
        expect(screen.getByText(/password/i)).toBeInTheDocument();
        expect(screen.getByText(/receive email notifications/i)).toBeInTheDocument();
        expect(screen.getByText(/account created on/i)).toBeInTheDocument();
        expect(screen.getAllByRole('button', { name: 'Edit' })).toHaveLength(3);
        expect(screen.getByRole('button', { name: 'logout button' })).toBeInTheDocument();
    });

    describe("Modals", () => {
        describe("Profile modal", () => {
            test("renders edit profile modal when edit button is clicked", async () => {
                userEvent.click(within(screen.getByRole('heading', { name: /about me/i })).getByRole('button', { name: 'Edit Profile' }));

                await waitFor(() => {
                    expect(screen.getByRole('heading', { name: /edit profile/i })).toBeInTheDocument();
                    expect(screen.getAllByText(/name/i)).toHaveLength(2);
                    expect(screen.getAllByText(/bio/i)).toHaveLength(2);
                    expect(screen.getAllByText(/favourite destination/i)).toHaveLength(2);
                    expect(screen.getAllByText('Gender')).toHaveLength(2);
                    expect(screen.getAllByText(/date of birth/i)).toHaveLength(2);
                    expect(screen.getByText(/location/i)).toBeInTheDocument();
                    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
                    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
                });
            });

            test("modal disappers when cancel button clicked", async () => {
                userEvent.click(within(screen.getByRole('heading', { name: /about me/i })).getByRole('button', { name: 'Edit Profile' }));
                userEvent.click(screen.getByRole('button', { name: /cancel/i }));

                await waitFor(() => {
                    expect(screen.getAllByText(/name/i)).toHaveLength(1);
                    expect(screen.getAllByText(/bio/i)).toHaveLength(1);
                    expect(screen.getAllByText(/favourite destination/i)).toHaveLength(1);
                    expect(screen.getAllByText('Gender')).toHaveLength(1);
                    expect(screen.getAllByText(/date of birth/i)).toHaveLength(1);
                    expect(screen.queryByText(/location/i)).not.toBeInTheDocument();
                    expect(screen.queryByRole('button', { name: /cancel/i })).not.toBeInTheDocument();
                    expect(screen.queryByRole('button', { name: /save/i })).not.toBeInTheDocument();
                });
            });
        });

        describe("Photo modal", () => {
            test("renders edit photo modal when edit profile photo button is clicked", async () => {
                userEvent.click(screen.getByRole('button', { name: /edit profile photo/i }));

                await waitFor(() => {
                    expect(screen.getByRole('heading', { name: /edit profile photo/i })).toBeInTheDocument();
                    expect(screen.getByText(/note: max upload limit is 10 mb/i)).toBeInTheDocument();
                    expect(screen.getAllByRole('img', { name: /user initials/i })).toHaveLength(2);
                    expect(screen.getByTestId('file input')).toBeInTheDocument();
                    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
                    expect(screen.getByRole('button', { name: /upload/i })).toBeInTheDocument();
                    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
                });
            });

            test("modal disappers when cancel button is clicked", async () => {
                userEvent.click(screen.getByRole('button', { name: /edit profile photo/i }));
                userEvent.click(screen.getByRole('button', { name: /cancel/i }));

                await waitFor(() => {
                    expect(screen.getAllByRole('img', { name: /user initials/i })).toHaveLength(1);
                    expect(screen.queryByTestId('file input')).not.toBeInTheDocument();
                    expect(screen.queryByRole('button', { name: /cancel/i })).not.toBeInTheDocument();
                    expect(screen.queryByRole('button', { name: /upload/i })).not.toBeInTheDocument();
                    expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument();
                });
            });
        });

        describe("Email modal", () => {
            test("renders email modal when edit button is clicked", async () => {
                userEvent.click(within(screen.getByRole('textbox', { name: /email/i })).getByRole('button', { name: /edit/i }));

                await waitFor(() => {
                    expect(screen.getByText(/edit email/i)).toBeInTheDocument();
                    expect(screen.getByPlaceholderText(/enter new email/i)).toBeInTheDocument();
                    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
                    expect(screen.getByRole('button', { name: /send code/i })).toBeInTheDocument();
                });
            });

            test("modal disappers when cancel button is clicked", async () => {
                userEvent.click(within(screen.getByRole('textbox', { name: /email/i })).getByRole('button', { name: /edit/i }));
                userEvent.click(screen.getByRole('button', { name: /cancel/i }));

                await waitFor(() => {
                    expect(screen.queryByPlaceholderText(/enter new email/i)).not.toBeInTheDocument();
                    expect(screen.queryByRole('button', { name: /cancel/i })).not.toBeInTheDocument();
                    expect(screen.queryByRole('button', { name: /send code/i })).not.toBeInTheDocument();
                });
            });
        });

        describe("Password modal", () => {
            test("renders password modal when edit button is clicked", async () => {
                userEvent.click(within(screen.getByRole('textbox', { name: /password/i })).getByRole('button', { name: /edit/i }));

                await waitFor(() => {
                    expect(screen.getByText(/change password/i)).toBeInTheDocument();
                    expect(screen.getByPlaceholderText(/enter current password/i)).toBeInTheDocument();
                    expect(screen.getByPlaceholderText(/enter new password/i)).toBeInTheDocument();
                    expect(screen.getByPlaceholderText(/confirm new password/i)).toBeInTheDocument();
                    expect(screen.getAllByRole('button', { name: /show hide/i })).toHaveLength(3);
                    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
                    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
                });
            });

            test("modal disappers when cancel button is clicked", async () => {
                userEvent.click(within(screen.getByRole('textbox', { name: /password/i })).getByRole('button', { name: /edit/i }));
                userEvent.click(screen.getByRole('button', { name: /cancel/i }));

                await waitFor(() => {
                    expect(screen.queryByPlaceholderText(/enter current password/i)).not.toBeInTheDocument();
                    expect(screen.queryByPlaceholderText(/enter new password/i)).not.toBeInTheDocument();
                    expect(screen.queryByPlaceholderText(/confirm new password/i)).not.toBeInTheDocument();
                    expect(screen.queryAllByRole('button', { name: /show hide/i })).not.toHaveLength(3);
                    expect(screen.queryByRole('button', { name: /cancel/i })).not.toBeInTheDocument();
                    expect(screen.queryByRole('button', { name: /save/i })).not.toBeInTheDocument();
                });
            });
        });

        describe("Notifications modal", () => {
            test("renders notifications modal when edit button is clicked", async () => {
                userEvent.click(within(screen.getByRole('textbox', { name: /signup/i })).getByRole('button', { name: /edit/i }));

                await waitFor(() => {
                    expect(screen.getByText(/edit notifications/i)).toBeInTheDocument();
                    expect(screen.getByText('Email Signup')).toBeInTheDocument();
                    expect(screen.getByRole('combobox', { name: /signup/i })).toBeInTheDocument();
                    expect(screen.getByRole('combobox', { name: /signup/i })).toHaveDisplayValue('Yes');
                    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
                    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
                });
            });

            test("modal disappers when cancel button is clicked", async () => {
                userEvent.click(within(screen.getByRole('textbox', { name: /signup/i })).getByRole('button', { name: /edit/i }));
                userEvent.click(screen.getByRole('button', { name: /cancel/i }));

                await waitFor(() => {
                    expect(screen.queryByRole('combobox', { name: /signup/i })).not.toBeInTheDocument();
                    expect(screen.queryByRole('button', { name: /cancel/i })).not.toBeInTheDocument();
                    expect(screen.queryByRole('button', { name: /save/i })).not.toBeInTheDocument();
                });
            });
        });
    });
});