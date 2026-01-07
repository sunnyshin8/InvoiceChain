export default function DocsPage() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-20">
            <h1 className="text-4xl font-bold mb-8">Documentation</h1>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <aside className="col-span-1 border-r border-gray-100 pr-6">
                    <h4 className="font-bold mb-4 text-sm uppercase text-gray-400">Getting Started</h4>
                    <ul className="space-y-3 text-sm text-gray-600">
                        <li className="text-indigo-600 font-medium">Introduction</li>
                        <li className="hover:text-gray-900 cursor-pointer">Installation</li>
                        <li className="hover:text-gray-900 cursor-pointer">Quick Start</li>
                    </ul>
                </aside>
                <div className="col-span-3">
                    <h2 className="text-2xl font-bold mb-4">Introduction to InvoiceChain</h2>
                    <p className="text-gray-600 mb-4">
                        InvoiceChain Pro is a set of smart contracts and dApps designed to facilitate trustless B2B payments.
                        By leveraging MNEE stablecoin, we ensure that payments are stable, instant, and borderless.
                    </p>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 font-mono text-sm text-gray-700">
                        npm install @invoicechain/sdk
                    </div>
                </div>
            </div>
        </div>
    );
}
