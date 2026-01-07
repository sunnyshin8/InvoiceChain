'use client';


import { useState } from 'react';
import { useWriteContract } from 'wagmi';
import { INVOICE_MANAGER_ABI, INVOICE_MANAGER_ADDRESS, MNEE_ABI, MNEE_TOKEN_ADDRESS, SMART_ESCROW_ABI, ESCROW_ADDRESS } from '@/app/constants';
import { formatEther } from 'viem';
import { ShieldCheck, Clock, CheckCircle, XCircle, FileDown, Loader2 } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Invoice as FullInvoice } from '@/types';
import { generateInvoicePDF, InvoicePDFTemplate } from '../InvoicePDF';

export type BlockchainInvoice = {
    id: bigint;
    vendor: `0x${string}`;
    buyer: `0x${string}`;
    amount: bigint;
    metadataHash: string;
    dueDate: bigint;
    status: number; // 0: Pending, 1: Approved, 2: Rejected, 3: Paid, 4: Cancelled
    escrowId: bigint;
};

const STATUS_CONFIG = [
    { label: 'Pending', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Clock },
    { label: 'Approved', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: CheckCircle },
    { label: 'Rejected', color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle },
    { label: 'Paid', color: 'bg-green-100 text-green-700 border-green-200', icon: ShieldCheck },
    { label: 'Cancelled', color: 'bg-gray-100 text-gray-700 border-gray-200', icon: XCircle },
];

export function InvoiceCard({ invoice, isBuyer, fullDetails }: { invoice: BlockchainInvoice | FullInvoice, isBuyer: boolean, fullDetails?: FullInvoice }) {
    const { writeContractAsync } = useWriteContract();
    const [generatingPdf, setGeneratingPdf] = useState(false);

    // Normalize status if it's from full details
    let statusIdx = 0;
    if ('status' in invoice && typeof invoice.status === 'string') {
        // Map string status to index
        const map: any = { 'PENDING': 0, 'APPROVED': 1, 'REJECTED': 2, 'PAID': 3, 'CANCELLED': 4 };
        statusIdx = map[invoice.status] || 0;
    } else {
        statusIdx = Number((invoice as BlockchainInvoice).status);
    }

    const status = STATUS_CONFIG[statusIdx] || STATUS_CONFIG[0];
    const StatusIcon = status.icon;

    // Helper: Handle PDF
    const handleDownloadPDF = async () => {
        if (!fullDetails) {
            alert('PDF details not available in this mode.');
            return;
        }
        setGeneratingPdf(true);
        try {
            await generateInvoicePDF(fullDetails);
        } catch (e) {
            console.error(e);
            alert('Failed to generate PDF');
        } finally {
            setGeneratingPdf(false);
        }
    };

    const handleApprove = async () => {
        try {
            await writeContractAsync({
                abi: INVOICE_MANAGER_ABI,
                address: INVOICE_MANAGER_ADDRESS as `0x${string}`,
                functionName: 'approveInvoice',
                args: [invoice.id],
            });
            alert('Approved! Transaction pending...');
        } catch (e) { console.error(e); alert('Failed to approve'); }
    };

    const handlePay = async () => {
        try {
            // 1. Approve MNEE
            await writeContractAsync({
                abi: MNEE_ABI,
                address: MNEE_TOKEN_ADDRESS as `0x${string}`,
                functionName: 'approve',
                args: [INVOICE_MANAGER_ADDRESS, invoice.amount],
            });
            // 2. Pay Invoice
            await writeContractAsync({
                abi: INVOICE_MANAGER_ABI,
                address: INVOICE_MANAGER_ADDRESS as `0x${string}`,
                functionName: 'payInvoice',
                args: [invoice.id],
            });
            alert('Paid! Funds moved to Escrow.');
        } catch (e) { console.error(e); alert('Failed to pay'); }
    };

    const handleRelease = async () => {
        try {
            await writeContractAsync({
                abi: SMART_ESCROW_ABI,
                address: ESCROW_ADDRESS as `0x${string}`,
                functionName: 'releaseFunds',
                args: [invoice.escrowId],
            });
            alert('Funds Released to Vendor!');
        } catch (e) { console.error(e); alert('Failed to release funds'); }
    };

    return (
        <Card className="hover:shadow-md transition-shadow duration-200">
            <CardContent>
                {/* PDF Template Hidden */}
                {fullDetails && <InvoicePDFTemplate invoice={fullDetails} />}

                <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-4">
                        <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center font-bold text-gray-400 border border-gray-100">
                            {/* Display ID: Truncate for simple view */}
                            #{invoice.id.toString().replace('inv-', '').slice(-6)}
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 text-lg">Web Development Services</h3>
                            <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                                <span>From: {'vendor' in invoice ? invoice.vendor.slice(0, 6) : (invoice as FullInvoice).vendorDetails?.name}</span>
                                <span>•</span>
                                <span>Due: {new Date(Number(invoice.dueDate) * ('vendor' in invoice ? 1000 : 1)).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                            {'amount' in invoice ? formatEther(invoice.amount) : (invoice as FullInvoice).totalAmount.toFixed(2)}
                        </div>
                        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide">MNEE</div>
                    </div>
                </div>

                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-50">
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${status.color}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {status.label.toUpperCase()}
                    </div>

                    <div className="flex gap-2">
                        {/* PDF Button */}
                        {fullDetails && (
                            <button
                                onClick={handleDownloadPDF}
                                disabled={generatingPdf}
                                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-semibold shadow-sm flex items-center gap-2"
                            >
                                {generatingPdf ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileDown className="w-3.5 h-3.5" />}
                                PDF
                            </button>
                        )}

                        {isBuyer && statusIdx === 0 && (
                            <button onClick={handleApprove} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-semibold shadow-sm">
                                Approve
                            </button>
                        )}
                        {isBuyer && invoice.status === 1 && (
                            <button onClick={handlePay} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-semibold shadow-sm flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4" /> Pay Escrow
                            </button>
                        )}
                        {invoice.status === 3 && (
                            <div className="flex items-center gap-4">
                                <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                                    <ShieldCheck className="w-4 h-4" /> Secured in Escrow
                                </span>
                                {isBuyer && (
                                    <button onClick={handleRelease} className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 text-sm font-semibold shadow-sm">
                                        Confirm & Release
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
