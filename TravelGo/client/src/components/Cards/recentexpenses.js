import EmptyExpenses from "./emptyexpenses";
import ExpensesInfoCard from "./expensesinfocard";

export default function RecentExpenses({ recentExpenses, editExpenses, onDelete }) {
    return (
        <div className="card">
            <div className="flex items-center justify-between">
                <h5 className="text-lg">Recent Expenditure</h5>
            </div>

            <div className="mt-6">
                {recentExpenses.length > 0
                    ? recentExpenses.map((entry, idx) => (
                        <ExpensesInfoCard
                            key={idx}
                            data={entry}
                            editExpenses={editExpenses}
                            onDelete={onDelete}
                        />
                    ))
                    : <EmptyExpenses />}
            </div>
        </div>
    )
}