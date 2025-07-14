import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import AuthProvider, { useAuth } from '../../context/AuthContext/authcontext';
import axiosInstance from '../../utils/axiosInstance';

const mockNavigate = jest.fn();
const mockLocation = { state: null };
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => (mockLocation),
}));
jest.mock('../../utils/axiosInstance', () => ({
  post: jest.fn(),
  get: jest.fn(),
}));
jest.mock('../../context/AuthContext/authcontext', () => ({
  useAuth: jest.fn(),
  __esModule: true,
  default: ({ children }) => <>{children}</>,
}));

const mockSetAuth = jest.fn();

beforeEach(() => {
  useAuth.mockReturnValue({ setAuth: mockSetAuth });
  localStorage.setItem('token', 'fake-token');
  mockLocation.state = null;
});
afterEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});

const renderWithAuth = (ui, options = {}) => {
  render(
    <BrowserRouter>
      <AuthProvider>
        {ui}
      </AuthProvider>
    </BrowserRouter>,
    options
  )
};

export { axiosInstance, mockLocation, mockNavigate, mockSetAuth, renderWithAuth, useAuth };