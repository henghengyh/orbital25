const MapInstructions = ({ showInstructions, setShowInstructions }) => {
    if (!showInstructions) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto scrollbar">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-gray-900">How to Use the Interactive Maps</h2>
                        <button
                            onClick={() => setShowInstructions(false)}
                            className="rounded-full hover:bg-slate-200 focus:outline-none"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                            <h3 className="font-semibold mb-3 text-blue-800">Step-by-Step Guide:</h3>
                            <ol className="text-sm text-blue-700 space-y-2 list-decimal list-inside">
                                <li><strong>View Your Itineraries:</strong> Select any itinerary from the dropdown to see all activities plotted on the map with numbered markers</li>
                                <li><strong>Activity Details:</strong> Click on any numbered marker to view activity information including time, type, warnings, and notes</li>
                                <li><strong>Route Visualization:</strong> See transport routes (colored lines) and activity connections (dashed lines) between locations</li>
                                <li><strong>Search Places:</strong> Use the search bar to find additional places of interest - results appear as yellow markers</li>
                                <li><strong>Filter by Date:</strong> Optionally filter itinerary activities by selecting a specific date</li>
                                <li><strong>Map Controls:</strong> Your current location appears as a blue marker. Use map controls to zoom, switch views, and navigate</li>
                            </ol>
                        </div>

                        <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                            <h3 className="font-semibold mb-2 text-green-800">Activity Icons:</h3>
                            <div className="grid grid-cols-2 gap-2 text-sm text-green-700">
                                <div>🍽️ Meals</div>
                                <div>📷 Sightseeing</div>
                                <div>🛍️ Shopping</div>
                                <div>🚌 Transport</div>
                            </div>
                        </div>

                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                            <h3 className="font-semibold mb-2 text-yellow-800">Route Colors:</h3>
                            <div className="grid grid-cols-2 gap-2 text-sm text-yellow-700">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-1 bg-green-500"></div>
                                    <span>Walking</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-1 bg-red-500"></div>
                                    <span>Driving</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-1 bg-blue-500"></div>
                                    <span>Public Transport</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-1 bg-blue-400 border-dashed border-t-2 border-blue-400"></div>
                                    <span>Activity Routes</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={() => setShowInstructions(false)}
                            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Got it!
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MapInstructions;