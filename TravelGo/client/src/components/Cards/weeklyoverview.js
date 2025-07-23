import { useEffect, useState } from "react";

import { styleAmount } from "../../utils/helper";
import BarChartOverview from "../Charts/barchartoverview";
import EmptyExpenses from "./emptyexpenses";
import SearchLoading from "../Loading/searchloading";

export default function WeeklyOverview({ weeklyOverview, xRate }) {
    const [loading, setLoading] = useState(true);
    const [newOverview, setNewOverview] = useState([]);

    useEffect(() => {
        setLoading(true);
        if (xRate !== 1) {
            const converted = weeklyOverview.map(({ date, ...rest }) => {
                const updated = Object.fromEntries(Object.entries(rest).map(([key, value]) => [key, Number(styleAmount(value * xRate))]));
                return { date, ...updated };
            });

            setNewOverview(converted);
        } else {
            setNewOverview(weeklyOverview);
        }

        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, [weeklyOverview, xRate]);

    return (
        <div className="col-span-2 card">
            <div className="flex items-center justify-between">
                <h5 className="text-lg">Weekly Overview</h5>
            </div>

            {loading
                ? <SearchLoading />
                : newOverview?.length > 0
                    ? <BarChartOverview data={newOverview} />
                    : <EmptyExpenses />}
        </div>
    )
}