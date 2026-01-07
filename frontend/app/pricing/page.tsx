export default function PricingPage() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
            <h1 className="text-4xl font-bold mb-6">Pricing</h1>
            <p className="text-xl text-gray-500 mb-12">Simple, transparent pricing for teams of all sizes.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-2">Starter</h3>
                    <div className="text-3xl font-bold mb-4">$0 <span className="text-sm font-normal text-gray-400">/mo</span></div>
                    <p className="text-gray-500 text-sm mb-6">Perfect for freelancers.</p>
                    <button className="w-full py-2 bg-gray-100 rounded-lg font-medium text-gray-900">Current Plan</button>
                </div>
                <div className="bg-white p-8 rounded-2xl border-2 border-indigo-600 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs px-2 py-1">POPULAR</div>
                    <h3 className="font-bold text-gray-900 mb-2">Pro</h3>
                    <div className="text-3xl font-bold mb-4">$29 <span className="text-sm font-normal text-gray-400">/mo</span></div>
                    <p className="text-gray-500 text-sm mb-6">For growing agencies.</p>
                    <button className="w-full py-2 bg-indigo-600 text-white rounded-lg font-medium">Upgrade</button>
                </div>
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-2">Enterprise</h3>
                    <div className="text-3xl font-bold mb-4">Custom</div>
                    <p className="text-gray-500 text-sm mb-6">For large organizations.</p>
                    <button className="w-full py-2 bg-gray-100 rounded-lg font-medium text-gray-900">Contact Us</button>
                </div>
            </div>
        </div>
    );
}
