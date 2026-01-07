// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SmartEscrow is Ownable {
    IERC20 public mneeToken;

    enum EscrowStatus { PENDING, RELEASED, REFUNDED }

    struct Escrow {
        uint256 id;
        address buyer;
        address vendor;
        uint256 amount;
        EscrowStatus status;
        uint256 invoiceId;
    }

    mapping(uint256 => Escrow) public escrows;
    uint256 public nextEscrowId;

    event EscrowCreated(uint256 indexed escrowId, uint256 indexed invoiceId, address buyer, address vendor, uint256 amount);
    event FundsReleased(uint256 indexed escrowId, address indexed vendor, uint256 amount);
    event FundsRefunded(uint256 indexed escrowId, address indexed buyer, uint256 amount);

    constructor(address _mneeToken) Ownable(msg.sender) {
        mneeToken = IERC20(_mneeToken);
    }

    function createEscrow(uint256 _invoiceId, address _vendor, uint256 _amount) external returns (uint256) {
        // Funds must be approved and transferred before calling this
        require(mneeToken.transferFrom(msg.sender, address(this), _amount), "Transfer failed");

        uint256 escrowId = nextEscrowId++;
        escrows[escrowId] = Escrow({
            id: escrowId,
            buyer: msg.sender,
            vendor: _vendor,
            amount: _amount,
            status: EscrowStatus.PENDING,
            invoiceId: _invoiceId
        });

        emit EscrowCreated(escrowId, _invoiceId, msg.sender, _vendor, _amount);
        return escrowId;
    }

    // Only the invoice manager or authorized party should call this in a real system
    // For MVP, we allow the buyer to release (acknowledging receipt) or admin/arbitrator
    function releaseFunds(uint256 _escrowId) external {
        Escrow storage escrow = escrows[_escrowId];
        require(msg.sender == escrow.buyer || msg.sender == owner(), "Not authorized");
        require(escrow.status == EscrowStatus.PENDING, "Not pending");

        escrow.status = EscrowStatus.RELEASED;
        require(mneeToken.transfer(escrow.vendor, escrow.amount), "Transfer failed");

        emit FundsReleased(_escrowId, escrow.vendor, escrow.amount);
    }

    function refundFunds(uint256 _escrowId) external onlyOwner {
        Escrow storage escrow = escrows[_escrowId];
        require(escrow.status == EscrowStatus.PENDING, "Not pending");

        escrow.status = EscrowStatus.REFUNDED;
        require(mneeToken.transfer(escrow.buyer, escrow.amount), "Transfer failed");

        emit FundsRefunded(_escrowId, escrow.buyer, escrow.amount);
    }
}
