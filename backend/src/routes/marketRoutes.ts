import express from 'express';
import axios from 'axios';

const router = express.Router();

const SYMBOLS = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'LINKUSDT', 'MATICUSDT'];
const NAMES: Record<string, string> = {
    'BTCUSDT': 'Bitcoin',
    'ETHUSDT': 'Ethereum',
    'SOLUSDT': 'Solana',
    'LINKUSDT': 'Chainlink',
    'MATICUSDT': 'Polygon'
};

router.get('/', async (req, res) => {
    try {
        const { range } = req.query;
        // Map ranges to Binance interval/limit
        let interval = '1h';
        let limit = 24;

        // Determine interval/limit based on requested range
        switch (range) {
            case '1D': interval = '1h'; limit = 24; break;
            case '1W': interval = '4h'; limit = 42; break;
            case '1M': interval = '1d'; limit = 30; break;
            case '6M': interval = '1d'; limit = 180; break;
            default: interval = '1h'; limit = 24;
        }

        const formattedData = await Promise.all(SYMBOLS.map(async (sym) => {
            let sparklinePoints: number[] = [];
            let currentPrice = 0;
            let percentChange = 0;

            try {
                // Fetch Klines
                const klinesRes = await axios.get(`https://api.binance.com/api/v3/klines`, {
                    params: { symbol: sym, interval, limit }
                });
                const klines = klinesRes.data;

                // Parse prices
                sparklinePoints = klines.map((k: any) => parseFloat(k[4]));
                currentPrice = sparklinePoints[sparklinePoints.length - 1]; // Last close


                const startPrice = parseFloat(klines[0][1]); // Open of first candle
                percentChange = ((currentPrice - startPrice) / startPrice) * 100;


            } catch (e) {
                console.error(`Failed data for ${sym}`);
            }

            return {
                id: NAMES[sym]?.toLowerCase() || sym,
                symbol: sym.replace('USDT', '').toLowerCase(),
                name: NAMES[sym] || sym,
                current_price: currentPrice,
                price_change_percentage_24h: percentChange,
                sparkline_in_7d: { price: sparklinePoints }
            };
        }));

        res.json(formattedData);
    } catch (error) {
        console.error('Error fetching market data:', error);
        res.status(500).json({ error: 'Failed to fetch market data' });
    }
});

// Endpoint for detailed history
router.get('/history', async (req, res) => {
    try {
        const { symbol, range } = req.query;
        // Map ranges to Binance interval/limit
        let interval = '1h';
        let limit = 24;

        switch (range) {
            case '1D': interval = '5m'; limit = 288; break; // 5m * 288 = 24h
            case '1W': interval = '1h'; limit = 168; break; // 1h * 168 = 7d
            case '1M': interval = '4h'; limit = 180; break; // 4h * 180 = 30d
            case '6M': interval = '1d'; limit = 180; break; // 1d * 180 = 180d
            default: interval = '1h'; limit = 24;
        }

        const binanceSymbol = (symbol as string).toUpperCase() + 'USDT';

        const response = await axios.get(`https://api.binance.com/api/v3/klines`, {
            params: {
                symbol: binanceSymbol,
                interval: interval,
                limit: limit
            }
        });

        // Format: [time, open, high, low, close, volume, ...]
        const history = response.data.map((k: any) => ({
            time: k[0], // Timestamp
            price: parseFloat(k[4]) // Close price
        }));

        res.json(history);

    } catch (error) {
        console.error('Error fetching history:', error);
        res.status(500).json({ error: 'Failed to fetch history' });
    }
});

export default router;
