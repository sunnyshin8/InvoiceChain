'use client';

import { API_BASE_URL } from '@/lib/config';
import { useState, useEffect } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import { INVOICE_MANAGER_ABI, INVOICE_MANAGER_ADDRESS } from '@/app/constants';
import { parseEther } from 'viem';
import { FileText, Send, Loader2, Plus, Trash2, Building2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { toast } from 'sonner';
import { Customer } from '@/types';
import { useDemo } from '@/context/DemoContext';

export function CreateInvoiceForm() {
    const { address, isConnected } = useAccount();
    const { isDemoConnected, demoAddress } = useDemo();
    const activeAddress = isConnected ? address : (isDemoConnected ? demoAddress : null);
    const [loading, setLoading] = useState(false);

    // Invoice State
    const [selectedCustomer, setSelectedCustomer] = useState<string>('');
    const [customers, setCustomers] = useState<Customer[]>([]);

    const [invoiceItems, setInvoiceItems] = useState([{ id: 1, desc: '', qty: 1, rate: 0 }]);
    const [dueDate, setDueDate] = useState<string>('');

    // Fetch Customers (simulate business data)
    useEffect(() => {
        fetch(`${API_BASE_URL}/api/customers`)
            .then(res => res.json())
            .then(data => setCustomers(data))
            .catch(err => console.error(err));
    }, []);

    // Derived Financials
    const subTotal = invoiceItems.reduce((acc, item) => acc + (item.qty * item.rate), 0);
    const tdsAmount = subTotal * 0.01;
    const totalPayable = subTotal + tdsAmount;

    const { writeContractAsync } = useWriteContract();

    const addRow = () => {
        setInvoiceItems([...invoiceItems, { id: Date.now(), desc: '', qty: 1, rate: 0 }]);
    };

    const removeRow = (id: number) => {
        if (invoiceItems.length > 1) {
            setInvoiceItems(invoiceItems.filter(item => item.id !== id));
        }
    };

    const updateRow = (id: number, field: string, value: any) => {
        setInvoiceItems(invoiceItems.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const handleCreate = async () => {
        if (!isConnected && !isDemoConnected) {
            toast.error("Please connect your wallet first.");
            return;
        }

        if (!selectedCustomer || !dueDate || subTotal <= 0) {
            toast.error("Please fill in all required fields.");
            return;
        }

        setLoading(true);
        const toastId = toast.loading("Processing Invoice...");

        try {
            // 1. Upload Metadata to Backend
            const response = await fetch(`${API_BASE_URL}/api/invoices/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    vendorId: 'user-1', // Mock verified user
                    customerId: selectedCustomer,
                    dueDate,
                    items: invoiceItems.map(i => ({
                        description: i.desc,
                        quantity: Number(i.qty),
                        rate: Number(i.rate)
                    }))
                })
            });

            const data = await response.json();
            if (!data.success) throw new Error(data.message || "Failed to upload metadata");

            toast.loading("Metadata Uploaded. Waiting for wallet...", { id: toastId });

            // 2. Create on Blockchain (Using the TOTAL PAYABLE amount)
            // 2. Create on Blockchain (Using the TOTAL PAYABLE amount)
            // Note: In real world, we might split payment (99% to vendor, 1% to tax authority)
            // Here we just record the full payable amount on chain for MVP
            const customerObj = customers.find(c => c.id === selectedCustomer);
            if (!customerObj) throw new Error("Invalid Customer");

            if (isDemoConnected) {
                // SIMULATE BLOCKCHAIN TX FOR DEMO
                await new Promise(resolve => setTimeout(resolve, 2000));
                toast.success("Admin Invoice Created! (Simulated On-Chain)", { id: toastId });
            } else {
                // Mock buyer verification (in real app, customer would have a linked wallet)
                const buyerAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"; // Hardcoded for demo if customer doesn't have wallet

                await writeContractAsync({
                    abi: INVOICE_MANAGER_ABI,
                    address: INVOICE_MANAGER_ADDRESS as `0x${string}`,
                    functionName: 'createInvoice',
                    args: [buyerAddress, parseEther(totalPayable.toString()), data.metadataHash, BigInt(new Date(dueDate).getTime() / 1000)],
                });
                toast.success("Invoice Created Successfully!", { id: toastId });
            }

            // Reset
            setInvoiceItems([{ id: Date.now(), desc: '', qty: 1, rate: 0 }]);

        } catch (e: any) {
            console.error(e);
            toast.error(e.message || 'Error creating invoice', { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-600" /> Create New Invoice
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Business Header Preview */}
                <div className="text-center mb-6 border-b pb-4">
                    <h2 className="text-2xl font-bold text-gray-900">InvoiceChain Solutions Pvt Ltd</h2>
                    <p className="text-gray-500 text-sm whitespace-pre-line">
                        123 Innovation Park, Cyber City, Bangalore - 560100
                        CIN: U72200KA2023PTC123456 | GST: 29ABCDE1234F1Z5
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bill To (Customer)</label>
                        <select
                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={selectedCustomer}
                            onChange={(e) => setSelectedCustomer(e.target.value)}
                        >
                            <option value="">Select Customer</option>
                            {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                        <input
                            type="date"
                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                        />
                    </div>
                </div>

                {/* Items Table */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Itemized Services / Products</label>
                    <div className="border rounded-xl overflow-hidden overflow-x-auto">
                        <table className="w-full text-left min-w-[600px]">
                            <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                                <tr>
                                    <th className="p-3">Description</th>
                                    <th className="p-3 w-24">Qty</th>
                                    <th className="p-3 w-32">Rate</th>
                                    <th className="p-3 w-32">Total</th>
                                    <th className="p-3 w-10"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {invoiceItems.map((item) => (
                                    <tr key={item.id}>
                                        <td className="p-2">
                                            <input
                                                className="w-full p-1 bg-transparent border-none focus:ring-0 min-w-[200px]"
                                                placeholder="Item description"
                                                value={item.desc}
                                                onChange={(e) => updateRow(item.id, 'desc', e.target.value)}
                                            />
                                        </td>
                                        <td className="p-2">
                                            <input
                                                type="number"
                                                className="w-full p-1 bg-transparent border-none focus:ring-0"
                                                value={item.qty}
                                                onChange={(e) => updateRow(item.id, 'qty', e.target.value)}
                                            />
                                        </td>
                                        <td className="p-2">
                                            <input
                                                type="number"
                                                className="w-full p-1 bg-transparent border-none focus:ring-0"
                                                value={item.rate}
                                                onChange={(e) => updateRow(item.id, 'rate', e.target.value)}
                                            />
                                        </td>
                                        <td className="p-2 font-medium text-gray-700">
                                            {(item.qty * item.rate).toFixed(2)}
                                        </td>
                                        <td className="p-2">
                                            <button onClick={() => removeRow(item.id)} className="text-red-400 hover:text-red-600">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <button onClick={addRow} className="mt-2 text-sm text-indigo-600 font-medium hover:underline flex items-center gap-1">
                        <Plus className="w-4 h-4" /> Add Line Item
                    </button>
                </div>

                {/* Totals */}
                <div className="flex justify-end mb-6">
                    <div className="w-64 space-y-2">
                        <div className="flex justify-between text-gray-600">
                            <span>Subtotal:</span>
                            <span>{subTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600 text-sm">
                            <span>Add: TDS (1%):</span>
                            <span>+ {tdsAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg text-gray-900 border-t pt-2">
                            <span>Net Payable:</span>
                            <span>{totalPayable.toFixed(2)} MNEE</span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleCreate}
                    disabled={loading}
                    className="w-full bg-black text-white py-4 rounded-xl hover:bg-gray-800 font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    {loading ? 'Processing...' : 'Issue Professional Invoice'}
                </button>
            </CardContent>
        </Card>
    );
}
