import React from 'react';

export default function Home() {
  return (
    <div className="home">
      <h1>Welcome to TravelGo!</h1>
      <p>Your adventure starts here.</p>
      <button onClick={() => alert('Explore our destinations!')}>Explore</button>
    </div>
  );
}