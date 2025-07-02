import EventInfoCard from "./eventinfocard";

export default function LatestEvents({ recentExpenses, onDelete }) {
    return (
        <div className="card">
            <div className="flex items-center justify-between">
                <h5 className="text-lg">Recent Expenditure</h5>
            </div>

            <div className="mt-6">
                {recentExpenses.map((entry, idx) => (
                    <EventInfoCard
                        key={idx}
                        id={entry._id}
                        title={entry.title}
                        date={entry.date}
                        amount={entry.amount}
                        type={entry.type}
                        onDelete={onDelete}
                    />
                ))}
            </div>
        </div>
    )
}