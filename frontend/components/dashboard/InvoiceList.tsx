'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract, usePublicClient } from 'wagmi';
import { INVOICE_MANAGER_ABI, INVOICE_MANAGER_ADDRESS } from '@/app/constants';
import { formatEther } from 'viem';
import { InvoiceCard, Invoice } from './InvoiceCard';
import { Loader2 } from 'lucide-react';
import { ConnectButton } from '../ConnectButton';
import { useDemo } from '@/context/DemoContext';

export function InvoiceList({ limit }: { limit?: number }) {
    const { address, isConnected } = useAccount();
    const { isDemoConnected } = useDemo();
    const publicClient = usePublicClient();
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // We only enable contract reads if REAL wallet is connected
    const shouldFetchContract = isConnected && !!address;

    // 1. Get IDs where user is Vendor
    const { data: vendorIds, refetch: refetchVendor } = useReadContract({
        abi: INVOICE_MANAGER_ABI,
        address: INVOICE_MANAGER_ADDRESS as `0x${string}`,
        functionName: 'getInvoicesByVendor',
        args: [address],
        query: { enabled: shouldFetchContract }
    });

    // 2. Get IDs where user is Buyer
    const { data: buyerIds, refetch: refetchBuyer } = useReadContract({
        abi: INVOICE_MANAGER_ABI,
        address: INVOICE_MANAGER_ADDRESS as `0x${string}`,
        functionName: 'getInvoicesByBuyer',
        args: [address],
        query: { enabled: shouldFetchContract }
    });

    useEffect(() => {
        // If Demo Connected: Fetch Mock Data from API
        if (isDemoConnected) {
            setIsLoading(true);
            fetch('http://localhost:3001/api/invoices')
                .then(res => res.json())
                .then(data => {
                    // For demo, just show all or filter by mock user
                    setInvoices(data);
                })
                .catch(err => console.error("Demo fetch error", err))
                .finally(() => setIsLoading(false));
            return;
        }

        if (!address || !publicClient || !shouldFetchContract) return;

        const fetchDetails = async () => {
            setIsLoading(true);
            try {
                const vIds = (vendorIds as bigint[]) || [];
                const bIds = (buyerIds as bigint[]) || [];
                // Uniques
                const allIds = Array.from(new Set([...vIds, ...bIds]));

                if (allIds.length === 0) {
                    setInvoices([]);
                    setIsLoading(false);
                    return;
                }

                // Fetch details for each ID in parallel
                const data = await Promise.all(
                    allIds.map(async (id) => {
                        const inv = await publicClient.readContract({
                            address: INVOICE_MANAGER_ADDRESS as `0x${string}`,
                            abi: INVOICE_MANAGER_ABI,
                            functionName: 'invoices',
                            args: [id]
                        }) as any; // typing tuple return is tricky in viem generic

                        // Map tuple to object
                        // struct: id, vendor, buyer, amount, metadataHash, dueDate, status, escrowId
                        return {
                            id: inv[0],
                            vendor: inv[1],
                            buyer: inv[2],
                            amount: inv[3],
                            metadataHash: inv[4],
                            dueDate: inv[5],
                            status: inv[6],
                            escrowId: inv[7]
                        } as Invoice;
                    })
                );

                // Sort by ID desc
                data.sort((a, b) => Number(b.id - a.id));
                setInvoices(data);
            } catch (e) {
                console.error("Error fetching invoice details:", e);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDetails();
    }, [vendorIds, buyerIds, address, publicClient, isDemoConnected, shouldFetchContract]);

    if (!address && !isDemoConnected) {
        return (
            <div className="text-center p-8 bg-gray-50 rounded-xl border border-dashed border-gray-300 flex flex-col items-center gap-4">
                <p className="text-gray-600">Please connect your wallet or try Demo Mode to view invoices.</p>
                <ConnectButton className="bg-black text-white px-6 py-2 rounded-full font-bold hover:bg-gray-800 transition shadow-md" />
            </div>
        );
    }

    if (isLoading) {
        return <div className="flex justify-center p-10"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;
    }

    if (invoices.length === 0) {
        return (
            <div className="text-center p-12 bg-white rounded-xl border border-gray-100 shadow-sm">
                <p className="text-gray-500 mb-2">No invoices found.</p>
                <p className="text-sm text-gray-400">Create one to get started!</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {invoices.slice(0, limit || invoices.length).map((inv) => (
                <InvoiceCard
                    key={inv.id.toString()}
                    invoice={inv}
                    isBuyer={false} // For demo, assume admin/vendor view mostly
                    fullDetails={isDemoConnected ? (inv as any) : undefined}
                />
            ))}
        </div>
    );
}
