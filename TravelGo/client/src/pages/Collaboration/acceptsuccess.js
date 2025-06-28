import { useLocation } from "react-router-dom";

export default function AcceptSuccess() {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const itineraryName = params.get("itineraryName");
    const status = params.get("status");

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-green-50">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <h1 className="text-3xl font-bold text-green-700 mb-4">Invitation Accepted!</h1>
                <p className="text-lg text-gray-700 mb-2">
                    You have successfully joined the itinerary as a collaborator.
                </p>
                {itineraryName && (
                    <p className="text-sm text-gray-500 mb-2">
                        Itinerary: <span className="font-mono">{itineraryName}</span>
                    </p>
                )}
                {status === "success" && (
                    <p className="text-green-600 font-semibold mt-2">Status: Success</p>
                )}
                <a
                    href="/dashboard"
                    className="inline-block mt-6 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                    Go to Dashboard
                </a>
            </div>
        </div>
    );
}