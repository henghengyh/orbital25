import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

import travelgo from '../../assets/icon.png';
import { menuItems } from '../MenuItem/menuitem';
import SearchBar from '../SearchBar/searchbar';
import ProfileInfo from '../Cards/profileinfo';

export default function Navbar({ user }) {
    const navigate = useNavigate(); // Hook to programmatically navigate to different routes
    const [searchValue, setSearchValue] = useState(''); // State to manage the search input value

    const handleSearch = () => { }

    const onClearSearch = () => {
        setSearchValue(''); // Clear the search input value
    }

    const logout = () => {
        localStorage.removeItem("token"); // Clear the token from local storage
        navigate('/'); // Redirect to the home page
    }

    return (
        <nav className='bg-sky-100 px-4 mx-4 mb-4 w-full h-[60px] shadow-md flex justify-between items-center'>
            <div className='flex flex-row items-center justify-center gap-4 w-[240px] h-full'>
                <img src={travelgo} alt="TravelGo Logo" className='w-10 h-10 cursor-pointer' />
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
                {menuItems.map((item, index) => {
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