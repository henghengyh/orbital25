import { BrowserRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Modal from 'react-modal';

import AuthProvider, { useAuth } from '../../context/AuthContext/authcontext';
import axiosInstance from '../../utils/axiosInstance';

const mockNavigate = jest.fn();
const mockLocation = { pathname: '/', state: null };
const mockParams = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation,
    useParams: () => mockParams(),
}));
jest.mock('../../utils/axiosInstance', () => ({
    post: jest.fn(),
    get: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
}));
jest.mock('../../context/AuthContext/authcontext', () => ({
    useAuth: jest.fn(),
    __esModule: true,
    default: ({ children }) => <>{children}</>,
}));

const mockSetAuth = jest.fn();

beforeAll(() => {
    const root = document.createElement('div');
    root.id = 'root';
    document.body.appendChild(root);
    Modal.setAppElement('#root');
});

beforeEach(() => {
    useAuth.mockReturnValue({ setAuth: mockSetAuth });
    localStorage.setItem('token', 'fake-token');
    mockLocation.state = null;
    mockLocation.pathname = '/';
});
afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
});

const renderWithAuth = (ui, options = {}) => {
    return render(
        <BrowserRouter>
            <AuthProvider>
                {ui}
            </AuthProvider>
        </BrowserRouter>,
        options
    );
};

const fillForm = async ({ activityName, startTime, endTime, type, location, notes, modeOfTransport, startloc, endloc }) => {
    if (activityName !== undefined) {
        userEvent.clear(screen.getByPlaceholderText(/activity name/i));
        if (activityName) userEvent.type(screen.getByPlaceholderText(/activity name/i), activityName);
    }

    if (startTime !== undefined) {
        userEvent.clear(screen.getByLabelText(/start time/i));
        if (startTime) userEvent.type(screen.getByLabelText(/start time/i), startTime);
    }

    if (endTime !== undefined) {
        userEvent.clear(screen.getByLabelText(/end time/i));
        if (endTime) userEvent.type(screen.getByLabelText(/end time/i), endTime);
    }

    if (type !== undefined && type !== '-') {
        userEvent.selectOptions(screen.getByRole('combobox', { name: /type/i }), type);
    }

    if (type && type !== "Transport") {
        if (location !== undefined) {
            userEvent.clear(screen.getByPlaceholderText('location'));
            if (location) userEvent.type(screen.getByPlaceholderText('location'), location);
        }
    } else {
        if (modeOfTransport !== undefined) {
            userEvent.selectOptions(screen.getByRole('combobox', { name: /mode of transport/i }), modeOfTransport);
        }

        if (startloc !== undefined) {
            userEvent.clear(screen.getByPlaceholderText('start location'));
            if (startloc) userEvent.type(screen.getByPlaceholderText('start location'), startloc);
        }

        if (endloc !== undefined) {
            userEvent.clear(screen.getByPlaceholderText('end location'));
            if (endloc) userEvent.type(screen.getByPlaceholderText('end location'), endloc);
        }
    }

    if (notes !== undefined) {
        userEvent.clear(screen.getByTestId('activity notes'));
        if (notes) userEvent.type(screen.getByTestId('activity notes'), notes);
    }
};

export { axiosInstance, fillForm, mockLocation, mockNavigate, mockParams, mockSetAuth, renderWithAuth, useAuth };