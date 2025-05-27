import travelgo from '../../assets/icon.png';

const sharedStyles = "flex-[70%] place-item-start pt-2 pb-2 pr-2 text-lg";

export const menuItems = [
    // list of menu items in the navbar
    // for ease of updating the menu items, we are storing them in a separate file in an array
    // each item has a title, url, and className for styling
    {
        title: "TravelGo",
        url: "/about",
        icon: <img src={travelgo} alt="TravelGo Logo" className='w-10 h-10 hover:h-11 hover:w-11' />,
        className: `${sharedStyles} font-bold text-2xl hover:text-[28px] hover:text-green-700`
    },
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: <ion-icon name="list" ></ion-icon>,
        className: `${sharedStyles} font-semibold`
    },
    {
        title: "Itinerary",
        url: "/itinerary",
        icon: <ion-icon name="create"></ion-icon>,
        className: `${sharedStyles} font-semibold`
    },
    {
        title: "Weather",
        url: "/weather",
        icon: <ion-icon name="cloudy"></ion-icon>,
        className: `${sharedStyles} font-semibold`
    },
    {
        title: "Budget",
        url: "/budgetplanner",
        icon: <ion-icon name="logo-usd"></ion-icon>,
        className: `${sharedStyles} font-semibold`
    },
    {
        title: "Map",
        url: "/maps",
        icon: <ion-icon name="map"></ion-icon>,
        className: `${sharedStyles} font-semibold`
    },
    {
        title: "Sign Out",
        url: "/",
        icon: <ion-icon name="log-out"></ion-icon>,
        className: `${sharedStyles} font-semibold`
    }
]