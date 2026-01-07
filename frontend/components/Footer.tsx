import Link from 'next/link';

export function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100 py-12">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="col-span-1 md:col-span-2">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">I</div>
                        <span className="text-xl font-bold text-gray-900">InvoiceChain Pro</span>
                    </div>
                    <p className="text-gray-500 max-w-sm">
                        The decentralized standard for B2B invoicing and payments. Secured by Ethereum and MNEE Stablecoin.
                    </p>
                </div>
                <div>
                    <h4 className="font-bold text-gray-900 mb-4">Platform</h4>
                    <ul className="space-y-2 text-gray-500">
                        <li><Link href="/features" className="hover:text-indigo-600">Features</Link></li>
                        <li><Link href="/pricing" className="hover:text-indigo-600">Pricing</Link></li>
                        <li><Link href="/security" className="hover:text-indigo-600">Security</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-gray-900 mb-4">Resources</h4>
                    <ul className="space-y-2 text-gray-500">
                        <li><Link href="/docs" className="hover:text-indigo-600">Documentation</Link></li>
                        <li><Link href="/api-docs" className="hover:text-indigo-600">API Reference</Link></li>
                        <li><Link href="/support" className="hover:text-indigo-600">Support</Link></li>
                    </ul>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-gray-100 text-center text-gray-400 text-sm">
                © 2026 InvoiceChain Pro. All rights reserved.
            </div>
        </footer>
    );
}
