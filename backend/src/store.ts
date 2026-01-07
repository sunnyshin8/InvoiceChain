// Minimal in-memory store for MVP

export interface User {
    id: string;
    username: string;
    role: 'ADMIN' | 'BILLER' | 'EMPLOYEE';
    businessName: string;
    description?: string; // Business description/address for header
}

export interface Customer {
    id: string;
    name: string;
    address: string;
    phone: string;
    email?: string;
    gst?: string;
    status: 'ACTIVE' | 'INACTIVE';
}

export interface InvoiceItem {
    id: string;
    description: string;
    quantity: number;
    rate: number;
    amount: number;
}

export interface Invoice {
    id: string;
    invoiceNumber: string;
    date: number;
    dueDate: number;

    // Parties
    vendorId: string; // Link to User/Business
    customerId: string; // Link to Customer

    // Snapshotted details to preserve history if customer/vendor changes
    vendorDetails: {
        name: string;
        address: string;
        gst?: string;
        cin?: string;
    };
    customerDetails: {
        name: string;
        address: string;
        phone?: string;
        gst?: string;
    };

    items: InvoiceItem[];

    // Financials
    subTotal: number;
    tdsRate: number; // e.g. 1.0 for 1%
    tdsAmount: number;
    totalAmount: number; // Final payable

    ipfsHash?: string;
    status: 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED';
}

// Initial Mock Data
const users: User[] = [
    {
        id: 'user-1',
        username: 'admin',
        role: 'ADMIN',
        businessName: 'InvoiceChain Solutions Pvt Ltd',
        description: '123 Innovation Park, Cyber City, Bangalore - 560100\nCIN: U72200KA2023PTC123456 | GST: 29ABCDE1234F1Z5'
    },
    {
        id: 'user-2',
        username: 'biller',
        role: 'BILLER',
        businessName: 'InvoiceChain Solutions Pvt Ltd',
        description: '123 Innovation Park, Cyber City, Bangalore - 560100'
    }
];

const customers: Customer[] = [
    {
        id: 'cust-1',
        name: 'Nexus Corp',
        address: '45 Business Bay, Mumbai',
        phone: '+91 9876543210',
        email: 'accounts@nexus.com',
        status: 'ACTIVE'
    },
    {
        id: 'cust-2',
        name: 'Alpha Traders',
        address: '88 Market Street, Delhi',
        phone: '+91 1122334455',
        status: 'ACTIVE'
    }
];

const invoices: Invoice[] = [
    {
        id: 'inv-101',
        invoiceNumber: 'INV-2024-001',
        date: Date.now() - 86400000 * 5,
        dueDate: Date.now() + 86400000 * 25,
        vendorId: 'user-1',
        customerId: 'cust-1',
        vendorDetails: {
            name: 'TechFlow Solutions Pvt Ltd',
            address: '123 Innovation Park, Bangalore\nGST: 29ABC...',
        },
        customerDetails: {
            name: 'Nexus Corp',
            address: '45 Business Bay, Mumbai',
            phone: '+91 9876543210'
        },
        items: [
            { id: 'item-1', description: 'Consulting Services', quantity: 10, rate: 5000, amount: 50000 }
        ],
        subTotal: 50000,
        tdsRate: 1,
        tdsAmount: 500,
        totalAmount: 49500,
        status: 'PENDING'
    }
];

export const store = {
    users,
    customers,
    invoices
};
