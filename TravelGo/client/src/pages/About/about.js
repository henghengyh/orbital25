import { aboutListItems } from "./aboutlistitems";

export default function About() {
    return (
        <div className="start-block py-4">
            <div className="flex flex-col w-full">
                <h1 className="text-4xl font-bold text-center p-2 text-blue-700">TravelGo</h1>
                <h4 className="text-lg font-semibold text-center p-2 pt-0">
                    Like a trusted friend who plans the details, so you can focus on the joy of travel.
                </h4>

                <div className="grid grid-cols-2 gap-3 h-[446px]">
                    {aboutListItems.map((item, idx) => (
                        <div key={idx} className="about-inner-div">
                            <h4 className="about-h4">{item.title}</h4>
                            <div className="about-para">{item.content}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}