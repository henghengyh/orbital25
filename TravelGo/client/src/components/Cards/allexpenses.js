import EmptyExpenses from "./emptyexpenses"
import ExpensesInfoCard from "./expensesinfocard"

export default function AllExpenses({ latestExpenses, editExpenses, onDelete, showMore }) {
    return (
        <div className="card col-span-2">
            <div className="flex items-center justify-between">
                <h5 className="text-lg">All Expenditure</h5>
                {latestExpenses.length > 0 &&
                    <div className="card-button" onClick={showMore}>
                        Show More <ion-icon name="arrow-forward"></ion-icon>
                    </div>}
            </div>
            {latestExpenses.length > 0
                ? <div className="grid grid-cols-2 gap-4 mt-2">
                    {latestExpenses.map((entry, idx) => (
                        <ExpensesInfoCard
                            key={idx}
                            data={entry}
                            editExpenses={editExpenses}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
                : <EmptyExpenses />}
        </div>
    )
}