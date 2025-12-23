import Link from "next/link";
import { fetchCompanyOverview } from "@/lib/alpha-vantage";
import { formatMarketCap } from "@/lib/format";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

type Props = {
    symbol: string;
    delayMs: number;
};

export default async function TickerRow({ symbol, delayMs }: Props) {
    // 1 req per second, as per alpha vantage
    await delay(delayMs);

    const overview = await fetchCompanyOverview(symbol);

    // rate limiting
    if (!overview || "error" in overview) {
        return (
            <div className="grid grid-cols-5 gap-4 p-4 border rounded bg-neutral-900 text-sm text-gray-500">
                <div className="font-medium">{symbol}</div>
                <div className="col-span-2">Unavailable</div>
                <div>—</div>
                <div className="text-right">—</div>
            </div>
        );
    }

    return (
        <Link href={`/ticker/${overview.symbol}`} className="block">
            <div className="grid grid-cols-5 gap-4 p-4 border rounded bg-neutral-900 hover:bg-neutral-800 text-sm text-gray-100">

                <div className="font-semibold">{overview.symbol || symbol}</div>

                <div className="col-span-2">
                    <div className="font-medium">{overview.name || "N/A"}</div>
                    <div className="text-xs text-gray-400">{overview.exchange || "N/A"}</div>
                </div>

                <div className="text-gray-300">{overview.sector || "N/A"}</div>

                <div className="text-right font-medium">
                    {overview.marketCap ? formatMarketCap(overview.marketCap) : "N/A"}
                </div>
            </div>
        </Link>
    );
}
