'use client';

import { CreateInvoiceForm } from '@/components/dashboard/CreateInvoiceForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CreateInvoicePage() {
    return (
        <div className="max-w-3xl mx-auto px-6 py-10">
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-8 font-medium transition">
                <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>
            
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Create Invoice</h1>
                <p className="text-gray-500 mt-2">Issue a new on-chain invoice to receive MNEE payments.</p>
            </div>

            <CreateInvoiceForm />
        </div>
    );
}
