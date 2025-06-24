import React, { useEffect, useState } from "react";

import ExpensesOverview from "../Cards/expensesoverview";
import LatestEvents from "../Cards/lastestevents";

export default function BudgetLayout({ budget, itinerary }) {
    const [remainingAmount, setRemainingAmount] = useState(0);
    const [totalExpenses, setTotalExpenses] = useState(10.12);
    const [color, setColor] = useState({ container: null, title: null, amount: null });

    useEffect(() => {
        setRemainingAmount(budget - totalExpenses);
    }, [budget, totalExpenses]);

    useEffect(() => {
        if (remainingAmount > 500) setColor({ container: "bg-green-50", title: "text-green-700", amount: "text-green-800" })
        else if (remainingAmount > 0) setColor({ container: "bg-yellow-100", title: "text-yellow-700", amount: "text-yellow-800" })
        else setColor({ container: "bg-red-50", title: "text-red-700", amount: "text-red-800" });
    }, [remainingAmount]);

    const styleAmount = (amount) => amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const seeMore = () => { }

    return (
        <div className="flex flex-col mb-10">
            <div className="flex justify-center items-center min-h-[20vh] p-6">
                <div className="grid grid-cols-3 gap-6 w-fit">
                    <div className="bg-blue-50 p-6 rounded-xl shadow-md">
                        <h3 className="text-lg font-semibold text-blue-700 mb-2">
                            Total Budget:
                        </h3>
                        <p className="text-xl font-bold text-blue-800">${styleAmount(budget)}</p>
                    </div>
                    <div className="bg-red-50 p-6 rounded-xl shadow-md">
                        <h3 className="text-lg font-semibold text-red-700 mb-2">
                            Total Expenses:
                        </h3>
                        <p className="text-xl font-bold text-red-800">${styleAmount(totalExpenses)}</p>
                    </div>
                    <div className={`${color.container} p-6 rounded-xl shadow-md`}>
                        <h3 className={`${color.title} text-lg font-semibold mb-2`}>
                            Remaining Amount:
                        </h3>
                        <p className={`${color.amount} text-xl font-bold`}>${styleAmount(remainingAmount)}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mx-20 mb-10">
                <ExpensesOverview
                    budget={budget}
                    totalExpenses={totalExpenses}
                    remainingAmount={remainingAmount}
                    seeMore={seeMore}
                />
                <LatestEvents />
                <div className="bg-blue-500 w-[1080px] h-[430px] col-span-2"></div>
                <div className="bg-blue-500 w-[540px] h-[430px]"></div>
            </div>
        </div>
    )
}