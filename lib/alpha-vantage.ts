export type CompanyOverview = {
    symbol: string;
    name: string;
    exchange: string;
    sector: string;
    industry: string;
    marketCap: number | null;
};

export function normalizeOverview(raw: any) {
    return {
        symbol: raw.Symbol ?? "N/A",
        name: raw.Name ?? "N/A",
        exchange: raw.Exchange ?? "N/A",
        sector: raw.Sector ?? "N/A",
        industry: raw.Industry ?? "N/A",
        marketCap: raw.MarketCapitalization
            ? Number(raw.MarketCapitalization)
            : null,
    };
}

export async function fetchCompanyOverview(symbol: string) {
    const res = await fetch(
        `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`,
        { next: { revalidate: 60 * 60 * 24 } }
    );

    const data = await res.json();

    // console.log(data);


    if (data.Note) {
        return { error: "RATE_LIMIT" as const };
    }

    if (!data.Symbol) {
        return { error: "NOT_FOUND" as const };
    }

    return normalizeOverview(data);
}

export async function fetchDailyPrices(symbol: string) {
    const res = await fetch(
        `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`,
        { next: { revalidate: 60 * 60 * 24 } }
    );

    const data = await res.json();

    if (data.Note || !data["Time Series (Daily)"]) {
        return []; // return array, even if API fails
    }

    const series = data["Time Series (Daily)"];
    const dates = Object.keys(series).sort().reverse();

    return dates.map((date, index) => {
        const today = series[date];
        const yesterday = series[dates[index + 1]];

        const close = Number(today["4. close"]);
        const prevClose = yesterday ? Number(yesterday["4. close"]) : close;

        return {
            date,
            close,
            volume: Number(today["5. volume"]),
            percentChange: ((close - prevClose) / prevClose) * 100,
        };
    });
}
