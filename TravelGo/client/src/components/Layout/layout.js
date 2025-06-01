import { Outlet } from "react-router-dom";

import { useUser } from "../../context/UserContext/usercontext"
import Navbar from "../Navbar/navbar";

export default function Layout() {
    const { user } = useUser();
    
    return (
        <>
            <Navbar user={user} />
            <Outlet />
        </>
    )
}