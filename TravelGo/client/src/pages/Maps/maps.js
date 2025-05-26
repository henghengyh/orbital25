import Navbar from '../../components/Navbar/navbar';

export default function Maps() {
    return (
        <div className="bg-stone-100 h-screen flex">
            <Navbar /> {/* Navbar component for navigation */}
            <div className='flex-1 p-8'>
                <h1>Explore the world with our interactive maps</h1>
                <p>Find your way, discover new places, and plan your next adventure.</p>
                <p>Use our map features to navigate through cities and attractions.</p>
            </div>
        </div>
    )
}