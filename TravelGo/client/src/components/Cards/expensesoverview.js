import PieChartOverview from "../Charts/piechartoverview";

export default function ExpensesOverview({ totalExpenses, remainingAmount }) {
    let remainAmtColor = "";
    if (remainingAmount > 500) remainAmtColor = "#4ade80";
    else if (remainingAmount > 0) remainAmtColor = "#fb923c";
    else remainAmtColor = "#f87171";

    const colors = ['#a78bfa', remainAmtColor];
    const data = [
        { name: "Total Expenses", amount: totalExpenses },
        { name: "Remaining Amount", amount: remainingAmount },
    ];

    return (
        <div className="card">
            <div className="flex items-center justify-between">
                <h5 className="text-lg">Expenses Overview</h5>
            </div>

            <PieChartOverview
                mode="overview"
                data={data}
                label="Remaining Amount:"
                totalAmount={`$${remainingAmount}`}
                colors={colors}
                showTextAnchor
            />
        </div>
    )
}