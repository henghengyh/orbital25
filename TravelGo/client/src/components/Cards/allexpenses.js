import EventInfoCard from "./eventinfocard"

export default function AllExpenses({ seeMore }) {
    const data = [
        { title: "Eat out", date: "2025-06-25", amount: 21.6, type: "food" },
        { title: "Fix phone", date: "2025-06-26", amount: 75, type: "others" },
        { title: "MRT and Bus", date: "2025-06-27", amount: 5.3, type: "transport" },
        { title: "Buy groceries", date: "2025-06-28", amount: 34.2, type: "shopping" },
        { title: "Breakfast", date: "2025-06-28", amount: 5, type: "food" },
        { title: "Cat cafe", date: "2025-06-26", amount: 22, type: "activities" },
        { title: "Birthday present", date: "2025-06-29", amount: 56.3, type: "gift" },
        { title: "Birthday dinner", date: "2025-06-30", amount: 120.7, type: "food" },
    ]

    return (
        <div className="card col-span-2">
            <div className="flex items-center justify-between">
                <h5 className="text-lg">All Expenditure</h5>
                <div className="card-button" onClick={seeMore}>
                    See All <ion-icon name="arrow-forward"></ion-icon>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-2">
                {[...data]
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .map((entry, idx) => (
                        <EventInfoCard
                            key={idx}
                            title={entry.title}
                            date={entry.date}
                            amount={entry.amount}
                            type={entry.type}
                        />
                    ))}
            </div>
        </div>
    )
}