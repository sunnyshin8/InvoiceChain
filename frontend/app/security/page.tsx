import { ShieldCheck } from 'lucide-react';

export default function SecurityPage() {
    return (
        <div className="max-w-3xl mx-auto px-6 py-20">
            <div className="flex items-center gap-4 mb-8 text-indigo-600">
                <ShieldCheck className="w-12 h-12" />
                <h1 className="text-4xl font-bold text-gray-900">Security First</h1>
            </div>
            <div className="prose prose-lg text-gray-500">
                <p className="mb-4">
                    Security is at the core of InvoiceChain Pro. Our smart contracts are built using industry-standard libraries
                    (OpenZeppelin) and designed with safety mechanisms like non-reentrant guards and access controls.
                </p>
                <h3 className="text-gray-900 font-bold text-xl mt-8 mb-4">Audits</h3>
                <p>
                    Our core contracts (SmartEscrow, InvoiceManager) are currently in the internal audit phase.
                    We use immutable logic for escrow locks to prevent fund tampering.
                </p>
            </div>
        </div>
    );
}
