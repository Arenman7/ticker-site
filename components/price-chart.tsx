
type Price = {
    close: number;
};

export default function PriceChart({ data }: { data: Price[] }) {
    if (data.length === 0) return null;

    const prices = data.map(d => d.close);
    const max = Math.max(...prices);
    const min = Math.min(...prices);

    const points = prices
        .map((price, i) => {
            const x = (i / (prices.length - 1)) * 100;
            const y = ((max - price) / (max - min)) * 100;
            return `${x},${y}`;
        })
        .join(" ");

    return (
        <div className="p-4  rounded bg-neutral-950">
            <svg viewBox="0 0 100 100" className="w-full h-60">
                <polyline
                    fill="none"
                    stroke="gray"
                    strokeWidth="1"
                    points={points}
                />
            </svg>
        </div>
    );
}
