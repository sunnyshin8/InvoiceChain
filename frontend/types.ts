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
    vendorDetails: {
        name: string;
        address: string;
        gst?: string;
    };
    customerDetails: {
        name: string;
        address: string;
        phone?: string;
        gst?: string;
    };
    items: InvoiceItem[];
    subTotal: number;
    tdsRate: number;
    tdsAmount: number;
    totalAmount: number;
    status: 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED';
    ipfsHash?: string;
}

export interface AnalyticsData {
    totalRevenue: number;
    grossCollections: number;
    pendingAmount: number;
    totalInvoices: number;
    projectedRevenue: number;
    monthlyTrend: { name: string; revenue: number }[];
}
