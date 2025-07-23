import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

import CustomLegend from './customlegend';
import CustomTooltip from './customtooltip';

export default function PieChartOverview({ mode, data, label, totalAmount, colors, showTextAnchor }) {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <PieChart>
                <Pie
                    data={data}
                    dataKey={mode === "overview" ? "amount" : "totalAmount"}
                    nameKey={mode === "overview" ? "name" : "type"}
                    cx="50%"
                    cy="50%"
                    outerRadius={130}
                    innerRadius={100}
                    labelLine={false}
                >
                    {data.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={colors[idx % colors?.length]} />
                    ))}
                </Pie>
                <Tooltip content={CustomTooltip} />
                <Legend content={CustomLegend} />

                {showTextAnchor && (
                    <>
                        <text
                            x="50%"
                            y="50%"
                            dy={-25}
                            textAnchor='middle'
                            fill='#666'
                            fontSize="14px"
                        >
                            {label}
                        </text>

                        <text
                            x="50%"
                            y="50%"
                            dy={8}
                            textAnchor='middle'
                            fill='#333'
                            fontSize="24px"
                            fontWeight="semibold"
                        >
                            {totalAmount}
                        </text>
                    </>
                )}
            </PieChart>
        </ResponsiveContainer>
    )
}