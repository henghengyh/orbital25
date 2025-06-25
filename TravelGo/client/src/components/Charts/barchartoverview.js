import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import BarChartTooltip from "./barcharttooltip";
import CustomLegend from "./customlegend";

export default function BarChartOverview({ data }) {
    return (
        <div className="bg-white mt-6">
            <ResponsiveContainer width="100%" height={350}>
                <BarChart data={data}>
                    <CartesianGrid stroke="none" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#555" }} stroke="none" />
                    <YAxis tick={{ fontSize: 12, fill: "#555" }} stroke="none" />
                    <Tooltip content={BarChartTooltip} />
                    <Legend content={CustomLegend} />

                    <Bar dataKey="food" stackId="a" fill="#FF8042" />
                    <Bar dataKey="travel" stackId="a" fill="#0088FE" />
                    <Bar dataKey="accommodation" stackId="a" fill="#00C49F" radius={[10, 10, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}