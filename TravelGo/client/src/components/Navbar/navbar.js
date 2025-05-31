import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

import { navbarItems } from './navbaritems';
import { useAuth } from "../../context/AuthContext/authcontext";
import ProfileInfo from '../Cards/profileinfo';
import SearchBar from '../SearchBar/searchbar';
import travelgo from '../../assets/icon.png';

export default function Navbar({ user }) {
    // States
    const [searchValue, setSearchValue] = useState(''); // Manage the search input value

    // Hooks
    const { setAuth } = useAuth();
    const navigate = useNavigate();

    // Handle query
    const handleSearch = () => { }

    // Clear the search input value
    const onClearSearch = () => {
        setSearchValue('');
    }

    // Logout function clears token and user from local storage and redirect to login page
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setAuth({
            user: null,
            token: null,
            isAuthenticated: false,
            loading: false,
            logout: true,
        });
        navigate('/');
    }

    return (
        <nav className='bg-sky-100 px-4 w-full h-[60px] shadow-md flex justify-between items-center'>
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
                onChange={({ target }) => {
                    setSearchValue(target.value); // Update the search input value
                }}
                handleSearch={handleSearch}
                onClearSearch={onClearSearch}
            />
            <ul className='flex-row gap-4 flex list-none  items-center justify-center'>
                {/* Loop through the menuItems array to create the navbar items */}
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
                <ProfileInfo user={user} onLogout={logout} />
            </ul>
        </nav>
    )
}