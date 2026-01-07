'use client';

import { useConnect } from 'wagmi';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle,
  Shield,
  Zap,
  Globe,
  Code,
  FileText,
  LayoutDashboard,
  TrendingUp,
  Users,
  Building2
} from 'lucide-react';

export default function Home() {
  const { connect } = useConnect();

  return (
    <main className="font-sans text-gray-900">
      {/* Hero Section - Full Height */}
      <section className="relative min-h-screen flex flex-col justify-start pt-32 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-indigo-50/80 via-white to-white -z-10"></div>

        {/* Animated Background Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-20 right-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 font-medium text-xs mb-4 animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Live on MNEE Mainnet
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 tracking-tight text-gray-900 leading-tight">
            The Future of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 animate-gradient-x">
              B2B Payments
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-500 max-w-3xl mx-auto mb-8 leading-relaxed font-light">
            Programmable invoicing, smart escrow, and instant stablecoin settlement.
            Streamline your entire treasury with decentralized automation.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/dashboard" className="group bg-black text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 transform hover:-translate-y-1">
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/dashboard" className="bg-white text-gray-900 border border-gray-200 px-8 py-4 rounded-full text-lg font-bold hover:bg-gray-50 transition-all duration-300 transform hover:-translate-y-1 shadow-sm hover:shadow-md">
              Launch App
            </Link>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-gray-400">
            <p className="text-xs uppercase tracking-widest mb-2">Scroll to explore</p>
            <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center p-1 mx-auto">
              <div className="w-1 h-3 bg-gray-400 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-gray-100">
            <div className="p-4">
              <div className="text-4xl font-bold text-gray-900 mb-2">$500M+</div>
              <div className="text-sm text-gray-500 uppercase tracking-wider">Processed Volume</div>
            </div>
            <div className="p-4">
              <div className="text-4xl font-bold text-gray-900 mb-2">12k+</div>
              <div className="text-sm text-gray-500 uppercase tracking-wider">Active Businesses</div>
            </div>
            <div className="p-4">
              <div className="text-4xl font-bold text-gray-900 mb-2">0.1s</div>
              <div className="text-sm text-gray-500 uppercase tracking-wider">Settlement Time</div>
            </div>
            <div className="p-4">
              <div className="text-4xl font-bold text-gray-900 mb-2">24/7</div>
              <div className="text-sm text-gray-500 uppercase tracking-wider">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-base font-bold text-indigo-600 tracking-wide uppercase mb-3">Core Capabilities</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Everything you need to scale</h3>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Replace fragmented payment tools with one robust blockchain-powered platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Feature 1 */}
            <div className="group p-8 rounded-3xl bg-gray-50 hover:bg-white border border-gray-100 hover:border-indigo-100 hover:shadow-2xl transition-all duration-500">
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 mb-8 transform group-hover:scale-110 transition-transform duration-500">
                <Shield className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Smart Escrow</h3>
              <p className="text-gray-500 leading-relaxed mb-6">
                Funds are programmatically locked in audited smart contracts. Payment is only released when you verify the deliverables—zero risk for both parties.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" /> Milestone-based releases
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" /> Dispute resolution logic
                </li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-3xl bg-gray-50 hover:bg-white border border-gray-100 hover:border-indigo-100 hover:shadow-2xl transition-all duration-500">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-8 transform group-hover:scale-110 transition-transform duration-500">
                <Zap className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Instant Settlement</h3>
              <p className="text-gray-500 leading-relaxed mb-6">
                Powered by MNEE stablecoin infrastructure. Cross-border transfers happen in seconds, 24/7, with complete transparency and near-zero fees.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="w-5 h-5 text-blue-500 mr-3" /> No banking hours
                </li>
                <CheckCircle className="w-5 h-5 text-blue-500 mr-3" /> &lt; $0.01 transaction fees
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-3xl bg-gray-50 hover:bg-white border border-gray-100 hover:border-indigo-100 hover:shadow-2xl transition-all duration-500">
              <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mb-8 transform group-hover:scale-110 transition-transform duration-500">
                <LayoutDashboard className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Treasury Analytics</h3>
              <p className="text-gray-500 leading-relaxed mb-6">
                Real-time financial command center. Track your spending burn rate, incoming revenue, and active escrows in one unified, export-ready view.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="w-5 h-5 text-purple-500 mr-3" /> Crypto & Fiat valuation
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="w-5 h-5 text-purple-500 mr-3" /> One-click tax reports
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-32 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-indigo-900/20 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-base font-bold text-indigo-400 tracking-wide uppercase mb-3">Workflow</h2>
            <h3 className="text-4xl md:text-5xl font-bold mb-6">How InvoiceChain works</h3>
          </div>

          <div className="relative">
            {/* Connector Line */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-indigo-900 -translate-y-1/2 z-0"></div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { number: '01', title: 'Connect', desc: 'Link your wallet or create a multi-sig account.' },
                { number: '02', title: 'Create', desc: 'Generate a compliant invoice with attached deliverables.' },
                { number: '03', title: 'Deposit', desc: 'Client deposits MNEE into the secure smart contract.' },
                { number: '04', title: 'Release', desc: 'Funds release automatically upon approved delivery.' },
              ].map((step, idx) => (
                <div key={idx} className="relative z-10 bg-gray-900 p-6 rounded-xl border border-gray-800 text-center hover:border-indigo-500 transition-colors duration-300">
                  <div className="w-16 h-16 rounded-full bg-indigo-600 text-white font-bold text-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-900/50">
                    {step.number}
                  </div>
                  <h4 className="text-xl font-bold mb-3">{step.title}</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <div className="md:w-1/2">
              <h2 className="text-base font-bold text-indigo-600 tracking-wide uppercase mb-3">Enterprise Grade</h2>
              <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">Built for the modern financial stack</h3>

              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="shrink-0 w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-indigo-600">
                    <Code className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Programmable API</h4>
                    <p className="text-gray-500 leading-relaxed">
                      Integrate with SAP, Oracle, or Xero. Trigger invoices and payments programmatically using our REST and GraphQL APIs.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="shrink-0 w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-indigo-600">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Automated Compliance</h4>
                    <p className="text-gray-500 leading-relaxed">
                      Smart contracts automatically handle TDS deduction and GST partitioning, ensuring 100% tax compliance in real-time.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="shrink-0 w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-indigo-600">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Team Permissions</h4>
                    <p className="text-gray-500 leading-relaxed">
                      Granular role-based access control (RBAC). Define who can create, approve, and settle invoices within your organization.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:w-1/2">
              <div className="relative rounded-2xl bg-white p-8 shadow-2xl border border-gray-100">
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-green-100 rounded-full opacity-50 blur-2xl"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-indigo-100 rounded-full opacity-50 blur-2xl"></div>

                {/* Mock UI Card */}
                <div className="space-y-6 relative z-10">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div className="font-bold text-lg">Active Escrows</div>
                    <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">Live</div>
                  </div>

                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                          #{300 + i}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">Vendor Node {i}</div>
                          <div className="text-xs text-gray-500">Service Delivery</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">12,500 MNEE</div>
                        <div className="text-xs text-orange-500">Pending Approval</div>
                      </div>
                    </div>
                  ))}

                  <button className="w-full py-3 bg-black text-white rounded-lg font-bold text-sm mt-4 hover:bg-gray-800 transition">View All Activity</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 bg-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-5xl font-extrabold text-gray-900 mb-8">Ready to modernize your financial stack?</h2>
          <p className="text-xl text-gray-500 mb-12 max-w-2xl mx-auto">
            Join 12,000+ businesses using InvoiceChain to process payments securely and instantly.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/dashboard" className="bg-indigo-600 text-white px-10 py-5 rounded-full text-xl font-bold hover:bg-indigo-700 transition shadow-xl flex items-center gap-2">
              Start Building Now <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
