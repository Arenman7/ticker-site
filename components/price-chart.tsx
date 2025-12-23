type Price = {
    close: number;
    date: string;
};

export default function PriceChart({ data }: { data: Price[] }) {
    if (data.length === 0) return null;

    const VIEWBOX_WIDTH = 200;
    const VIEWBOX_HEIGHT = 100;

    // prices received are recent first, must reverse.
    const ordered = [...data].reverse();

    const prices = ordered.map(d => d.close);
    const max = Math.max(...prices);
    const min = Math.min(...prices);
    const range = max - min || 1;

    const padding = {
        left: 25,
        right: 5,
        top: 5,
        bottom: 15,
    };

    const width =
        VIEWBOX_WIDTH - padding.left - padding.right;
    const height =
        VIEWBOX_HEIGHT - padding.top - padding.bottom;

    const points = prices
        .map((price, i) => {
            const x =
                padding.left +
                (i / (prices.length - 1)) * width;
            const y =
                padding.top +
                ((max - price) / range) * height;
            return `${x},${y}`;
        })
        .join(" ");

    const yTicks = 4;
    const yLabels = Array.from({ length: yTicks + 1 }, (_, i) => {
        const value = max - (i / yTicks) * range;
        const y =
            padding.top + (i / yTicks) * height;
        return { value, y };
    });

    const xTicks = 4;
    const xLabels = Array.from({ length: xTicks + 1 }, (_, i) => {
        const index = Math.floor(
            (i / xTicks) * (ordered.length - 1)
        );
        const date = new Date(ordered[index].date);
        return {
            label: date.toLocaleDateString("en-US", {
                month: "short",
                year: "2-digit",
            }),
            x:
                padding.left +
                (index / (ordered.length - 1)) * width,
        };
    });

    return (
        <div className="p-4 rounded bg-neutral-900 text-neutral-300">
            <svg
                viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
                className="w-full h-64"
            >
                {yLabels.map((t, i) => (
                    <g key={i}>
                        {/* grid */}
                        <line
                            x1={padding.left}
                            x2={VIEWBOX_WIDTH - padding.right}
                            y1={t.y}
                            y2={t.y}
                            stroke="#262626"
                            strokeWidth="0.4"
                        />
                        {/* y labels */}
                        <text
                            x={padding.left - 2}
                            y={t.y + 1}
                            fontSize="3"
                            textAnchor="end"
                            fill="#a3a3a3"
                        >
                            ${t.value.toFixed(2)}
                        </text>

                    </g>
                ))}

                {/* prices line */}
                <polyline
                    fill="none"
                    stroke="#e5e5e5"
                    strokeWidth="0.8"
                    points={points}
                />

                {/* X labels */}
                {xLabels.map((t, i) => (
                    <text
                        key={i}
                        x={t.x}
                        y={VIEWBOX_HEIGHT - 4}
                        fontSize="3"
                        textAnchor="middle"
                        fill="#a3a3a3"
                    >
                        {t.label}
                    </text>
                ))}
            </svg>
        </div>
    );
}
