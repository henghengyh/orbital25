import React from 'react';

import Navbar from '../../components/Navbar/navbar';

export default function Home() {
  return (
    <div className="bg-green-200 h-screen flex flex-col">
      <Navbar /> {/* Navbar component for navigation */}
      <div>
        <h1>Welcome to TravelGo</h1>
        <p>Your one-stop solution for all travel needs.</p>
        <p>Explore destinations, book flights, and find accommodations.</p>
        <p>Start your journey with us today!</p>
      </div>
    </div>
  );
}