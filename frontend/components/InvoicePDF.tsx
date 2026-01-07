'use client';

import React from 'react';
import { Invoice } from '@/types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function generateInvoicePDF(invoice: Invoice) {
    const element = document.getElementById(`invoice-pdf-${invoice.id}`);
    if (!element) return;

    // Element is already properly positioned off-screen but visible to DOM
    const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true, // Help with images
        logging: false
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`invoice-${invoice.invoiceNumber || invoice.id}.pdf`);
}

export function InvoicePDFTemplate({ invoice }: { invoice: Invoice }) {
    return (
        <div
            id={`invoice-pdf-${invoice.id}`}
            style={{
                width: '210mm',
                minHeight: '297mm',
                padding: '20mm',
                background: 'white',
                position: 'fixed',
                top: 0,
                left: '-9999px',
                zIndex: -1000
            }}
            className="font-sans"
        >
            {/* Header */}
            <div className="flex justify-between items-start mb-12">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight" style={{ color: '#312e81' }}>INVOICE</h1>
                    <p className="mt-2" style={{ color: '#6b7280' }}>#{invoice.id.toString().replace('inv-', '').slice(-6)}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-xl font-bold" style={{ color: '#1f2937' }}>{invoice.vendorDetails.name}</h2>
                    <p className="text-sm mt-1 whitespace-pre-line leading-relaxed" style={{ color: '#4b5563' }}>
                        {invoice.vendorDetails.address}
                    </p>
                    <div className="mt-2 text-xs" style={{ color: '#6b7280' }}>
                        {invoice.vendorDetails.gst && <p>GST: {invoice.vendorDetails.gst}</p>}
                        {/* Check type safely */}
                        {'cin' in invoice.vendorDetails && <p>CIN: {(invoice.vendorDetails as any).cin}</p>}
                    </div>
                </div>
            </div>

            {/* Bill To & Details */}
            {/* Bill To & Details */}
            <div className="flex justify-between mb-12">
                <div className="w-1/2">
                    <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#9ca3af' }}>Bill To</p>
                    <h3 className="text-lg font-bold" style={{ color: '#1f2937' }}>{invoice.customerDetails.name}</h3>
                    <p className="text-sm mt-1 whitespace-pre-line" style={{ color: '#4b5563' }}>
                        {invoice.customerDetails.address}
                    </p>
                    {invoice.customerDetails.gst && (
                        <p className="text-xs mt-2" style={{ color: '#6b7280' }}>GST: {invoice.customerDetails.gst}</p>
                    )}
                </div>
                <div className="w-1/3 text-right">
                    <div className="mb-4">
                        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#9ca3af' }}>Date</p>
                        <p className="text-sm font-medium">{new Date(invoice.date).toLocaleDateString()}</p>
                    </div>
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#9ca3af' }}>Due Date</p>
                        <p className="text-sm font-medium">{new Date(invoice.dueDate).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>

            {/* Table */}
            {/* Table */}
            <div className="mb-8">
                <table className="w-full text-left">
                    <thead style={{ backgroundColor: '#f9fafb' }}>
                        <tr>
                            <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider w-1/2" style={{ color: '#6b7280' }}>Description</th>
                            <th className="py-3 px-4 text-center text-xs font-bold uppercase tracking-wider" style={{ color: '#6b7280' }}>Qty</th>
                            <th className="py-3 px-4 text-right text-xs font-bold uppercase tracking-wider" style={{ color: '#6b7280' }}>Rate</th>
                            <th className="py-3 px-4 text-right text-xs font-bold uppercase tracking-wider" style={{ color: '#6b7280' }}>Amount</th>
                        </tr>
                    </thead>
                    <tbody style={{ borderTop: '1px solid #f3f4f6' }}>
                        {invoice.items.map((item, idx) => (
                            <tr key={idx} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                <td className="py-4 px-4 text-sm" style={{ color: '#1f2937' }}>{item.description}</td>
                                <td className="py-4 px-4 text-center text-sm" style={{ color: '#4b5563' }}>{item.quantity}</td>
                                <td className="py-4 px-4 text-right text-sm" style={{ color: '#4b5563' }}>{item.rate.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                <td className="py-4 px-4 text-right text-sm font-medium" style={{ color: '#1f2937' }}>{item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Totals */}
            {/* Totals */}
            <div className="flex justify-end mb-16">
                <div className="w-1/2 pt-4" style={{ borderTop: '1px solid #e5e7eb' }}>
                    <div className="flex justify-between mb-2 text-sm">
                        <span style={{ color: '#4b5563' }}>Subtotal</span>
                        <span className="font-medium" style={{ color: '#111827' }}>{invoice.subTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between mb-2 text-sm">
                        <span style={{ color: '#4b5563' }}>TDS (1%)</span>
                        <span className="font-medium" style={{ color: '#111827' }}>+ {invoice.tdsAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between pt-3 mt-3" style={{ borderTop: '1px solid #111827' }}>
                        <span className="text-base font-bold" style={{ color: '#111827' }}>Total Payable</span>
                        <span className="text-xl font-bold" style={{ color: '#312e81' }}>
                            {invoice.totalAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }).replace('₹', 'MNEE ')}
                        </span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="pt-8 mt-auto" style={{ borderTop: '1px solid #f3f4f6' }}>
                <div className="flex justify-between items-center">
                    <div className="text-xs" style={{ color: '#9ca3af' }}>
                        <p>Thank you for your business.</p>
                        <p className="mt-1">Authorized Signatory</p>
                    </div>
                    <div className="text-right text-xs font-mono" style={{ color: '#d1d5db' }}>
                        Generated by InvoiceChain
                    </div>
                </div>
            </div>
        </div>
    );
}
