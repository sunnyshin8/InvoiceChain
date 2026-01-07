'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { MarketTicker } from '@/components/market/MarketTicker';
import { CoinCard } from '@/components/market/CoinCard';
import { PriceChart } from '@/components/market/PriceChart';
import { Loader2 } from 'lucide-react';

interface MarketData {
    id: string;
    symbol: string;
    name: string;
    current_price: number;
    price_change_percentage_24h: number;
    sparkline_in_7d: { price: number[] };
}

export default function MarketPage() {
    const [coins, setCoins] = useState<MarketData[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCoin, setActiveCoin] = useState<any>(null); // To store currently selected coin for the big chart
    const [historyData, setHistoryData] = useState<{ time: number; price: number }[]>([]);
    const [range, setRange] = useState<'1D' | '1W' | '1M' | '6M'>('6M');

    const fetchHistory = async (symbol: string, timeRange: string) => {
        try {
            // For MNEE, generate mock stable data
            if (symbol === 'MNEE') {
                const points = timeRange === '1D' ? 24 : timeRange === '1W' ? 168 : 180;
                const mock = Array.from({ length: points }, (_, i) => {
                    const now = Date.now();
                    const time = now - (points - i) * (timeRange === '1D' ? 300000 : 86400000); // approx logic
                    return {
                        time,
                        price: 1.00 + (Math.random() * 0.002 - 0.001)
                    };
                });
                setHistoryData(mock);
                return;
            }

            // For real coins, fetch from backend history
            const res = await axios.get(`http://localhost:3001/api/market/history`, {
                params: { symbol, range: timeRange }
            });
            setHistoryData(res.data);
        } catch (e) {
            console.error("Failed to fetch history");
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch real data for major coins via our Backend Proxy, respecting the selected Range
                const response = await axios.get('http://localhost:3001/api/market', {
                    params: { range }
                });
                setCoins(response.data);

                // Default active coin to MNEE if not set, or update if kept
                if (!activeCoin) {
                    setActiveCoin({
                        id: 'mnee',
                        symbol: 'mnee',
                        name: 'MNEE Token',
                        current_price: 1.00,
                        price_change_percentage_24h: 0
                    });
                    fetchHistory('MNEE', range);
                }
            } catch (error) {
                console.error("Failed to fetch market data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 60000); // 1 min update
        return () => clearInterval(interval);
    }, [range]); // Re-fetch list when range changes

    // Refetch history when range or activeCoin changes
    useEffect(() => {
        if (activeCoin) {
            fetchHistory(activeCoin.symbol.toUpperCase(), range);
        }
    }, [range, activeCoin]);

    const Ranges = ['1D', '1W', '1M', '6M'];

    return (
        <div className="min-h-screen bg-gray-50/50">
            <MarketTicker items={coins} />

            <div className="max-w-7xl mx-auto px-6 py-10">
                <div className="mb-10">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Market Overview</h1>
                    <p className="text-gray-500">Live tracking of global crypto assets and MNEE stability.</p>
                </div>

                {loading ? (
                    <div className="h-64 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                    </div>
                ) : (
                    <div className="space-y-12">
                        {/* Featured Asset (Interactive) */}
                        {activeCoin && (
                            <div className="bg-white rounded-3xl p-8 shadow-xl border border-indigo-100 overflow-hidden relative transition-all">
                                <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                                    <span className="text-9xl font-bold uppercase">{activeCoin.symbol}</span>
                                </div>

                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
                                    <div className="flex items-center gap-4 relative z-10">
                                        <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg uppercase">
                                            {activeCoin.symbol[0]}
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-bold text-gray-900">{activeCoin.name}</h2>
                                            <div className="flex items-center gap-2">
                                                <div className="text-2xl font-bold text-gray-900">${activeCoin.current_price.toLocaleString()} <span className="text-sm font-medium text-gray-400">USD</span></div>
                                                <span className={`px-2 py-0.5 rounded text-sm font-bold ${activeCoin.price_change_percentage_24h >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                                    {activeCoin.price_change_percentage_24h > 0 ? '+' : ''}{activeCoin.price_change_percentage_24h.toFixed(2)}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Range Selectors */}
                                    <div className="bg-gray-100 p-1 rounded-xl flex">
                                        {Ranges.map((r) => (
                                            <button
                                                key={r}
                                                onClick={() => setRange(r as any)}
                                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${range === r ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                                            >
                                                {r}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="h-[400px] w-full">
                                    <PriceChart
                                        data={historyData}
                                        color={activeCoin.price_change_percentage_24h >= 0 ? '#10B981' : '#EF4444'}
                                        height={400}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Market Grid */}
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Global Market (Select to View)</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {/* Always add MNEE to the grid so we can switch back to it */}
                                {/* Always add MNEE to the grid so we can switch back to it */}
                                <div
                                    onClick={() => setActiveCoin({ id: 'mnee', symbol: 'MNEE', name: 'MNEE Token', current_price: 1.00, price_change_percentage_24h: 0 })}
                                    className={`cursor-pointer transition-all ${activeCoin?.symbol.toLowerCase() === 'mnee' ? 'ring-2 ring-indigo-600 rounded-2xl scale-[1.02]' : ''}`}
                                >
                                    <CoinCard
                                        name="MNEE Token"
                                        symbol="MNEE"
                                        price={1.00}
                                        change24h={0}
                                        sparklineData={[{ time: '0', price: 1 }, { time: '1', price: 1 }]} // minimal data for card
                                    />
                                </div>

                                {coins.map((coin) => (
                                    <div
                                        key={coin.id}
                                        onClick={() => setActiveCoin(coin)}
                                        className={`cursor-pointer transition-all ${activeCoin?.symbol === coin.symbol ? 'ring-2 ring-indigo-600 rounded-2xl scale-[1.02]' : 'hover:scale-[1.02]'}`}
                                    >
                                        <CoinCard
                                            name={coin.name}
                                            symbol={coin.symbol}
                                            price={coin.current_price}
                                            change24h={coin.price_change_percentage_24h}
                                            sparklineData={coin.sparkline_in_7d.price.map((p, i) => ({ time: i.toString(), price: p }))}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
