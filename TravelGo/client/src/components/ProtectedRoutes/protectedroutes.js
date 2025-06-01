import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext/authcontext';
import Loading from '../Loading/loading';

export default function PrivateRoutes() {
    const { auth } = useAuth();

    if (auth.loading) {
        return <Loading />
    }

    // If valid token exists, render the child routes; otherwise, redirect to the home page
    return (auth.isAuthenticated
        ? <Outlet />
        : <Navigate
            to="/"
            replace
            state={
                auth.logout
                    ? {}
                    : {
                        fromProtectedRoute: true,
                        message: "Please log in to continue."
                    }
            } />
    );
}