import PieChartOverview from "../Charts/piechartoverview";
import EmptyExpenses from "./emptyexpenses";

export default function ExpensesBreakdown({ totalExpenses, breakdown }) {
    const colors = ["#e85c66", "#ffae40", "#3db9a4", "#42aaff", "#5a7dff", "#875de6", "#c14db4"];

    return (
        <div className="card">
            <div className="flex items-center justify-between">
                <h5 className="text-lg">Expenses Breakdown</h5>
            </div>

            {breakdown.length > 0
                ? <PieChartOverview
                    mode="breakdown"
                    data={breakdown}
                    label="Total Expenses:"
                    totalAmount={`$${totalExpenses}`}
                    colors={colors}
                    showTextAnchor
                />
                : <EmptyExpenses />}
        </div>
    )
}