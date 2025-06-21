export function logoutUser(setAuth, navigate) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuth({ user: null, token: null, isAuthenticated: false, loading: false, logout: true });
    navigate('/');
}