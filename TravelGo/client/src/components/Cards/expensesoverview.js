import PieChartOverview from "../Charts/piechartoverview";

export default function ExpensesOverview({ budget, totalExpenses, remainingAmount }) {
    const colors = ['#875CF5', '#FA2C37', '#FF6900'];
    const data = [
        { name: "Budget", amount: budget },
        { name: "Total Expenses", amount: totalExpenses },
        { name: "Remaining Amount", amount: remainingAmount },
    ];

    return (
        <div className="card">
            <div className="flex items-center justify-between">
                <h5 className="text-lg">Expenses Overview</h5>
            </div>

            <PieChartOverview
                data={data}
                label="Total Expenses"
                totalAmount={`$${totalExpenses}`}
                colors={colors}
                showTextAnchor
            />
        </div>
    )
}