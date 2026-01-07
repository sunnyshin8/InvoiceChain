'use client';

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

interface PriceChartProps {
    data: { time: string | number; price: number }[];
    color?: string;
    height?: number;
    showAxes?: boolean;
}

export function PriceChart({ data, color = "#10B981", height = 300, showAxes = true }: PriceChartProps) {
    if (!data || data.length === 0) return <div className="h-full flex items-center justify-center text-gray-400">Loading Chart...</div>;

    const min = Math.min(...data.map(d => d.price));
    const max = Math.max(...data.map(d => d.price));

    return (
        <div style={{ width: '100%', height: height }}>
            <ResponsiveContainer>
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    {showAxes && <XAxis dataKey="time" hide />}
                    {showAxes && <YAxis domain={['auto', 'auto']} hide />}
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }}
                        itemStyle={{ color: color }}
                        formatter={(value: number | undefined) => [value ? `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'N/A', 'Price']}
                        labelFormatter={(label) => {
                            // If label is a timestamp (number), format it
                            if (typeof label === 'number') {
                                return new Date(label).toLocaleString('en-US', {
                                    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
                                });
                            }
                            return label;
                        }}
                    />
                    <Area
                        type="monotone"
                        dataKey="price"
                        stroke={color}
                        fillOpacity={1}
                        fill={`url(#gradient-${color})`}
                        strokeWidth={2}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
