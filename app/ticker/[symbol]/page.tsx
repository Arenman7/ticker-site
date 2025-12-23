import { fetchCompanyOverview, fetchDailyPrices } from "@/lib/alpha-vantage";
import PriceChart from "@/components/price-chart";
import PriceTable from "@/components/price-table";
import { formatMarketCap } from "@/lib/format";
import Link from "next/link";

function rateLimitUI(symbol: string) {
    return (
        <div className="flex items-center justify-center h-screen bg-neutral-900">
            <div className="p-6 text-sm text-gray-400 max-w-3xl mx-auto text-center">
                <h1 className="text-lg font-semibold text-white">{symbol}</h1>
                <p className="mt-4">
                    Data is temporarily unavailable due to API limits.
                </p>
                <p className="mt-2">Please wait and refresh in a moment.</p>
                <Link
                    href="/dashboard"
                    className="inline-block mt-4 px-4 py-2 rounded bg-gray-700 text-white hover:bg-gray-600"
                >
                    Back to Dashboard
                </Link>
            </div>
        </div>

    );
}

export default async function TickerPage({ params }: { params: Promise<{ symbol: string }> }) {
    const { symbol } = await params;

    const overview = await fetchCompanyOverview(symbol);
    if (!overview || "error" in overview) return rateLimitUI(symbol);

    // Wait 1.1s to avoid Alpha Vantage rate limits
    await new Promise((r) => setTimeout(r, 1100));

    const prices = await fetchDailyPrices(symbol);
    if (!prices || "error" in prices) return rateLimitUI(symbol);

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-6 text-gray-100">
            {/* Navigation */}
            <div>
                <Link
                    href="/dashboard"
                    className="inline-block mb-4 px-4 py-2 rounded bg-neutral-800 hover:bg-neutral-600"
                >
                    &larr; Back to Dashboard
                </Link>
            </div>

            {/* company and price chart*/}
            <div className="border rounded bg-neutral-900 p-6 flex flex-col lg:flex-row">
                <div className="flex-1 pr-0 lg:pr-6 space-y-2">
                    <h1 className="text-2xl font-bold">{overview.name || "N/A"}</h1>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div><strong>Symbol:</strong> {overview.symbol || "N/A"}</div>
                        <div><strong>Exchange:</strong> {overview.exchange || "N/A"}</div>
                        <div><strong>Sector:</strong> {overview.sector || "N/A"}</div>
                        <div><strong>Industry:</strong> {overview.industry || "N/A"}</div>
                        <div><strong>Market Cap:</strong> {formatMarketCap(overview.marketCap) || "N/A"}</div>
                    </div>
                </div>

                <div className="flex-1 mt-6 lg:mt-0">
                    <h2 className="font-semibold mb-4">Price History</h2>
                    <PriceChart data={prices.slice(0, 100)} />
                </div>
            </div>



            {/* price list */}
            <div className="border rounded bg-neutral-900 p-6">
                <h2 className="font-semibold mb-4">Daily Prices</h2>
                <PriceTable data={prices} />
            </div>
        </div>
    );
}
