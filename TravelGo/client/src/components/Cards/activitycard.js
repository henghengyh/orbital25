import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Modal from "react-modal";
import moment from "moment/moment";

import Activity from "../Activity/activity";
import ActivityLayout from "../Layout/addeditactivity";
import EmptyActivity from './emptyactivity';
import axiosInstance from "../../utils/axiosInstance";

export default function ActivityCard({ date, activities }) {
    const [todayActivities, setTodayActivities] = useState([]);
    const [openModal, setOpenModal] = useState({
        shown: false,
        type: "add",
        data: null,
        date: date,
    });

    const { id } = useParams();

    const filterActivity = (date, activities) => {
        if (!date || !activities) return [];
        return activities.filter((a) => moment(a.date).format("YYYY-MM-DD") === moment(date).format("YYYY-MM-DD"));
    }
    useEffect(() => {
        setTodayActivities(filterActivity(date, activities));
    });

    const addActivity = async (data) => {
        axiosInstance
        .post(`/itineraries/${id}/activities`, data)
        .then()
        .catch()
    }
    const editActivitiy = async (data) => {
        axiosInstance
        .post()
        .then()
        .catch()
    }
    const deleteActivity = async (data) => {
        axiosInstance
        .post()
        .then()
        .catch()
    }

    return (
        <div className="h-[428px] w-60 flex-shrink-0 bg-off-white rounded-md">
            <div className="p-2 bg-slate-200 rounded flex justify-between">
                <span className="font-semibold justify-center items-center flex">{moment(date).format("Do MMM YYYY")}</span>
                <div onClick={() => setOpenModal({ shown: true, type: "add", data: null, date: date })} className="flex justify-center items-center gap-[2px] rounded p-1 hover:bg-slate-300 cursor-pointer">
                    <ion-icon name="add"></ion-icon>
                    <span className="text-sm font-light">Add</span>
                </div>
            </div>

            <div className="flex flex-col gap-2 mt-1 overflow-y-scroll scrollbar h-[380px]">
                {todayActivities.length > 0
                    ? todayActivities.map((activity) => (
                        <Activity
                            key={activity._id}
                            name={activity.name}
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
                        width: "40vw",
                        height: "80vh",
                        margin: "auto",
                        background: "#f8fafc",
                        padding: "10px",
                    },
                }}
                appElement={document.getElementById("root")}
            >
                <ActivityLayout
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