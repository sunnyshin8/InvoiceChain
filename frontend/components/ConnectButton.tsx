'use client';

import { useConnect } from 'wagmi';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

export function ConnectButton({ className, text = "Connect Wallet" }: { className?: string, text?: string }) {
    const { connect, connectors, isPending, error } = useConnect();
    const [showOptions, setShowOptions] = useState(false);

    // Filter out duplicates and "Injected" if "MetaMask" is already present
    const uniqueConnectors = connectors.filter((c, i, self) => {
        // 1. Dedup by ID
        if (i !== self.findIndex((t) => t.id === c.id)) return false;

        // 2. Hide "Injected" if "MetaMask" is present
        if (c.id === 'injected' && self.some(other => other.name.toLowerCase().includes('metamask'))) {
            return false;
        }

        return true;
    });

    // Helper to get display name
    const getDisplayName = (c: any) => {
        if (c.id === 'injected') return 'Browser Wallet';
        if (c.name === 'Injected') return 'Browser Wallet';
        return c.name;
    };

    if (uniqueConnectors.length === 0) {
        return (
            <button disabled className={`${className || "bg-gray-400 text-white px-6 py-2.5 rounded-full font-medium cursor-not-allowed"}`}>
                No Wallet Detected
            </button>
        );
    }

    // If only one connector, just show the button
    if (uniqueConnectors.length === 1) {
        const connector = uniqueConnectors[0];
        return (
            <div className="relative">
                <button
                    onClick={() => connect({ connector })}
                    disabled={isPending}
                    className={`flex items-center justify-center gap-2 ${className || "bg-black text-white px-6 py-2.5 rounded-full hover:bg-gray-800 transition-all font-medium shadow-lg hover:shadow-xl"}`}
                >
                    {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                    {text}
                </button>
                {error && <div className="absolute top-full mt-2 right-0 bg-red-100 text-red-600 text-xs p-2 rounded shadow-lg z-50 whitespace-nowrap">
                    {error.message.slice(0, 30)}...
                </div>}
            </div>
        );
    }

    // Multiple connectors
    return (
        <div className="relative">
            <button
                onClick={() => setShowOptions(!showOptions)}
                className={`flex items-center justify-center gap-2 ${className || "bg-black text-white px-6 py-2.5 rounded-full hover:bg-gray-800 transition-all font-medium shadow-lg hover:shadow-xl"}`}
            >
                {text}
            </button>

            {showOptions && (
                <div className="absolute top-full mt-2 right-0 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden min-w-[200px] z-50 flex flex-col">
                    {uniqueConnectors.map((connector) => (
                        <button
                            key={connector.id}
                            onClick={() => {
                                connect({ connector });
                                setShowOptions(false);
                            }}
                            disabled={isPending}
                            className="text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-none flex items-center justify-between group"
                        >
                            <span className="font-medium text-gray-700 group-hover:text-black">{getDisplayName(connector)}</span>
                            {isPending && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
                        </button>
                    ))}
                </div>
            )}
            {error && <div className="absolute top-full mt-2 right-0 bg-red-100 text-red-600 text-xs p-2 rounded shadow-lg z-50 whitespace-nowrap">
                {error.message.slice(0, 30)}...
            </div>}
        </div>
    );
}
