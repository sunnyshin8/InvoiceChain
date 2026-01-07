import { Router } from 'express';
import { store, Invoice } from '../store';

const router = Router();

// Create Invoice
router.post('/create', (req, res) => {
    const {
        vendorId,
        customerId,
        items,
        dueDate
    } = req.body;

    // Validate inputs
    if (!vendorId || !customerId || !items || items.length === 0) {
        res.status(400).json({ success: false, message: "Missing required fields" });
        return;
    }

    // Lookup Parties
    // In real app, we check if vendorId matches authenticated user
    const vendor = store.users.find(u => u.id === vendorId);
    const customer = store.customers.find(c => c.id === customerId);

    if (!vendor || !customer) {
        res.status(404).json({ success: false, message: "Vendor or Customer not found" });
        return;
    }

    // Calculate Totals
    let subTotal = 0;
    items.forEach((item: any) => {
        subTotal += (item.quantity * item.rate);
    });

    const tdsRate = 1; // 1%
    const tdsAmount = (subTotal * tdsRate) / 100;
    const totalAmount = subTotal + tdsAmount;

    // Create Invoice Object
    const newInvoice: Invoice = {
        id: `inv-${Date.now()}`,
        invoiceNumber: `INV-${Date.now()}`, // Simple sequential mock
        date: Date.now(),
        dueDate: new Date(dueDate).getTime(), // Ensure timestamp
        vendorId,
        customerId,
        vendorDetails: {
            name: vendor.businessName,
            address: vendor.description || 'Address',
            // Mock Identifiers if not in store
            gst: '29ABCDE1234F1Z5'
        },
        customerDetails: {
            name: customer.name,
            address: customer.address,
            phone: customer.phone,
            gst: customer.gst
        },
        items: items.map((i: any, idx: number) => ({ ...i, id: `item-${idx}`, amount: i.quantity * i.rate })),
        subTotal,
        tdsRate,
        tdsAmount,
        totalAmount,
        status: 'PENDING',
        ipfsHash: `ipfs://mock-${Date.now()}`
    };

    store.invoices.push(newInvoice);

    res.json({
        success: true,
        invoice: newInvoice,
        metadataHash: newInvoice.ipfsHash
    });
});

// Get all invoices
router.get('/', (req, res) => {
    res.json(store.invoices);
});

// Get single invoice
router.get('/:id', (req, res) => {
    const invoice = store.invoices.find(i => i.id === req.params.id);
    if (!invoice) {
        res.status(404).json({ message: "Invoice not found" });
        return;
    }
    res.json(invoice);
});

export default router;
