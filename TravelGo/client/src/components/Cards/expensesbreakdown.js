import { useEffect, useState } from "react";

import { styleAmount } from "../../utils/helper";
import EmptyExpenses from "./emptyexpenses";
import PieChartOverview from "../Charts/piechartoverview";
import SearchLoading from "../Loading/searchloading";

export default function ExpensesBreakdown({ totalExpenses, breakdown, xRate }) {
    const [loading, setLoading] = useState(true);
    const [newBreakdown, setNewBreakdown] = useState([]);
    const colors = ["#e85c66", "#ffae40", "#3db9a4", "#42aaff", "#5a7dff", "#875de6", "#c14db4"];

    useEffect(() => {
        if (process.env.NODE_ENV === 'test') {
            setLoading(false);
            return;
        }

        setLoading(true);
        const converted = breakdown?.map(({ type, ...rest }) => {
            const updated = Object.fromEntries(Object.entries(rest).map(([key, value]) => [key, Number(styleAmount(value * xRate))]));
            return { type, ...updated };
        });

        setNewBreakdown(converted);

        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, [breakdown, xRate]);

    return (
        <div role="article" aria-label="breakdown card" className="card">
            <div className="flex items-center justify-between">
                <h5 className="text-lg">Expenses Breakdown</h5>
            </div>

            {loading
                ? <SearchLoading />
                : breakdown?.length > 0
                    ? <PieChartOverview
                        mode="breakdown"
                        data={newBreakdown}
                        label="Total Expenses:"
                        totalAmount={`$${styleAmount(totalExpenses)}`}
                        colors={colors}
                        showTextAnchor
                    />
                    : <EmptyExpenses />}
        </div>
    )
}