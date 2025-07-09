import { createContext, useContext, useState } from "react";

const ItineraryContext = createContext();

export default function ItineraryProvider({ children }) {
    const [allItineraries, setAllItineraries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searched, setSearched] = useState(false);
    const [searchResults, setSearchResults] = useState([]);

    return (
        <ItineraryContext.Provider value={{
            allItineraries, setAllItineraries,
            loading, setLoading,
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