import BarChartOverview from "../Charts/barchartoverview";

export default function DailyOverview() {
    const data = [
        { date: "2025-06-25", food: 20, transport: 15, shopping: 50, accommodation: 70, activities: 30, gift: 40, others: 27 },
        { date: "2025-06-26", food: 40, transport: 12, shopping: 10, accommodation: 64, activities: 26, gift: 23, others: 30 },
        { date: "2025-06-27", food: 10, transport: 18, shopping: 40, accommodation: 10, activities: 12, gift: 31, others: 21 },
        { date: "2025-06-28", food: 20, transport: 13, shopping: 50, accommodation: 20, activities: 54, gift: 28, others: 15 },
        { date: "2025-06-29", food: 30, transport: 15, shopping: 80, accommodation: 54, activities: 34, gift: 43, others: 18 },
        { date: "2025-06-30", food: 70, transport: 17, shopping: 20, accommodation: 40, activities: 47, gift: 10, others: 23 },
        { date: "2025-07-01", food: 35, transport: 13, shopping: 35, accommodation: 60, activities: 17, gift: 60, others: 35 },
    ];

    return (
        <div className="col-span-2 card">
            <div className="flex items-center justify-between">
                <h5 className="text-lg">Weekly Overview</h5>
            </div>

            <BarChartOverview data={data} />
        </div>
    )
}