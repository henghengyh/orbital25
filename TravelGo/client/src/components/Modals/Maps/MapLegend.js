export default function MapLegend() {
    return (
        <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <h3 className="font-semibold mb-2">Legend:</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
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
            <p className="text-xs text-gray-600 mt-2">
                📍 Numbered markers show activity sequence • Lines show transport routes
            </p>
        </div>
    )
}