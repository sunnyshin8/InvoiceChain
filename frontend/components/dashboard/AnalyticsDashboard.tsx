'use client';

import { useQuery } from '@tanstack/react-query';
import { TrendingUp, Activity, ShieldCheck } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';

import { AnalyticsData } from '@/types';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export function AnalyticsDashboard() {
    const { data: analytics } = useQuery<AnalyticsData>({
        queryKey: ['analytics'],
        queryFn: () => fetch('http://localhost:3001/api/analytics').then(r => r.json())
    });

    if (!analytics) return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-pulse">
            {[1, 2, 3].map(i => <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>)}
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><TrendingUp className="w-24 h-24" /></div>
                    <div className="flex items-center gap-2 opacity-80 mb-2 font-medium"><TrendingUp className="w-4 h-4" /> Total Revenue</div>
                    <div className="text-4xl font-extrabold tracking-tight">{Number(analytics.totalRevenue).toLocaleString()} <span className="text-lg opacity-70 font-normal">MNEE</span></div>
                    <div className="mt-4 pt-4 border-t border-white/20 text-sm opacity-90 font-medium">
                        Projected: {analytics.projectedRevenue?.toLocaleString()} MNEE
                    </div>
                </div>

                <Card>
                    <CardContent className="h-full flex flex-col justify-center">
                        <div className="flex items-center gap-2 text-gray-500 mb-2 font-medium"><Activity className="w-4 h-4 text-orange-500" /> Collection Status</div>
                        <div className="flex justify-between items-end mb-1">
                            <div>
                                <div className="text-2xl font-bold text-gray-900">{analytics.grossCollections.toLocaleString()}</div>
                                <div className="text-xs text-gray-400">Gross Collected</div>
                            </div>
                            <div className="text-right">
                                <div className="text-xl font-bold text-red-500">{analytics.pendingAmount.toLocaleString()}</div>
                                <div className="text-xs text-gray-400">Pending</div>
                            </div>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(analytics.grossCollections / (analytics.totalRevenue || 1)) * 100}%` }}></div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="h-full flex flex-col justify-center">
                        <div className="flex items-center gap-2 text-gray-500 mb-2 font-medium"><Activity className="w-4 h-4 text-orange-500" /> Activity</div>
                        <div className="text-3xl font-bold text-gray-900">{analytics.totalInvoices} <span className="text-sm font-normal text-gray-400">Total Invoices</span></div>
                        <div className="text-sm text-green-600 mt-2 font-medium bg-green-50 inline-block px-2 py-0.5 rounded-md">▲ 12% vs last month</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="h-full flex flex-col justify-center">
                        <div className="flex items-center gap-2 text-gray-500 mb-2 font-medium"><ShieldCheck className="w-4 h-4 text-green-500" /> Operational Stats</div>
                        <div className="text-3xl font-bold text-gray-900">{analytics.totalInvoices} <span className="text-sm font-normal text-gray-400">Total Invoices</span></div>
                        <div className="text-sm text-gray-400 mt-2">Business Health: Excellent</div>
                    </CardContent>
                </Card>
            </div>

            {/* Revenue Trend Chart */}
            <Card>
                <CardContent className="pt-6">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-indigo-600" /> Revenue Trend
                    </h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={analytics.monthlyTrend}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '0.5rem', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
