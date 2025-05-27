import { Navigate, Outlet } from 'react-router-dom';

export default function PrivateRoutes() {
    const token = localStorage.getItem("token"); // Get the token from local storage

    // If token exists, render the child routes; otherwise, redirect to the home page
    return (token ? <Outlet /> : <Navigate to="/" replace state={{ fromProtectedRoute: true }} />);
}