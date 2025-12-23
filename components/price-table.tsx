type Price = {
    date: string;
    close: number;
    volume: number;
    percentChange: number;
};

export default function PriceTable({ data }: { data: Price[] }) {
    return (
        <div className="space-y-1">

            <div className="grid grid-cols-4 gap-4 p-1 text-sm font-semibold text-gray-400">
                <div className="text-left">Date</div>
                <div className="text-right">Close</div>
                <div className="text-right">Volume</div>
                <div className="text-right">% Change</div>
            </div>

            {data.slice(0, 30).map((p) => (
                <div
                    key={p.date}
                    className="grid grid-cols-4 gap-4 p-4 rounded bg-neutral-950 text-sm"
                >
                    <div className="text-left">{p.date}</div>
                    <div className="text-right">${p.close.toFixed(2)}</div>
                    <div className="text-right">{p.volume.toLocaleString()}</div>
                    <div
                        className={`text-right ${
                            p.percentChange >= 0 ? "text-green-400" : "text-red-400"
                        }`}
                    >
                        {p.percentChange.toFixed(2)}%
                    </div>
                </div>
            ))}
        </div>
    );
}
