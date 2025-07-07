import { useEffect, useState } from "react";

import { styleAmount } from "../../utils/helper";
import EmptyExpenses from "./emptyexpenses";
import PieChartOverview from "../Charts/piechartoverview";

export default function ExpensesBreakdown({ totalExpenses, breakdown, xRate }) {
    const [newBreakdown, setNewBreakdown] = useState([]);
    const colors = ["#e85c66", "#ffae40", "#3db9a4", "#42aaff", "#5a7dff", "#875de6", "#c14db4"];

    useEffect(() => {
        const converted = breakdown.map(({ type, ...rest }) => {
            const updated = Object.fromEntries(Object.entries(rest).map(([key, value]) => [key, Number(styleAmount(value * xRate))]));
            return { type, ...updated };
        });

        setNewBreakdown(converted);
    }, [breakdown, xRate]);

    return (
        <div className="card">
            <div className="flex items-center justify-between">
                <h5 className="text-lg">Expenses Breakdown</h5>
            </div>

            {breakdown.length > 0
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