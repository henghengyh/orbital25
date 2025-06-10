import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext/authcontext';
import Loading from '../Loading/loading';

export default function PrivateRoutes() {
    const { auth } = useAuth();

    if (auth.loading) {
        return <Loading />
    }

    return (auth.isAuthenticated
        ? <Outlet />
        : <Navigate
            to="/"
            replace
            state={auth.logout
                    ? {}
                    : {
                        fromProtectedRoute: true,
                        message: "Please log in to continue."
                    }
            } />
    );
}