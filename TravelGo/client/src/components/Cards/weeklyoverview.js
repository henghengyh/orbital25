import { useEffect, useState } from "react";

import { styleAmount } from "../../utils/helper";
import BarChartOverview from "../Charts/barchartoverview";
import EmptyExpenses from "./emptyexpenses";

export default function WeeklyOverview({ weeklyOverview, xRate }) {
    const [newOverview, setNewOverview] = useState([]);

    useEffect(() => {
        const converted = weeklyOverview.map(({ date, ...rest }) => {
            const updated = Object.fromEntries(Object.entries(rest).map(([key, value]) => [key, Number(styleAmount(value * xRate))]));
            return { date, ...updated };
        });

        setNewOverview(converted);
    }, [weeklyOverview, xRate]);

    return (
        <div className="col-span-2 card">
            <div className="flex items-center justify-between">
                <h5 className="text-lg">Weekly Overview</h5>
            </div>

            {newOverview.length > 0
                ? <BarChartOverview data={newOverview} />
                : <EmptyExpenses />}
        </div>
    )
}