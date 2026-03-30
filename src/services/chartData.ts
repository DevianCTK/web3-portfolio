// Deterministic seeded chart data per timeframe.
// Uses the current price as an anchor and generates historically-plausible paths.

export interface ChartPoint {
  x: number; // 0..1 normalized position
  y: number; // price value
  label: string; // human-readable time label
}

export interface ChartData {
  points: ChartPoint[];
  path: string; // SVG path for the line
  areaPath: string; // SVG path for the filled area
  low: number;
  high: number;
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const TIMEFRAME_CONFIG: Record<string, { points: number; volatility: number; labels: (i: number, n: number) => string }> = {
  '1D': {
    points: 24,
    volatility: 0.015,
    labels: (i, n) => {
      const h = Math.floor((i / n) * 24);
      return h.toString().padStart(2, '0') + ':00';
    },
  },
  '1W': {
    points: 7,
    volatility: 0.04,
    labels: (i) => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i % 7],
  },
  '1M': {
    points: 30,
    volatility: 0.08,
    labels: (i) => 'Day ' + (i + 1),
  },
  '1Y': {
    points: 12,
    volatility: 0.25,
    labels: (i) => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i % 12],
  },
  ALL: {
    points: 20,
    volatility: 0.6,
    labels: (i) => (2020 + i).toString(),
  },
};

export function generateChartData(currentPrice: number, timeframe: string, coinSeed: number = 42): ChartData {
  const config = TIMEFRAME_CONFIG[timeframe] || TIMEFRAME_CONFIG['1D'];
  const rand = seededRandom(coinSeed + timeframe.charCodeAt(0) * 100);
  const n = config.points;

  // Generate prices: walk backward from current price
  const prices: number[] = new Array(n);
  prices[n - 1] = currentPrice;
  for (let i = n - 2; i >= 0; i--) {
    const change = (rand() - 0.48) * config.volatility * currentPrice;
    prices[i] = Math.max(currentPrice * 0.5, prices[i + 1] - change);
  }

  const low = Math.min(...prices);
  const high = Math.max(...prices);
  const range = high - low || 1;

  const points: ChartPoint[] = prices.map((p, i) => ({
    x: i / (n - 1),
    y: p,
    label: config.labels(i, n),
  }));

  // Build SVG paths in a 1000x300 viewBox
  const W = 1000;
  const H = 300;
  const PADDING = 20;

  const toSvgX = (x: number) => x * W;
  const toSvgY = (price: number) => PADDING + ((high - price) / range) * (H - 2 * PADDING);

  // Build cubic bezier curve
  let line = 'M' + toSvgX(points[0].x).toFixed(1) + ',' + toSvgY(points[0].y).toFixed(1);
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cpx1 = toSvgX(prev.x + (curr.x - prev.x) * 0.4);
    const cpx2 = toSvgX(curr.x - (curr.x - prev.x) * 0.4);
    line += ' C' + cpx1.toFixed(1) + ',' + toSvgY(prev.y).toFixed(1);
    line += ' ' + cpx2.toFixed(1) + ',' + toSvgY(curr.y).toFixed(1);
    line += ' ' + toSvgX(curr.x).toFixed(1) + ',' + toSvgY(curr.y).toFixed(1);
  }

  const areaPath = line + ' L' + W + ',' + H + ' L0,' + H + ' Z';

  return { points, path: line, areaPath, low, high };
}
