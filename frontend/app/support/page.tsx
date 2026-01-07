'use client';

import { Mail, MessageSquare, Phone } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';

export default function SupportPage() {
    return (
        <div className="max-w-7xl mx-auto px-6 py-20">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold mb-4">Contact Our Support Team</h1>
                <p className="text-xl text-gray-500">We're here to help with any questions or technical issues.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                <Card className="text-center hover:shadow-lg transition">
                    <CardContent className="pt-8 pb-8">
                        <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Mail className="w-8 h-8 text-indigo-600" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Email Support</h3>
                        <p className="text-gray-500 mb-6">For general inquiries and account support.</p>
                        <a href="mailto:support@invoicechain.pro" className="text-indigo-600 font-semibold hover:underline">
                            support@invoicechain.pro
                        </a>
                    </CardContent>
                </Card>

                <Card className="text-center hover:shadow-lg transition">
                    <CardContent className="pt-8 pb-8">
                        <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <MessageSquare className="w-8 h-8 text-purple-600" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Live Chat</h3>
                        <p className="text-gray-500 mb-6">Chat with our team Mon-Fri, 9am-5pm EST.</p>
                        <button className="text-indigo-600 font-semibold hover:underline">
                            Start Chat
                        </button>
                    </CardContent>
                </Card>

                <Card className="text-center hover:shadow-lg transition">
                    <CardContent className="pt-8 pb-8">
                        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Phone className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Enterprise Support</h3>
                        <p className="text-gray-500 mb-6">Dedicated phone support for Enterprise plans.</p>
                        <a href="tel:+15550000000" className="text-indigo-600 font-semibold hover:underline">
                            +91 8349891955
                        </a>
                    </CardContent>
                </Card>
            </div>

            <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                            <input type="text" className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                            <input type="text" className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input type="email" className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                        <textarea rows={4} className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
                    </div>
                    <button type="submit" className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition">
                        Send Message
                    </button>
                </form>
            </div>
        </div>
    );
}
