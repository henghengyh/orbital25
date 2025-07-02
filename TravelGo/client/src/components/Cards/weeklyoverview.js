import BarChartOverview from "../Charts/barchartoverview";

export default function WeeklyOverview({ weeklyOverview }) {
    return (
        <div className="col-span-2 card">
            <div className="flex items-center justify-between">
                <h5 className="text-lg">Weekly Overview</h5>
            </div>

            <BarChartOverview data={weeklyOverview} />
        </div>
    )
}