import Navbar from '../../components/Navbar/navbar';

export default function Home() {
    return (
        <div className="bg-stone-100 h-screen flex">
            <Navbar /> {/* Navbar component for navigation */}
            <div className='flex-1 p-8'>
                <h1>Welcome to TravelGo</h1>
                <p>Your one-stop solution for all travel needs.</p>
                <p>Explore destinations, book flights, and find accommodations.</p>
                <p>Start your journey with us today!</p>
            </div>
        </div>
    );
}