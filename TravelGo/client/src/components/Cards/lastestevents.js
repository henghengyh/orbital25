import EventInfoCard from "./eventinfocard";

export default function LatestEvents() {
    const data = [
        { title: "Eat out", date: "2025-06-25", amount: 21.6, type: "food" },
        { title: "Fix phone", date: "2025-06-26", amount: 75, type: "others" },
        { title: "MRT and Bus", date: "2025-06-27", amount: 5.3, type: "transport" },
        { title: "Buy groceries", date: "2025-06-28", amount: 34.2, type: "shopping" },
    ]

    return (
        <div className="card">
            <div className="flex items-center justify-between">
                <h5 className="text-lg">Recent Expenditure</h5>
            </div>

            <div className="mt-6">
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