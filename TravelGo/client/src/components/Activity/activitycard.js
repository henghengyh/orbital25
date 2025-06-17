import React, { useState } from "react";
import Modal from "react-modal";
import moment from "moment/moment";

import Activity from "../Cards/activity";
import AddActivity from "./addactivity";
import EmptyActivity from '../Cards/emptyactivity';

export default function ActivityCard({ date, activities }) {
    const [openModal, setOpenModal] = useState(false);

    const filterActivity = (date, activities) => {
        if (!date || !activities) return [];
        return activities.filter((a) => moment(a.date).format("YYYY-MM-DD") === moment(date).format("YYYY-MM-DD"));
    }
    const todayActivities = filterActivity(date, activities);

    const handleAddActivity = () => { }

    return (
        <div className="h-[428px] w-60 flex-shrink-0 bg-off-white rounded-md">
            <div className="p-2 bg-slate-200 rounded flex justify-between">
                <span className="font-semibold justify-center items-center flex">{moment(date).format("Do MMM YYYY")}</span>

                <div onClick={() => setOpenModal(true)} className="flex justify-center items-center gap-[2px] rounded p-1 hover:bg-slate-300 cursor-pointer">
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
                            notes={activity.notes}
                        />
                    ))
                    : <EmptyActivity dateSelected={true} />}
            </div>

            <Modal
                isOpen={openModal}
                onRequestClose={() => { setOpenModal(false) }}
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
                        alignItems: "center",
                        justifyContent: "center",
                        width: "80vw",
                        height: "80vh",
                        margin: "auto",
                        background: "#f8fafc",
                        padding: "2rem",
                    },
                }}
                appElement={document.getElementById("root")}
            >
                <AddActivity />
            </Modal>

        </div>
    )
}