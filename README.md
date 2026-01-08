# InvoiceChain Pro 🚀

**A Decentralized B2B Invoicing & Payment Platform on Ethereum**

InvoiceChain Pro solves the critical problem of slow, expensive, and manual invoice payments by enabling vendors to create invoices on-chain and buyers to pay instantly with MNEE tokens held in smart escrow.

---

## 🌟 Key Features

### Core Functionality
-   **On-Chain Invoicing**: Create immutable invoices with vendor, buyer, and due date details.
-   **Smart Escrow**: Funds are locked securely in audited smart contracts until delivery is confirmed.
-   **Instant Settlement**: Powered by MNEE stablecoin for <2s settlement times.
-   **Tax Compliance**: Automatic 1% TDS calculation and addition to total payable.

### User Experience
-   **Demo Mode**: Try the full platform without a wallet using the simulated "Try Demo" environment.
-   **PDF Export**: Download professional, tax-compliant PDF invoices instantly.
-   **Modern Dashboard**: Real-time analytics for revenue, pending payments, and active escrows.

---

## 🏗️ Tech Stack

| Component | Technologies |
|-----------|--------------|
| **Smart Contracts** | Solidity, Hardhat, OpenZeppelin |
| **Frontend** | Next.js 14, TypeScript, Tailwind CSS, Wagmi, Framer Motion |
| **Backend** | Node.js, Express, TypeScript |
| **Indexing** | The Graph (Planned) |

---

## 📂 Project Structure

```bash
MNEE/
├── backend/            # Express.js REST API for off-chain data & caching
├── contracts/          # Hardhat project with Solidity smart contracts
├── frontend/           # Next.js web application
└── README.md           # Project documentation
```

---

## 🚀 Setup Instructions

### Prerequisites
-   Node.js (v18+)
-   MetaMask Wallet

### 1. Installation
Clone the repo and install dependencies for all subsystems:

```bash
git clone <repo-url>
cd invoice-chain-pro

# Install Backend
cd backend && npm install

# Install Contracts
cd ../contracts && npm install

# Install Frontend
cd ../frontend && npm install
```

### 2. Smart Contracts
Compile and deploy to local network or testnet:

```bash
cd contracts
npx hardhat compile
# npx hardhat run scripts/deploy.ts --network localhost
```

### 3. Start Application
Run both servers concurrently (in separate terminals):

**Backend (Port 3001)**
```bash
cd backend
npm run dev
```

**Frontend (Port 3000)**
```bash
cd frontend
npm run dev
```

Visit `http://localhost:3000` to launch the app.

---

## 📜 Contract Addresses (Sepolia)
*Note: Ensure you are on the correct network.*

| Contract | Address |
|----------|---------|
| **MNEE Token** | `0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF` |
| **InvoiceManager** | *Deploy to see address* |
| **SmartEscrow** | *Deploy to see address* |

---
