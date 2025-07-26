import { useEffect, useState } from "react";
import { styleAmount } from "../../utils/helper";
import PieChartOverview from "../Charts/piechartoverview";
import SearchLoading from "../Loading/searchloading";

export default function ExpensesOverview({ totalExpenses, remainingAmount }) {
    const [loading, setLoading] = useState(true);

    let remainAmtColor = "";
    if (remainingAmount > 500) remainAmtColor = "#4ade80";
    else if (remainingAmount > 0) remainAmtColor = "#fb923c";
    else remainAmtColor = "#f87171";

    const colors = ['#a78bfa', remainAmtColor];
    const data = [
        { name: "Total Expenses", amount: Number(styleAmount(totalExpenses)) },
        { name: "Remaining Amount", amount: Number(styleAmount(remainingAmount)) },
    ];

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
    }, [totalExpenses]);

    return (
        <div role="article" aria-label="overview card" className="card">
            <div className="flex items-center justify-between">
                <h5 className="text-lg">Expenses Overview</h5>
            </div>

            {loading
                ? <SearchLoading />
                : <PieChartOverview
                    mode="overview"
                    data={data}
                    label="Remaining Amount:"
                    totalAmount={`$${styleAmount(remainingAmount)}`}
                    colors={colors}
                    showTextAnchor
                />}
        </div>
    )
}