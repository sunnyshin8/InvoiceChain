'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

interface DemoContextType {
    isDemoConnected: boolean;
    demoAddress: string | null;
    connectDemoWallet: () => void;
    disconnectDemoWallet: () => void;
    isConnecting: boolean;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export function DemoProvider({ children }: { children: React.ReactNode }) {
    const [isDemoConnected, setIsDemoConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const demoAddress = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"; // Mock ETH Address

    const connectDemoWallet = () => {
        if (isDemoConnected) return;

        setIsConnecting(true);
        // Simulate network delay
        setTimeout(() => {
            setIsDemoConnected(true);
            setIsConnecting(false);
            toast.success("Demo Wallet Connected");
        }, 1500);
    };

    const disconnectDemoWallet = () => {
        setIsDemoConnected(false);
        toast.info("Demo Wallet Disconnected");
    };

    return (
        <DemoContext.Provider value={{
            isDemoConnected,
            demoAddress: isDemoConnected ? demoAddress : null,
            connectDemoWallet,
            disconnectDemoWallet,
            isConnecting
        }}>
            {children}
        </DemoContext.Provider>
    );
}

export function useDemo() {
    const context = useContext(DemoContext);
    if (context === undefined) {
        throw new Error('useDemo must be used within a DemoProvider');
    }
    return context;
}
