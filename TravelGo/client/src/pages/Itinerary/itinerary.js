import Navbar from '../../components/Navbar/navbar';

export default function Itinerary() {
    return (
        <div className="bg-stone-100 h-screen flex">
            <Navbar /> {/* Navbar component for navigation */}
            <div className='flex-1 p-8'>
                <h1>Plan your itinerary now</h1>
            </div>
        </div>
    )
}