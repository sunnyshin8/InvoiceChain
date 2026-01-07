import "./SmartEscrow.sol";
import "./ApprovalWorkflow.sol";
import "./TreasuryManager.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract InvoiceManager {
    SmartEscrow public escrowContract;

    enum InvoiceStatus { PENDING, APPROVED, REJECTED, PAID, CANCELLED }

    struct Invoice {
        uint256 id;
        address vendor;
        address buyer;
        uint256 amount;
        string metadataHash; // IPFS hash for details
        uint256 dueDate;
        InvoiceStatus status;
        uint256 escrowId;
    }

    mapping(uint256 => Invoice) public invoices;
    uint256 public nextInvoiceId;

    event InvoiceCreated(uint256 indexed id, address indexed vendor, address indexed buyer, uint256 amount);
    event InvoiceApproved(uint256 indexed id);
    event InvoicePaid(uint256 indexed id, uint256 escrowId);

    ApprovalWorkflow public approvalWorkflow;
    TreasuryManager public treasuryManager;

    constructor(address _escrowContract, address _approvalWorkflow, address _treasuryManager) {
        escrowContract = SmartEscrow(_escrowContract);
        approvalWorkflow = ApprovalWorkflow(_approvalWorkflow);
        treasuryManager = TreasuryManager(_treasuryManager);
    }

    function createInvoice(address _buyer, uint256 _amount, string memory _metadataHash, uint256 _dueDate) external {
        uint256 id = nextInvoiceId++;
        invoices[id] = Invoice({
            id: id,
            vendor: msg.sender,
            buyer: _buyer,
            amount: _amount,
            metadataHash: _metadataHash,
            dueDate: _dueDate,
            status: InvoiceStatus.PENDING,
            escrowId: 0
        });

        emit InvoiceCreated(id, msg.sender, _buyer, _amount);
    }

    function approveInvoice(uint256 _id) external {
        Invoice storage invoice = invoices[_id];
        // In a real system, we'd check if msg.sender is an authorized approver for the buyer organization.
        // For hackathon, we assume any address can be an approver (or restrict to buyer address for MVP simple flow, 
        // but 'ApprovalWorkflow' implies multiple people.
        // Let's allow msg.sender to approve if they are associated with the buyer (simplified: anyone for demo or check against a list).
        // For MVP: We keep "Only buyer" check BUT we treat "Buyer" as the organization. 
        // To demonstrate multi-sig, we might need multiple calls from different addresses?
        // Or simplified: Just call registerApproval.
        
        require(invoice.status == InvoiceStatus.PENDING, "Not pending");

        // allow anyone to approve for now to demonstrate multi-user, 
        // OR restrict to invoice.buyer if it's a single wallet simulation.
        // Let's remove "Only buyer" restriction strictly for the multi-approval demo flow if intended, 
        // but for safety let's say "approver must be authorized".
        // For this hackathon: Assume msg.sender is authorized.
        
        bool isComplete = approvalWorkflow.registerApproval(_id, invoice.amount, msg.sender);
        
        if (isComplete) {
            invoice.status = InvoiceStatus.APPROVED;
            emit InvoiceApproved(_id);
        }
    }

    // Buyer pays the invoice -> Funds go to Escrow
    // This requires the buyer to have approved the Escrow contract to spend their MNEE
    function payInvoice(uint256 _id) external {
        Invoice storage invoice = invoices[_id];
        require(msg.sender == invoice.buyer, "Only buyer can pay");
        require(invoice.status == InvoiceStatus.APPROVED, "Must be approved first");

        // Logic Fix: Pull tokens from Buyer to This Contract, then Approve Escrow, then Create Escrow
        IERC20 token = escrowContract.mneeToken();
        
        // 1. Pull from Buyer (Buyer must Approve InvoiceManager)
        require(token.transferFrom(msg.sender, address(this), invoice.amount), "Transfer from Buyer failed");

        // 2. Approve Escrow to spend
        require(token.approve(address(escrowContract), invoice.amount), "Approve Escrow failed");

        // 3. Call Escrow to lock funds (Escrow pulls from This Contract)
        uint256 escrowId = escrowContract.createEscrow(invoice.id, invoice.vendor, invoice.amount);
        
        invoice.status = InvoiceStatus.PAID; // Fully paid into escrow
        invoice.escrowId = escrowId;

        // Track stats
        treasuryManager.recordPayment(invoice.vendor, invoice.amount);

        emit InvoicePaid(_id, escrowId);
    }

    function getInvoicesByVendor(address _vendor) external view returns (uint256[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < nextInvoiceId; i++) {
            if (invoices[i].vendor == _vendor) count++;
        }
        uint256[] memory ids = new uint256[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < nextInvoiceId; i++) {
            if (invoices[i].vendor == _vendor) {
                ids[index] = invoices[i].id;
                index++;
            }
        }
        return ids;
    }

    function getInvoicesByBuyer(address _buyer) external view returns (uint256[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < nextInvoiceId; i++) {
            if (invoices[i].buyer == _buyer) count++;
        }
        uint256[] memory ids = new uint256[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < nextInvoiceId; i++) {
            if (invoices[i].buyer == _buyer) {
                ids[index] = invoices[i].id;
                index++;
            }
        }
        return ids;
    }
}
