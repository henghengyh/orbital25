import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import AuthProvider, { useAuth } from '../context/AuthContext/authcontext';
import axiosInstance from '../utils/axiosInstance';

jest.mock('../utils/axiosInstance', () => ({
  post: jest.fn(),
  get: jest.fn(),
}));
jest.mock('../context/AuthContext/authcontext', () => ({
  useAuth: jest.fn(),
  __esModule: true,
  default: jest.requireActual('../context/AuthContext/authcontext').default,
}));

const mockSetAuth = jest.fn();

beforeEach(() => {
  useAuth.mockReturnValue({ setAuth: mockSetAuth });
  localStorage.setItem('token', 'fake-token');
  axiosInstance.get.mockResolvedValue({
    data: {
      user: { name: 'testuser' },
    }
  });
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

export { axiosInstance, mockSetAuth, renderWithAuth, useAuth };