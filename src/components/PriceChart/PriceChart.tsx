import { useId, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Area,
} from 'recharts';
import './PriceChart.scss';

export type RangeKey = '1D' | '7D' | '1M' | '1Y';

export interface DataPoint {
    time: number; // epoch ms
    price: number;
}

interface PriceChartProps {
    data: DataPoint[];
    range?: RangeKey;
    onRangeChange?: (r: RangeKey) => void;
    loading?: boolean;
}

function formatShortDate(ts: number, range?: RangeKey) {
    const d = dayjs(ts);
    if (range === '1D') return d.format('h:mm A');
    if (range === '7D' || range === '1M') return d.format('MMM D');
    return d.format('MMM D, YYYY');
}

export default function PriceChart({ data, range = '1D', onRangeChange, loading }: PriceChartProps) {
    const id = useId();
    const [active, setActive] = useState<RangeKey>(range);

    const points = useMemo(() => data || [], [data]);

    const handleRange = (r: RangeKey) => {
        setActive(r);
        onRangeChange?.(r);
    };

    // compute domain for Y axis with a bit of padding
    const yDomain: [number, number] | ['dataMin', 'dataMax'] = useMemo(() => {
        if (!points.length) return ['dataMin', 'dataMax'];
        const vals = points.map(p => p.price);
        const min = Math.min(...vals);
        const max = Math.max(...vals);
        const pad = (max - min) * 0.08;
        return [Math.max(0, min - pad), max + pad];
    }, [points]);

    return (
        <div className="price-chart-card">
            <div className="chart-header">
                <div className="title">Price</div>
                <div className="range-buttons">
                    {(['1D', '7D', '1M', '1Y'] as RangeKey[]).map(r => (
                        <button
                            key={r}
                            className={r === active ? 'active' : ''}
                            onClick={() => handleRange(r)}
                        >
                            {r}
                        </button>
                    ))}
                </div>
            </div>

            <div className="chart-body">
                {loading ? (
                    <div className="chart-loading">Loading...</div>
                ) : (
                    <ResponsiveContainer width="100%" height={260}>
                        <LineChart data={points} margin={{ top: 8, right: 12, left: 6, bottom: 4 }}>
                            <defs>
                                <linearGradient id={`grad-${id}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#cdbdff" stopOpacity={0.22} />
                                    <stop offset="100%" stopColor="#cdbdff" stopOpacity={0.02} />
                                </linearGradient>
                            </defs>

                            <CartesianGrid stroke="rgba(255,255,255,0.03)" strokeDasharray="3 3" />

                            <XAxis
                                dataKey="time"
                                tickFormatter={(t: number) => formatShortDate(t, active)}
                                tick={{ fill: 'var(--color-on-surface-variant)', fontSize: 12 }}
                                axisLine={false}
                                tickLine={false}
                                minTickGap={20}
                            />

                            <YAxis
                                domain={yDomain}
                                tickFormatter={(v: number) => v != null ? `$${Number(v).toFixed(2)}` : ''}
                                tick={{ fill: 'var(--color-on-surface-variant)', fontSize: 12 }}
                                axisLine={false}
                                tickLine={false}
                            />

                            <Tooltip
                                contentStyle={{ background: 'rgba(29,31,36,0.9)', border: '1px solid rgba(255,255,255,0.04)', color: 'var(--color-on-surface)' }}
                                labelFormatter={(label) => dayjs(label).format('MMM D, YYYY h:mm A')}
                                formatter={(value) => [`$${Number(value).toFixed(4)}`, 'Price']}
                            />

                            <Area
                                type="monotone"
                                dataKey="price"
                                strokeWidth={2}
                                stroke="#cdbdff"
                                fillOpacity={1}
                                fill={`url(#grad-${id})`}
                                dot={false}
                            />

                            <Line
                                type="monotone"
                                dataKey="price"
                                stroke="#e8deff"
                                strokeWidth={2}
                                dot={false}
                                activeDot={{ r: 5, strokeWidth: 2, stroke: '#e8deff' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}
