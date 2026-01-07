export const INVOICE_MANAGER_ADDRESS = "0x3Aa5ebB10DC797CAC828524e59A333d0A371443c";
export const MNEE_TOKEN_ADDRESS = "0x0B306BF915C4d645ff596e518fAf3F9669b97016"; // Localhost MNEE for Dev
// export const MNEE_TOKEN_ADDRESS = "0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF"; // Official Hackathon Contract (Mainnet)
export const ESCROW_ADDRESS = "0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1";

export const INVOICE_MANAGER_ABI = [
    "function createInvoice(address _buyer, uint256 _amount, string memory _metadataHash, uint256 _dueDate) external",
    "function approveInvoice(uint256 _id) external",
    "function payInvoice(uint256 _id) external",
    "function getInvoicesByVendor(address _vendor) external view returns (uint256[])",
    "function getInvoicesByBuyer(address _buyer) external view returns (uint256[])",
    "function invoices(uint256) view returns (uint256 id, address vendor, address buyer, uint256 amount, string memory metadataHash, uint256 dueDate, uint8 status, uint256 escrowId)",
    "function nextInvoiceId() view returns (uint256)",
    "event InvoiceCreated(uint256 indexed id, address indexed vendor, address indexed buyer, uint256 amount)",
    "event InvoiceApproved(uint256 indexed id)",
    "event InvoicePaid(uint256 indexed id, uint256 escrowId)"
];

export const MNEE_ABI = [
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function allowance(address owner, address spender) external view returns (uint256)",
    "function balanceOf(address account) external view returns (uint256)",
    "function mint(address to, uint256 amount) external"
];

export const SMART_ESCROW_ABI = [
    "function releaseFunds(uint256 _escrowId) external"
];
