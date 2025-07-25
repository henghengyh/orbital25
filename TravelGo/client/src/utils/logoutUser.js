export function logoutUser(setAuth, navigate) {
    localStorage.removeItem("token");
    setAuth({ user: null, token: null, isAuthenticated: false, loading: false, logout: true });
    navigate('/');
};