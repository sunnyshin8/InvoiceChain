'use client';

import { AnalyticsDashboard } from '@/components/dashboard/AnalyticsDashboard';
import { InvoiceList } from '@/components/dashboard/InvoiceList';
import { CustomerList } from '@/components/dashboard/CustomerList';
import Link from 'next/link';
import { Plus, Users, Shield } from 'lucide-react';
import { useState } from 'react';

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState<'overview' | 'customers' | 'history'>('overview');
    const [userRole, setUserRole] = useState<'ADMIN' | 'BILLER'>('ADMIN');

    return (
        <div className="max-w-7xl mx-auto px-6 py-10">
            {/* RBAC Simulation Toggle */}
            <div className="fixed bottom-6 right-6 bg-white p-3 rounded-xl shadow-2xl border border-gray-100 z-50 flex flex-col gap-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Simulate Role</span>
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => setUserRole('ADMIN')}
                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${userRole === 'ADMIN' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500'}`}
                    >
                        Admin
                    </button>
                    <button
                        onClick={() => setUserRole('BILLER')}
                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${userRole === 'BILLER' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500'}`}
                    >
                        Biller
                    </button>
                </div>
            </div>

            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold mb-2 text-gray-900 flex items-center gap-3">
                        Dashboard
                        <span className="text-xs px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100 font-medium">
                            {userRole} VIEW
                        </span>
                    </h1>
                    <p className="text-gray-500">Overview of your financial activity</p>
                </div>
                <Link href="/invoices/create" className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-indigo-700 transition shadow-lg">
                    <Plus className="w-4 h-4" /> New Invoice
                </Link>
            </div>

            {/* Tabs */}
            <div className="flex gap-6 border-b border-gray-200 mb-8 overflow-x-auto">
                <button
                    onClick={() => setActiveTab('overview')}
                    className={`pb-4 px-2 text-sm font-medium transition-all relative whitespace-nowrap ${activeTab === 'overview' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Overview
                    {activeTab === 'overview' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full" />}
                </button>

                {userRole === 'ADMIN' && (
                    <button
                        onClick={() => setActiveTab('customers')}
                        className={`pb-4 px-2 text-sm font-medium transition-all relative whitespace-nowrap ${activeTab === 'customers' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Customer Management
                        {activeTab === 'customers' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full" />}
                    </button>
                )}

                <button
                    onClick={() => setActiveTab('history')}
                    className={`pb-4 px-2 text-sm font-medium transition-all relative whitespace-nowrap ${activeTab === 'history' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Invoice History
                    {activeTab === 'history' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full" />}
                </button>
            </div>

            {activeTab === 'overview' && (
                <div className="animate-in fade-in duration-500">
                    <AnalyticsDashboard />
                    <div className="mt-12">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Recent Invoices</h2>
                            <button onClick={() => setActiveTab('history')} className="text-indigo-600 text-sm font-semibold hover:underline">View All History</button>
                        </div>
                        <InvoiceList limit={3} />
                    </div>
                </div>
            )}

            {activeTab === 'customers' && userRole === 'ADMIN' && (
                <div className="animate-in fade-in duration-500">
                    <CustomerList />
                </div>
            )}

            {activeTab === 'history' && (
                <div className="animate-in fade-in duration-500">
                    <InvoiceList />
                </div>
            )}
        </div>
    );
}
