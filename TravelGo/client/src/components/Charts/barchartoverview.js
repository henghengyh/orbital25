import { Bar, BarChart, CartesianGrid, Cell, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import BarChartTooltip from "./barcharttooltip";
import CustomLegend from "./customlegend";

export default function BarChartOverview({ data }) {
    const colors = ["#e85c66", "#3db9a4", "#5a7dff", "#c14db4", "#875de6", "#42aaff", "#ffae40"];
    const dataKey = ["others", "accommodation", "transport", "gift", "activities", "food", "shopping"];

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