import { useEffect, useState } from "react";

import EmptyExpenses from "./emptyexpenses";
import ExpensesInfoCard from "./expensesinfocard";
import SearchLoading from "../Loading/searchloading";

export default function AllExpenses({ latestExpenses, xRate, editExpenses, onDelete, showMore }) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (process.env.NODE_ENV === 'test') {
            setLoading(false);
            return;
        }

        setLoading(true);
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, [latestExpenses]);

    return (
        <div role="article" aria-label="all expenses card" className="card col-span-2">
            <div className="flex items-center justify-between">
                <h5 className="text-lg">All Expenditure</h5>
                {latestExpenses?.length > 0 &&
                    <button className="card-button" onClick={showMore}>
                        Show More <ion-icon name="arrow-forward"></ion-icon>
                    </button>}
            </div>

            {loading
                ? <SearchLoading />
                : latestExpenses?.length > 0
                    ? <div className="grid grid-cols-2 gap-4 mt-2">
                        {latestExpenses?.map((entry, idx) => (
                            <ExpensesInfoCard
                                key={idx}
                                data={entry}
                                xRate={xRate}
                                editExpenses={editExpenses}
                                onDelete={onDelete}
                            />
                        ))}
                    </div>
                    : <EmptyExpenses />}
        </div>
    )
}