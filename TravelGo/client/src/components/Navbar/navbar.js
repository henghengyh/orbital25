import { useNavigate } from 'react-router-dom';

import { menuItems } from '../MenuItem/menuitem';

export default function Navbar() {
    const navigate = useNavigate(); // Hook to programmatically navigate to different routes

    const handleClick = (url) => {
        // If the clicked item is "Sign Out", clear the local storage and navigate to the home page
        if (url === '/') {
            localStorage.removeItem("token"); // Clear the token from local storage
            localStorage.removeItem("user"); // Clear the user data from local storage
            navigate('/'); // Redirect to the home page
        } else {
            navigate(url); // Navigate to the clicked item's URL
        }
    }

    return (
        <nav className='bg-sky-200 pt-4 h-screen w-[200px] flex'>
            <ul className='h-auto w-[200px] flex-col gap-4 flex list-none'>
                {/* Loop through the menuItems array to create the navbar items */}
                {menuItems.map((item, index) => {
                    return (
                        <li key={index} onClick={() => { handleClick(item.url) }} className={`flex flex-row justify-center items-center h-[60px] transition-all hover:h-[60px] hover:cursor-pointer hover:justify-center hover:items-center ${index !== 0 ? 'hover:bg-sky-50' : 'hover:bg-transparent'}`}>
                            <p className='flex-[30%] grid place-items-center'>{item.icon}</p>
                            <p className={item.className}>{item.title}</p>
                        </li>
                    )
                })}
            </ul>
        </nav>
    )
}