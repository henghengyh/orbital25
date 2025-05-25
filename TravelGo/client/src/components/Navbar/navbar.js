import { Link } from 'react-router-dom';

import { menuItems } from '../MenuItem/menuitem';

export default function Navbar() {
    return (
        <nav className='bg-white shadow-md p-4 mx-5 mt-4 rounded-xl h-16 flex items-center justify-between'>
            <Link to="/home" className='font-bold text-lg p-2'>TravelGo</Link>
            <ul className='flex space-x-4'>
                {menuItems.map((item, index) => {
                    return (
                        <li key={index}>
                            <Link to={item.url} className={item.className}> {item.title} </Link>
                        </li>
                    )
                })}
            </ul>
        </nav>
    )
}