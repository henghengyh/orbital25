import { useEffect, useState } from "react";

import EmptyExpenses from "./emptyexpenses";
import ExpensesInfoCard from "./expensesinfocard";
import SearchLoading from "../Loading/searchloading";

export default function RecentExpenses({ recentExpenses, xRate, editExpenses, onDelete }) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, [recentExpenses]);

    return (
        <div className="card">
            <div className="flex items-center justify-between">
                <h5 className="text-lg">Recent Expenditure</h5>
            </div>

            <div className="mt-6">
                {loading
                    ? <SearchLoading />
                    : recentExpenses.length > 0
                        ? recentExpenses.map((entry, idx) => (
                            <ExpensesInfoCard
                                key={idx}
                                data={entry}
                                xRate={xRate}
                                editExpenses={editExpenses}
                                onDelete={onDelete}
                            />
                        ))
                        : <EmptyExpenses />}
            </div>
        </div>
    )
}