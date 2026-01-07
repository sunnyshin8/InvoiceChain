export default function FeaturesPage() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
            <h1 className="text-4xl font-bold mb-6">Features</h1>
            <p className="text-xl text-gray-500">Explore the power of decentralized invoicing.</p>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-lg mb-2">Smart Escrow</h3>
                    <p className="text-gray-500">Automated funds release based on verifiable milestones.</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-lg mb-2">Instant Settlement</h3>
                    <p className="text-gray-500">Receive MNEE stablecoin immediately upon approval.</p>
                </div>
            </div>
        </div>
    );
}
