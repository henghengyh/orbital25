import { Link } from 'react-router-dom';

import { menuItems } from '../MenuItem/menuitem';

export default function Navbar() {
    return (
        <nav className='bg-sky-200 pt-4 h-screen w-[200px] flex'>
            <ul className='h-auto w-[200px] flex-col gap-4 flex list-none'>
                {/* Loop through the menuItems array to create the navbar items */}
                {menuItems.map((item, index) => {
                    return (
                        <li key={index} className={`flex flex-row justify-center items-center h-[60px] transition-all hover:h-[60px] hover:cursor-pointer hover:justify-center hover:items-center ${index !== 0 ? 'hover:bg-sky-50' : 'hover:bg-transparent'}`}>
                            <div className='flex-[30%] grid place-items-center'>
                                <Link to={item.url}>{item.icon}</Link>
                            </div>
                            <Link to={item.url} className={item.className}>{item.title}</Link>
                        </li>
                    )
                })}
            </ul>
        </nav>
    )
}