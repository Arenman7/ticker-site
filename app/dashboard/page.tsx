import { Suspense } from "react";
import TickerRow from "@/components/ticker-row";
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Dashboard | Stocks',
    description: 'A list of stocks and their company information.',
}

const TICKERS = [
    "AAPL","PYPL","BDX","IDXX","O","PSX","EA","CMG",
    "VLO","EW","D","ROP","AIG","PSA","OKE","EXC"
];

export default function Dashboard() {
    return (
        <div className="max-w-5xl mx-auto p-6 text-gray-100">
            <h1 className="text-2xl font-bold mb-6">Stock Dashboard</h1>

            <div className="grid grid-cols-5 gap-4 p-4 text-sm font-semibold text-gray-400 border-b border-neutral-700">
                <div>Symbol</div>
                <div className="col-span-2">Company</div>
                <div>Sector</div>
                <div className="text-right">Market Cap</div>
            </div>

            <div className="space-y-2 mt-2">
                {TICKERS.map((symbol, index) => (
                    <Suspense
                        key={symbol}
                        fallback={
                            <div className="grid grid-cols-5 gap-4 p-4 border rounded bg-neutral-900 text-sm text-gray-500">
                                <div>{symbol}</div>
                                <div className="col-span-2">Loading…</div>
                                <div>—</div>
                                <div className="text-right">—</div>
                            </div>
                        }
                    >
                        <TickerRow symbol={symbol} delayMs={index * 1100} />
                    </Suspense>
                ))}
            </div>
        </div>
    );
}
