export default function ApiDocsPage() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-20">
            <h1 className="text-4xl font-bold mb-6">API Reference</h1>
            <p className="text-xl text-gray-500 mb-12">Interact with our protocol programmatically.</p>

            <div className="space-y-8">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">GET</span>
                        <code className="text-sm font-mono text-gray-800">/api/invoices</code>
                    </div>
                    <p className="text-gray-600 text-sm">Retrieve a list of invoices for a specific vendor or buyer.</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">POST</span>
                        <code className="text-sm font-mono text-gray-800">/api/invoices/create</code>
                    </div>
                    <p className="text-gray-600 text-sm">Upload invoice metadata to IPFS and return the hash.</p>
                </div>
            </div>
        </div>
    );
}
