export function MarketTicker({ items }: { items: { symbol: string, current_price: number, price_change_percentage_24h: number, id: string }[] }) {
    // Determine color based on 24h change
    const getColor = (change: number) => {
        if (change > 0) return 'text-emerald-400';
        if (change < 0) return 'text-red-400';
        return 'text-gray-400';
    };

    const formatPrice = (price: number) => {
        return price >= 1000 ? price.toLocaleString() : price.toFixed(2);
    };

    // If no items, show default placeholder to avoid empty bar
    const displayItems = items.length > 0 ? items : [
        { symbol: 'BTC', current_price: 0, price_change_percentage_24h: 0, id: 'bitcoin' },
        { symbol: 'ETH', current_price: 0, price_change_percentage_24h: 0, id: 'ethereum' }
    ];

    // Duplicate list multiple times to ensure smooth infinite scroll without gaps
    const marqueeItems = [...displayItems, ...displayItems, ...displayItems, ...displayItems];

    return (
        <div className="bg-black text-white overflow-hidden py-3 border-b border-gray-800">
            <div className="flex animate-marquee whitespace-nowrap gap-12 text-sm font-mono items-center hover:[animation-play-state:paused]">
                {marqueeItems.map((item, index) => (
                    <span key={`${item.id}-${index}`} className={`${getColor(item.price_change_percentage_24h)} flex items-center gap-2`}>
                        <span className="font-bold text-white">{item.symbol.toUpperCase()}</span>
                        ${formatPrice(item.current_price)}
                        <span className="opacity-80">({item.price_change_percentage_24h.toFixed(1)}%)</span>
                    </span>
                ))}

                {/* Always include MNEE Manual Entry */}
                <span className="text-indigo-400 font-bold flex items-center gap-2">
                    <span className="text-white">MNEE</span>
                    $1.00
                    <span className="opacity-80">(Pegged)</span>
                </span>
            </div>
        </div>
    );
}
