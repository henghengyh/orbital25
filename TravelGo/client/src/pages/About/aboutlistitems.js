import MongoDBLogo from "../../assets/MongoDB.png";
import ExpressLogo from "../../assets/Express.png";
import ReactLogo from "../../assets/React.png";
import NodeJSLogo from "../../assets/Node.js.png";

const sharedImgStyles = "h-20 flex-[30%]";
const sharedImgDivStyles = "flex flex-row items-center w-full";
const sharedImgLabelStyles = "text-left text-lg flex-[70%] pl-3";

const imageList = [
    {
        src: MongoDBLogo,
        alt: "MongoDBLogo",
        label: "MongoDB"
    },
    {
        src: ExpressLogo,
        alt: "ExpressLogo",
        label: "Express.js"
    },
    {
        src: ReactLogo,
        alt: "ReactLogo",
        label: "React.js"
    },
    {
        src: NodeJSLogo,
        alt: "NodeJSLogo",
        label: "Node.js"
    }
]

const TopItems = [
    {
        title: "About",
        content: "TravelGo! is your all-in-one travel planning companion that simplifies and centralises the trip-planning process to save time and provide convenience, so you can focus on the adventure."
    },
    {
        title: "Motivation",
        content: "How might we empower travellers to plan their trips confidently with ease, so that their excitement for a trip will not be overwhelmed by a complex and inefficient trip-planning process?"
    },
]

const BottomItems = [
    {
        title: "SWE Practices",
        content: "TravelGo! follows KISS and DRY principles to reduce complexity and keep our code efficient and maintainable. We follow AGILE methodology through smart problem decomposition, with rigorous version control via GitHub branching and pull requests to ensure seamless collaboration."
    },
    {
        title: "Tech Stack",
        content: (
            <div className="grid grid-cols-2 grid-rows-2 gap-4 place-items-center">
                {imageList.map((image, index) => (
                    <div key={index} className={sharedImgDivStyles}>
                        <img src={image.src} alt={image.alt} className={sharedImgStyles} />
                        <label className={sharedImgLabelStyles}>{image.label}</label>
                    </div>
                ))}
            </div>
        )
    }
]

export const aboutListItems = [
    TopItems, BottomItems
]

