import BarChartOverview from "../Charts/barchartoverview";

export default function DailyOverview({ data, seeMore }) {
    return (
        <div className="col-span-2 card">
            <div className="flex items-center justify-between">
                <h5 className="text-lg">Daily Overview</h5>
            </div>

            <BarChartOverview data={data} />
        </div>
    )
}