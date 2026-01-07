'use client';

import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { PriceChart } from './PriceChart';

interface CoinCardProps {
    name: string;
    symbol: string;
    price: number;
    change24h: number;
    sparklineData: { time: string; price: number }[];
}

export function CoinCard({ name, symbol, price, change24h, sparklineData }: CoinCardProps) {
    const isPositive = change24h >= 0;
    const color = isPositive ? "#10B981" : "#EF4444";

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-bold text-gray-900 text-lg">{name}</h3>
                    <p className="text-gray-500 text-sm font-medium">{symbol.toUpperCase()}</p>
                </div>
                <div className={`flex items-center gap-1 text-sm font-bold ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                    {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    {Math.abs(change24h).toFixed(2)}%
                </div>
            </div>

            <div className="mb-4">
                <span className="text-3xl font-bold text-gray-900">${price.toLocaleString()}</span>
            </div>

            <div className="h-16">
                <PriceChart data={sparklineData} color={color} height={64} showAxes={false} />
            </div>
        </div>
    );
}
