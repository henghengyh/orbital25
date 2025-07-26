import { styleAmount } from "../../utils/helper";

export default function BarChartTooltip({ active, payload, label }) {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white shadow-md p-2 rounded-lg border border-gray-300">
                <p className="text-md font-semibold text-purple-800 mb-1">{label}</p>
                {payload.slice().reverse().map((entry, idx) => (
                    <p key={idx} className="text-sm text-gray-600" style={{ color: entry.color }}>
                        {entry.name}: <span className="text-sm font-medium text-gray-900">${styleAmount(entry.value)}</span></p>
                ))}
                <hr className="my-1" />
                <p className="text-sm font-semibold">
                    Total: ${styleAmount(payload.reduce((s, e) => s + e.value, 0))}
                </p>
            </div>
        )
    }
    return null;
}