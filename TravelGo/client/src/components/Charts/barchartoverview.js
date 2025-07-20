import { Bar, BarChart, CartesianGrid, Cell, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import BarChartTooltip from "./barcharttooltip";
import CustomLegend from "./customlegend";

export default function BarChartOverview({ data }) {
    const colors = ["#e85c66", "#ffae40", "#3db9a4", "#42aaff", "#5a7dff", "#875de6", "#c14db4"];
    const dataKey = ["transport", "shopping", "others", "gift", "food", "activities", "accommodation"];

    return (
        <div className="bg-white mt-6">
            <ResponsiveContainer width="100%" height={350}>
                <BarChart data={data}>
                    <CartesianGrid stroke="none" />
                    <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#555" }} stroke="none" />
                    <YAxis tick={{ fontSize: 12, fill: "#555" }} stroke="none" />
                    <Tooltip content={BarChartTooltip} />
                    <Legend content={CustomLegend} />

                    {dataKey.map((entry, idx) => (
                        <Bar key={idx} dataKey={entry} stackId="total" fill={colors[idx % colors.length]} >
                            {data.map((key, i) => {
                                const topCategory = [...dataKey].reverse().find(k => key[k] !== undefined && key[k] > 0);

                                return (
                                    <Cell
                                        key={`cell-${i}`}
                                        fill={colors[idx % colors.length]}
                                        radius={topCategory === entry ? [10, 10, 0, 0] : [0, 0, 0, 0]}
                                    />
                                );
                            })}
                        </Bar>
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}