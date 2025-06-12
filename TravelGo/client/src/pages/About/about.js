import { aboutListItems } from "./aboutlistitems";

export default function About() {
    return (
        <div className="start-block">
            <div className="flex flex-col p-8 w-full">
                <h1 className="text-4xl font-bold text-center m-2 text-green-600">TravelGo</h1>
                <h4 className="text-lg font-semibold text-center m-2 ">
                    Like a trusted friend who plans the details, so you can focus on the joy of travel.
                </h4>
                {aboutListItems.map((innerArray, index) => (
                    <div key={index} className="about-outer-div">
                        {innerArray.map((item, idx) => (
                            <div key={idx} className="about-inner-div">
                                <h4 className="about-h4">{item.title}</h4>
                                <div className="about-para">{item.content}</div>
                            </div>))}
                    </div>
                ))}
            </div>
        </div>
    );
}