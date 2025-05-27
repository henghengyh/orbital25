import Navbar from "../../components/Navbar/navbar";

import { aboutListItems } from "./aboutlistitems";

const sharedDivStyles = "flex flex-row justify-center m-2 h-auto";
const sharedDivDivStyles = "flex-[50%] bg-blue-100 rounded-lg shadow-lg mr-2";
const sharedH4Styles = "text-xl font-semibold text-indigo-600 text-center p-3 pt-4";
const sharedPStyles = "text-lg text-justify px-5 pb-4 w-full";

export default function About() {
    return (
        <div className="bg-stone-100 h-screen flex">
            <Navbar /> {/* Navbar component for navigation */}
            <div className="flex flex-col p-8 w-full">
                <h1 className="text-4xl font-bold text-center m-2 text-green-600">TravelGo</h1>
                <h4 className="text-lg font-semibold text-center m-2 ">
                    Like a trusted friend who plans the details, so you can focus on the joy of travel.
                </h4>
                {aboutListItems.map((innerArray, index) => (
                    <div key={index} className={sharedDivStyles}>
                        {innerArray.map((item, idx) => (
                            <div key={idx} className={sharedDivDivStyles}>
                                <h4 className={sharedH4Styles}>{item.title}</h4>
                                <p className={sharedPStyles}>{item.content}</p>
                            </div>))}
                    </div>
                ))}
            </div>
        </div>
    );
}