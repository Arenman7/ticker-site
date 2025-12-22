import { redirect } from "next/navigation";

type Symbol = {
    symbol: string;
    name: string;
    price: number;
    change: number;
    percentChange: number;
    volume: number;
}

export default async function TickerPage({ params }: { params: Promise<{ symbol: string }> }) {
    const { symbol } = await params;

    if (!symbol) {
        redirect("/dashboard");
    }

    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`;

    const res = await fetch(url, {
        // daily caching
        next: { revalidate: 60 * 60 * 24 },
    });

    if (!res.ok) {
        redirect("/dashboard");
    }

    const data = await res.json();

    if (data["Error Message"] || data["Note"]) {
        redirect("/dashboard");
    }

    const series = data["Time Series (Daily)"];
    if (!series) {
        redirect("/dashboard");
    }

    const dates = Object.keys(series).sort().reverse();

    const prices = dates.map((date, index) => {
        const today = series[date];
        const yesterday = series[dates[index + 1]];

        const close = Number(today["4. close"]);
        const prevClose = yesterday
            ? Number(yesterday["4. close"])
            : close;

        return {
            date,
            close,
            volume: Number(today["5. volume"]),
            percentChange:
                ((close - prevClose) / prevClose) * 100,
        };
    });

    return (
        <div>
            <h1>{symbol}</h1>
        </div>
    );
}
