'use client';

import { API_BASE_URL } from '@/lib/config';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { User, Phone, MapPin, Building2 } from 'lucide-react';
import { Customer } from '@/types';
import { toast } from 'sonner';

export function CustomerList() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/customers`);
            const data = await res.json();
            setCustomers(data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load customers");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-4 text-center">Loading customers...</div>;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-indigo-600" /> Customer Management
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100 text-gray-500 text-sm">
                                <th className="p-3">Name</th>
                                <th className="p-3">Contact</th>
                                <th className="p-3">Address</th>
                                <th className="p-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map((cust) => (
                                <tr key={cust.id} className="border-b border-gray-50 group hover:bg-gray-50 transition-colors">
                                    <td className="p-3 font-medium text-gray-900 flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold">
                                            {cust.name.substring(0, 2).toUpperCase()}
                                        </div>
                                        {cust.name}
                                    </td>
                                    <td className="p-3 text-sm text-gray-600">
                                        <div className="flex flex-col gap-1">
                                            <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {cust.phone}</span>
                                            {cust.email && <span className="text-xs text-gray-400">{cust.email}</span>}
                                        </div>
                                    </td>
                                    <td className="p-3 text-sm text-gray-600">
                                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {cust.address}</span>
                                    </td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${cust.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {cust.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {customers.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-gray-400">No customers found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
