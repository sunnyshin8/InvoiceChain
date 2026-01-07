import { Router } from 'express';
import { store, Customer } from '../store';

const router = Router();

// GET all customers
router.get('/', (req, res) => {
    // In a real app, filter by the logged-in user's business
    res.json(store.customers);
});

// POST create customer
router.post('/create', (req, res) => {
    const { name, address, phone, email, gst } = req.body;

    if (!name || !address) {
        res.status(400).json({ success: false, message: 'Name and Address are required' });
        return;
    }

    const newCustomer: Customer = {
        id: `cust-${Date.now()}`,
        name,
        address,
        phone,
        email,
        gst,
        status: 'ACTIVE'
    };

    store.customers.push(newCustomer);
    res.json({ success: true, customer: newCustomer });
});

export default router;
