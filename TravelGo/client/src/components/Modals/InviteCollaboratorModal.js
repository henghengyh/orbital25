import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";

export default function InviteCollaboratorModal({ onClose, onInvite, itinerary }) {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [feedback, setFeedback] = useState("");
    const [loading, setLoading] = useState(false);
    const [showAll, setShowAll] = useState(false);

    const [collaborators, setCollaborators] = useState([]);
    const [collaboratorsLoading, setCollaboratorsLoading] = useState(true);

    useEffect(() => {
        async function fetchCollaborators() {
            const res = await axiosInstance.get(`/itineraries/${itinerary._id}/collaborators`);
            setCollaborators(res.data.collaborators);
            setCollaboratorsLoading(false);
        }
        if (itinerary?._id) fetchCollaborators();
    }, [itinerary]);

    const handleInvite = async (e) => {
        setLoading(true);
        try {
            const res = await onInvite(email, message);
            if (res.data.success) {
                setFeedback(res.data.message);
                setEmail("");
                setMessage("");
                setTimeout(() => {
                    onClose();
                }, 1500);
            } else {
                setFeedback(res.data.error || "Failed to send invitation.");
            }
        } catch (err) {
            setFeedback("Failed to send invitation!!!");
        }
        setLoading(false);
    };

    return collaboratorsLoading ? null : (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-[500px] shadow-lg relative">
                <button
                    className="absolute top-4 right-2 text-gray-400 hover:text-gray-600 hover:bg-slate-200 rounded-full cursor-pointer w-8 h-8"
                    onClick={onClose}
                >
                    <ion-icon name="close" size="large"></ion-icon>
                </button>
                <h2 className="text-xl font-bold mb-4">Invite Collaborator</h2>
                <div className="mb-2">
                    <div className="font-semibold mb-1">Current Collaborators</div>
                    <ul className="text-sm">
                        {collaborators.slice(0, 3).map((c, idx) => (
                            <li key={idx} className="flex justify-between py-1 border-b last:border-b-0">
                                <span>{c.name}</span>
                                <span className="text-gray-500">{c.email}</span>
                            </li>
                        ))}
                    </ul>
                    {collaborators.length > 3 && !showAll && (
                        <button
                            className="text-blue-600 hover:underline mt-1 text-xs"
                            onClick={() => setShowAll(true)}
                        >
                            More...
                        </button>
                    )}
                </div>
                {showAll && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-80 shadow-lg relative">
                            <button
                                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                                onClick={() => setShowAll(false)}
                            >
                                <ion-icon name="close" size="large"></ion-icon>
                            </button>
                            <h3 className="text-lg font-bold mb-2">All Collaborators</h3>
                            <ul className="text-sm max-h-60 overflow-y-auto">
                                {collaborators.map((c, idx) => (
                                    <li key={idx} className="flex justify-between py-1 border-b last:border-b-0">
                                        <span>{c.name}</span>
                                        <span className="text-gray-500">{c.email}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
                
                <form onSubmit={handleInvite} className="flex flex-col gap-3">
                    <input
                        type="email"
                        placeholder="Collaborator's email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        className="text-input"
                    />
                    <textarea
                        placeholder="Invite message"
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        className="text-input overflow-y-auto scrollbar"
                        rows={3}
                    />
                    {feedback && (
                        <div className="text-sm text-blue-600">{feedback}</div>
                    )}
                    <div className="flex justify-end gap-2 mt-2">
                        <button
                            type="button"
                            className="itinerary-button w-fit px-4 py-2 bg-gray-300 hover:bg-gray-400"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="itinerary-button w-fit px-4 py-2 bg-blue-600 text-white hover:bg-blue-700"
                            disabled={loading}
                            onClick={handleInvite}
                        >
                            {loading ? "Sending..." : "Send Invite"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}