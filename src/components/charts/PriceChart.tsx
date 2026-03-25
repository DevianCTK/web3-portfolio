import { Card } from '../ui/Card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', price: 1800 },
  { name: 'Tue', price: 1850 },
  { name: 'Wed', price: 1820 },
  { name: 'Thu', price: 1900 },
  { name: 'Fri', price: 1880 },
  { name: 'Sat', price: 1950 },
  { name: 'Sun', price: 1940 },
];

export function PriceChart() {
  return (
    <Card className="p-6 h-[400px] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">ETH Price</h3>
          <p className="text-sm text-green-500 font-medium">+5.24% past week</p>
        </div>
        <div className="flex gap-2">
          {['1D', '1W', '1M', '1Y', 'ALL'].map((tf) => (
            <button
              key={tf}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition ${tf === '1W'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 min-h-[0]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              dy={10}
            />
            <YAxis
              domain={['dataMin - 50', 'dataMax + 50']}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              dx={-10}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              itemStyle={{ color: '#4f46e5', fontWeight: 'bold' }}
              formatter={(value) => [`$${value}`, 'Price']}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#4f46e5"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorPrice)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
