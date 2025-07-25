import { useEffect, useState } from 'react';

import axiosInstance from '../../../utils/axiosInstance';

export default function TransportWarning({ activity }) {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [warningData, setWarningData] = useState(null);

    useEffect(() => {
        const fetchTransportWarning = async () => {
            if (!activity) return;

            if (!activity || activity.type !== 'Transport') return null;

            try {
                setLoading(true);
                setError(null);
                const response = await axiosInstance.get("/maps/transport-warning", {
                    params: {
                        activity: JSON.stringify(activity)
                    }
                });
                setWarningData(response.data.transportWarning);
            } catch (err) {
                console.error('Error fetching transport warning:', err);
                setError('Failed to check transport warning');
            } finally {
                setLoading(false);
            }
        };
        fetchTransportWarning();
    }, [activity]);

    if (!activity || loading) {
        return loading ? (
            <div className="flex items-center gap-2 mt-3 p-2 bg-blue-100 text-blue-800 rounded-md">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm">Checking transport details...</span>
            </div>
        ) : null;
    }

    if (error) {
        return (
            <div className="flex items-center gap-2 mt-3 p-2 bg-red-100 text-red-800 rounded-md">
                <ion-icon name="alert-circle-outline" className="text-xl"></ion-icon>
                <span className="text-sm">{error}</span>
            </div>
        );
    }

    if (warningData && !warningData.travelDurationPass) {
        return (
            <div className="flex items-center gap-2 mt-3 p-2 bg-yellow-100 text-yellow-800 rounded-md">
                <ion-icon name="warning-outline" className="text-xl"></ion-icon>
                <span className="text-sm">
                    {warningData.message || "Transport time may not match your planned duration."}
                </span>
                {warningData.details && (
                    <div className="text-xs mt-1">
                        {warningData.details}
                    </div>
                )}
            </div>
        );
    }
    return null;
}