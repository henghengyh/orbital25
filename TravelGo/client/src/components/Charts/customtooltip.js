import { styleAmount } from "../../utils/helper";

export default function CustomTooltip({ active, payload }) {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white shadow-md p-2 rounded-lg border border-gray-300">
                <p className="text-xs font-semibold text-purple-800 mb-1">{payload[0].name}</p>
                <p className="text-sm text-gray-600">
                    Amount: <span className="text-sm font-medium text-gray-900">${styleAmount(payload[0].value)}</span></p>
            </div>
        )
    }
    return null;
}