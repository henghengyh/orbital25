import { imageList } from './aboutimagelist';

export const aboutListItems = [
    {
        title: "About",
        content: "TravelGo is your all-in-one travel planning companion that simplifies and centralises the trip-planning process to save time and provide convenience, so you can focus on the adventure."
    },
    {
        title: "Motivation",
        content: "How might we empower travellers to plan their trips confidently with ease, so that their excitement for a trip will not be overwhelmed by a complex and inefficient trip-planning process?"
    },
    {
        title: "SWE Practices",
        content: "TravelGo follows KISS and DRY principles to reduce complexity and keep our code efficient and maintainable. We follow AGILE methodology through smart problem decomposition, with rigorous version control via GitHub branching and pull requests to ensure seamless collaboration."
    },
    {
        title: "Tech Stack",
        content: (
            <div className="grid grid-cols-2 grid-rows-2 gap-4 place-items-center">
                {imageList.map((image, index) => (
                    <div key={index} className="about-img-div">
                        <img src={image.src} alt={image.alt} className="about-img" />
                        <label className="about-img-label">{image.label}</label>
                    </div>
                ))}
            </div>
        )
    }
]