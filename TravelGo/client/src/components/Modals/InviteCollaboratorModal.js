import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";

export default function InviteCollaboratorModal({ onClose, onInvite, itinerary }) {
    const [collaborators, setCollaborators] = useState([]);
    const [collabDataLoading, setCollabDataLoading] = useState(true);
    const [email, setEmail] = useState("");
    const [feedback, setFeedback] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [owner, setOwner] = useState({});
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        async function fetchCollaborators() {
            const resOwner = await axiosInstance.get(`/itineraries/${itinerary._id}/owner`);
            const resColl = await axiosInstance.get(`/itineraries/${itinerary._id}/collaborators`);
            setOwner(resOwner.data.owner);
            setCollaborators(resColl.data.collaborators);
            setCollabDataLoading(false);
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

    return collabDataLoading ? null : (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-[500px] shadow-lg relative">
                <button
                    className="absolute top-4 right-2 text-gray-400 hover:text-gray-600 hover:bg-slate-200 rounded-full cursor-pointer w-8 h-8"
                    onClick={onClose}
                >
                    <ion-icon name="close" size="large"></ion-icon>
                </button>
                <h2 className="text-xl font-bold mb-4">Invite Collaborator</h2>
                <div>
                    <div className="mb-4">
                        <div className="font-semibold mb-1">Owner</div>
                        <ul className="text-sm">
                            <li className="flex justify-between py-1 border-b last:border-b-0">
                                <span>{owner.name}</span>
                                <span className="text-gray-500">{owner.email}</span>
                            </li>
                        </ul>
                    </div>
                    {collaborators.length > 0 ? (
                        <div className="mb-4">
                            <hr className="mb-4"></hr>
                            <h4 className="italic mb-1 text-gray-600">{collaborators ? "Collaborators" : null}</h4>
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
                    ) : null}
                </div>
                {showAll && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                        <div role="textbox" aria-label="all collaborators" className="bg-white rounded-lg p-6 shadow-lg relative">
                            <button
                                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                                onClick={() => setShowAll(false)}
                            >
                                <ion-icon name="close" size="large"></ion-icon>
                            </button>
                            <h3 className="text-lg font-bold mb-2">All Collaborators</h3>
                            <ul className="text-sm max-h-60 overflow-y-auto">
                                {collaborators.map((c, idx) => (
                                    <li key={idx} className="flex justify-between py-1 border-b last:border-b-0 gap-3">
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