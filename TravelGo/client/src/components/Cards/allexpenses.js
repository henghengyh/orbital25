import EventInfoCard from "./eventinfocard"

export default function AllExpenses({ latestExpenses, onDelete, seeMore }) {
    return (
        <div className="card col-span-2">
            <div className="flex items-center justify-between">
                <h5 className="text-lg">All Expenditure</h5>
                <div className="card-button" onClick={seeMore}>
                    See All <ion-icon name="arrow-forward"></ion-icon>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-2">
                {latestExpenses.map((entry, idx) => (
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