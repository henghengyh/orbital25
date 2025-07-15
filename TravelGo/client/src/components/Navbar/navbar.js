import { useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';

import { logoutUser } from "../../utils/logoutUser";
import { navbarItems } from './navbaritems';
import { useAuth } from "../../context/AuthContext/authcontext";
import { useItinerary } from "../../context/ItineraryContext/itinerarycontext";
import axiosInstance from "../../utils/axiosInstance";
import LogoutModal from "../../components/Modals/LogoutModal";
import ProfileInfo from '../Cards/profileinfo';
import SearchBar from '../SearchBar/searchbar';
import travelgo from '../../assets/icon.png';

export default function Navbar({ user }) {
    const [logoutOpen, setLogoutOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');

    const { setAuth } = useAuth();
    const { setLoading, setSearched, setSearchResults } = useItinerary();
    const location = useLocation();
    const navigate = useNavigate();

    const isDashboard = location.pathname === '/dashboard';

    const onSearch = async (query) => {
        setLoading(true);
        axiosInstance.get("/itineraries/search-itineraries", { params: { query } })
            .then((res) => { setSearchResults(res.data.itineraries); setSearched(true); })
            .catch((err) => console.error(err.message))
            .finally(() => setLoading(false));
    }

    return (
        <nav className='bg-sky-100 px-4 w-full h-[60px] shadow-md flex justify-between items-center'>
            <LogoutModal
                isOpen={logoutOpen}
                onClose={() => setLogoutOpen(false)}
                onLogout={() => logoutUser(setAuth, navigate)}
            />
            <div className='flex flex-row items-center justify-center gap-4 w-[240px] h-full'>
                <img
                    src={travelgo}
                    alt="TravelGo Logo"
                    className='w-10 h-10 cursor-pointer'
                    onClick={() => { navigate("/about") }} />
                <p className='font-extrabold text-2xl cursor-pointer' onClick={() => { navigate("/about") }}>TravelGo</p>
            </div>

            <SearchBar
                value={searchValue}
                onChange={({ target }) => { if (isDashboard) setSearchValue(target.value); }}
                handleSearch={() => { if (isDashboard && searchValue) onSearch(searchValue); }}
                onClearSearch={() => { setSearchValue(''); setSearchResults([]); setSearched(false); }}
            />

            <ul className='flex-row gap-2 flex list-none items-center justify-center'>
                {navbarItems.map((item, index) => {
                    return (
                        <li
                            key={index}
                            onClick={() => { navigate(item.url) }}
                            className={`flex flex-row justify-center items-center h-10 transition-all cursor-pointer hover:rounded-lg hover:bg-mint-green`}>
                            <p className="p-2 text-lg font-medium">{item.title}</p>
                        </li>
                    )
                })}

                <ProfileInfo user={user} setLogoutOpen={(b) => setLogoutOpen(b)} />
            </ul>
        </nav>
    )
}