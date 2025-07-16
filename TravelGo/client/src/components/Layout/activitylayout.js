import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Modal from "react-modal";
import moment from "moment/moment";

import ActivityCard from "../Cards/activitycard";
import ActivityModal from "../Modals/activitymodal";
import axiosInstance from "../../utils/axiosInstance";
import EmptyActivity from '../Cards/emptyactivity';

export default function ActivityLayout({ date, activities, setActivities, updateActivities }) {
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [openModal, setOpenModal] = useState({ shown: false, type: "add", data: null, date: date, });
    const [popup, setPopup] = useState(false);

    const { id } = useParams();

    const filterActivity = (date, activities) => {
        if (!date || !activities) return [];
        return activities
            .filter((a) => moment(a.date).format("YYYY-MM-DD") === moment(date).format("YYYY-MM-DD"))
            .sort((a, b) => {
                if (a.startTime < b.startTime) return -1;
                if (a.startTime > b.startTime) return 1;
                return 0;
            });
    }

    const todayActivities = useMemo(() => { return filterActivity(date, activities) }, [date, activities]);

    const isValidActivity = (data) => {
        let counter = 0;
        for (const existing of todayActivities) {
            if (data._id.toString() === existing._id.toString()) continue;

            const parseDateTime = (date, timeStr) => {
                const [hours, minutes] = timeStr.split(':').map(Number);
                const result = new Date(date);
                result.setHours(hours, minutes, 0, 0);
                return result;
            }

            const existingStart = parseDateTime(date, existing.startTime);
            const existingEnd = parseDateTime(date, existing.endTime);
            const activityStart = parseDateTime(date, data.startTime);
            const activityEnd = parseDateTime(date, data.endTime);

            const overlap = activityStart < existingEnd && activityEnd > existingStart;
            if (overlap) {
                if (data.type !== "Other" && existing.type !== "Other") return false;
                counter++;
            }
        }
        return counter < 2;
    };

    const addActivity = async (data) => {
        if (!id) {
            const tempId = Date.now().toString();
            if (isValidActivity({ ...data, _id: tempId })) {
                setActivities(prev => [...prev, { ...data, _id: tempId }]);
            } else {
                setError("Invalid activity");
                return;
            }
            setMessage("Activity added");
            setOpenModal({ shown: false, type: "add", data: null, date: date });
            return;
        }

        axiosInstance
            .post(`/itineraries/${id}/activities`, data)
            .then((res) => { updateActivities(); setMessage(res.data.message); })
            .catch((err) => { console.error(err); setError(err.response.data.error); })
            .finally(() => setOpenModal({ shown: false, type: "add", data: null, date: date }));
    }

    const editActivitiy = async (activityId, data) => {
        if (!id) {
            if (isValidActivity({ ...data, _id: activityId })) {
                setActivities(prev => prev.map(a => a._id === activityId ? { ...a, ...data } : a));
            } else {
                setError("Invalid activity");
                return;
            }
            setMessage("Activity updated");
            setOpenModal({ shown: false, type: "add", data: null, date: date });
            return;
        }

        axiosInstance
            .put(`/itineraries/${id}/activities/${activityId}`, data)
            .then((res) => { updateActivities(); setMessage(res.data.message); })
            .catch((err) => { console.error(err); setError(err.response.data.error); })
            .finally(() => setOpenModal({ shown: false, type: "add", data: null, date: date }));
    }

    const deleteActivity = async (activityId) => {
        if (!id) {
            setActivities(prev => prev.filter(a => a._id !== activityId));
            setMessage("Activity deleted");
            setOpenModal({ shown: false, type: "add", data: null, date: date });
            return;
        }

        axiosInstance
            .delete(`/itineraries/${id}/activities/${activityId}`)
            .then((res) => { updateActivities(); setMessage(res.data.message); })
            .catch((err) => { console.error(err); setError(err.response.data.error); })
            .finally(() => setOpenModal({ shown: false, type: "add", data: null, date: date }));
    }

    useEffect(() => {
        if (error) {
            setPopup(true);
            setTimeout(() => {
                setPopup(false);
                setError("");
            }, 3000);
            window.history.replaceState({}, document.title);
        }

        if (message) {
            setPopup(true);
            setTimeout(() => {
                setPopup(false);
                setMessage("");
            }, 3000);
            window.history.replaceState({}, document.title);
        }
    }, [error, message]);

    return (
        <div className="w-60 flex-shrink-0 bg-off-white rounded-md flex flex-col">
            {popup &&
                (error ? (<div className="error">{error}</div>)
                    : (<div className="error bg-[#dcf0fa] text-orange-600">{message}</div>))}
            <div className="p-2 bg-slate-200 rounded flex justify-between">
                <span className="font-semibold justify-center items-center flex">{moment(date).format("Do MMM YYYY")}</span>
                <div data-testid="add-button"
                    onClick={() => setOpenModal({ shown: true, type: "add", data: null, date: date })}
                    className="flex justify-center items-center gap-[2px] rounded p-1 hover:bg-slate-300 cursor-pointer"
                >
                    <ion-icon name="add"></ion-icon>
                    <span className="text-sm font-light">Add</span>
                </div>
            </div>

            <div className="flex flex-col gap-2 mt-1 overflow-y-auto scrollbar flex-1">
                {todayActivities.length > 0
                    ? todayActivities.map((activity) => (
                        <ActivityCard
                            key={activity._id}
                            activityName={activity.activityName}
                            startTime={activity.startTime}
                            endTime={activity.endTime}
                            type={activity.type}
                            onClick={() => setOpenModal({ shown: true, type: "edit", data: activity, date: date })}
                        />
                    ))
                    : <EmptyActivity dateSelected={true} />}
            </div>

            <Modal
                isOpen={openModal.shown}
                onRequestClose={() => setOpenModal({ shown: false, type: "add", data: null, date: date })}
                style={{
                    overlay: {
                        background: "rgba(0,0,0,0.4)",
                        zIndex: 10,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    },
                    content: {
                        position: "static",
                        inset: "unset",
                        display: "flex",
                        width: "512px",
                        height: "505px",
                        margin: "auto",
                        background: "#f8fafc",
                        padding: "10px",
                    },
                }}
                appElement={document.getElementById("root")}
            >
                <ActivityModal
                    mode={openModal.type}
                    activity={openModal.data}
                    date={openModal.date}
                    onClose={() => setOpenModal({ shown: false, type: "add", data: null, date: date })}
                    addActivity={addActivity}
                    editActivitiy={editActivitiy}
                    deleteActivity={deleteActivity}
                />
            </Modal>
        </div>
    )
}