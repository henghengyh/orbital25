import React, { createContext, useContext, useState } from "react";

const ItineraryContext = createContext();

export default function ItineraryProvider({ children }) {
    const [allItineraries, setAllItineraries] = useState([]);
    const [searched, setSearched] = useState(false);
    const [searchResults, setSearchResults] = useState([]);

    return (
        <ItineraryContext.Provider value={{
            allItineraries, setAllItineraries,
            searched, setSearched,
            searchResults, setSearchResults
        }}>
            {children}
        </ItineraryContext.Provider>
    );
}

export function useItinerary() {
    return useContext(ItineraryContext);
}