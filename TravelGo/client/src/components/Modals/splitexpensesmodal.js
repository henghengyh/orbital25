import { useEffect, useState } from "react"

import { styleAmount } from "../../utils/helper";

export default function SplitExpensesModal({ data, totalExpenses, xRate, onClose }) {
    const [cost, setCost] = useState(0);

    useEffect(() => {
        const allExpenses = data?.splitExpenses;
        if (allExpenses) setCost(totalExpenses / allExpenses?.length);
    }, [data, setCost, totalExpenses]);

    const colorCode = (amt) => {
        if (amt < 0) return "text-red-500";
        else if (amt > 0) return "text-emerald-500";
        else return "";
    };

    return (
        <div className="flex flex-col w-full h-full">
            <div className="flex items-center justify-between pl-5 pr-3 pt-2">
                <h5 className="text-xl font-semibold">Split Expenses</h5>
                <div onClick={onClose} className="cursor-pointer rounded-full hover:bg-slate-200">
                    <ion-icon
                        name="close"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            height: "20px",
                            width: "20px",
                        }}
                    />
                </div>
            </div>

            <div className="px-3 py-1 border-b border-b-black text-lg">
                <p>Total Expenses: ${styleAmount(totalExpenses)}</p>
                <p>Expenses Per Person: ${styleAmount(cost)}</p>
            </div>

            <div className="mt-2 px-3 h-[220px] overflow-x-auto scrollbar">
                <table className="min-w-full table-auto border-collapse border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100 text-center">
                            <th className="border border-gray-300 px-2 py-2 font-semibold">Name</th>
                            <th className="border border-gray-300 px-2 py-2 font-semibold">Paid</th>
                            <th className="border border-gray-300 px-2 py-2 font-semibold">Net Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[...(data?.splitExpenses || [])]
                            .sort((a, b) => b.totalAmount - a.totalAmount)
                            .map((entry, idx) => (
                                <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                    <td className="border border-gray-300 px-4 py-2 max-w-[200px]">
                                        <div className="line-clamp-1">{entry.whoPaid}</div>
                                    </td>
                                    <td className="border border-gray-300 px-2 py-2">
                                        <div className="line-clamp-1">${styleAmount(entry.totalAmount * xRate)}</div>
                                    </td>
                                    <td className="border border-gray-300 px-2 py-2">
                                        <div className={`line-clamp-1 ${colorCode((entry.totalAmount - cost) * xRate)}`}>{(entry.totalAmount - cost) * xRate < 0 ? `-$${styleAmount(Math.abs((entry.totalAmount - cost) * xRate))}` : `+$${styleAmount((entry.totalAmount - cost) * xRate)}`}</div>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-3 px-5 border-t border-t-black overflow-x-auto scrollbar">
                <p className="mt-1 text-lg font-semibold">Who to Pay?</p>
                {data?.settlement.map((entry, idx) => (
                    <div key={idx} className="flex justify-between items-center border-b py-2">
                        <div className="text-gray-700 font-medium capitalize max-w-[75%]">
                            <p className="line-clamp-1">To: {entry.to}</p>
                            <p className="mt-1 line-clamp-1">From: {entry.from}</p>
                        </div>
                        <div className="flex items-center">
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md ${entry.to === "me" ? "bg-green-100 text-green-500" : (entry.from === "me" ? "bg-red-50 text-red-500" : "bg-blue-50 text-blue-500")}`}>
                                <h6 className="text-md font-semibold">
                                    ${styleAmount(Math.abs(entry.amount * xRate))}
                                </h6>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}