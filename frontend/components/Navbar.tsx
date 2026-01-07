'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { Wallet, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { ConnectButton } from './ConnectButton';
import { useDemo } from '@/context/DemoContext';
import { Loader2 } from 'lucide-react';

export function Navbar() {
    const { address, isConnected } = useAccount();
    const { connect } = useConnect();
    const { disconnect } = useDisconnect();
    const { isDemoConnected, connectDemoWallet, disconnectDemoWallet, isConnecting, demoAddress } = useDemo();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const activeAddress = isConnected ? address : demoAddress;
    const isMock = !isConnected && isDemoConnected;

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md">I</div>
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">InvoiceChain</span>
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    <Link href="/dashboard" className="text-gray-600 hover:text-indigo-600 font-medium transition">Dashboard</Link>
                    <Link href="/market" className="text-gray-600 hover:text-indigo-600 font-medium transition">Market</Link>
                    <Link href="/invoices/create" className="text-gray-600 hover:text-indigo-600 font-medium transition">Create Invoice</Link>
                </div>

                {/* Wallet Connection */}
                <div className="hidden md:block">
                    {isConnected ? (
                        <div className="flex items-center gap-4">
                            <div className="px-4 py-2 bg-gray-50 rounded-full font-mono text-sm font-medium flex items-center gap-2 border border-gray-200 text-gray-700">
                                <Wallet className="w-4 h-4 text-gray-400" />
                                {address?.slice(0, 6)}...{address?.slice(-4)}
                            </div>
                            <button
                                onClick={() => disconnect()}
                                className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-full hover:bg-red-50"
                                title="Disconnect"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    ) : isDemoConnected ? (
                        <div className="flex items-center gap-4">
                            <div className="px-4 py-2 bg-amber-50 rounded-full font-mono text-sm font-medium flex items-center gap-2 border border-amber-200 text-amber-700">
                                <Wallet className="w-4 h-4 text-amber-500" />
                                <span className="text-xs uppercase font-bold bg-amber-200 px-1 rounded text-amber-800 mr-1">ADMIN</span>
                                {demoAddress?.slice(0, 6)}...{demoAddress?.slice(-4)}
                            </div>
                            <button
                                onClick={disconnectDemoWallet}
                                className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-full hover:bg-red-50"
                                title="Exit Admin"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={connectDemoWallet}
                                disabled={isConnecting}
                                className="text-sm font-medium text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-lg hover:bg-gray-50 transition flex items-center gap-2"
                            >
                                {isConnecting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Admin View"}
                            </button>
                            <div className="h-4 w-px bg-gray-200 mx-1"></div>
                            <ConnectButton />
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button className="md:hidden p-2 text-gray-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-100 p-6 flex flex-col gap-4 shadow-xl">
                    <Link href="/dashboard" className="text-lg font-medium text-gray-800" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                    <Link href="/market" className="text-lg font-medium text-gray-800" onClick={() => setIsMenuOpen(false)}>Market</Link>
                    <Link href="/invoices/create" className="text-lg font-medium text-gray-800" onClick={() => setIsMenuOpen(false)}>Create Invoice</Link>
                    <div className="h-px bg-gray-100 my-2"></div>
                    {isConnected ? (
                        <button onClick={() => disconnect()} className="text-red-600 font-medium text-left">Sign Out</button>
                    ) : (
                        <ConnectButton className="bg-black text-white py-3 rounded-lg font-medium w-full" />
                    )}
                </div>
            )}
        </nav>
    );
}
