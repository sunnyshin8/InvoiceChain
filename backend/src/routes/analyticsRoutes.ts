import { Router } from 'express';
import { store } from '../store';

const router = Router();

router.get('/', (req, res) => {
    // Calculate basic stats from in-memory store
    const totalRevenue = store.invoices
        .filter(inv => inv.status !== 'CANCELLED')
        .reduce((sum, inv) => sum + inv.totalAmount, 0);

    const grossCollections = store.invoices
        .filter(inv => inv.status === 'PAID')
        .reduce((sum, inv) => sum + inv.totalAmount, 0);

    const pendingAmount = store.invoices
        .filter(inv => inv.status === 'PENDING' || inv.status === 'OVERDUE')
        .reduce((sum, inv) => sum + inv.totalAmount, 0);

    const totalInvoices = store.invoices.length;

    // Simple projection: existing revenue + 20% growth
    const projectedRevenue = totalRevenue * 1.20;

    // Mock trend data
    const monthlyTrend = [
        { name: 'Jan', revenue: 4000 },
        { name: 'Feb', revenue: 3000 },
        { name: 'Mar', revenue: 2000 },
        { name: 'Apr', revenue: 2780 },
        { name: 'May', revenue: 1890 },
        { name: 'Jun', revenue: 2390 },
        { name: 'Jul', revenue: 3490 },
    ];

    res.json({
        totalRevenue,
        grossCollections,
        pendingAmount,
        totalInvoices,
        projectedRevenue,
        monthlyTrend
    });
});

export default router;
