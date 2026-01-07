// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ApprovalWorkflow is Ownable {
    
    struct ApprovalConfig {
        uint256 threshold;
        uint256 requiredApprovals;
    }

    struct ApprovalStatus {
        uint256 approvalCount;
        mapping(address => bool) hasApproved;
    }

    // Invoice ID -> ApprovalStatus
    mapping(uint256 => ApprovalStatus) public approvals;
    
    // Ordered list of thresholds. E.g. [0, 1000, 10000]
    ApprovalConfig[] public configs;

    event ApprovalReceived(uint256 indexed invoiceId, address approver, uint256 currentCount, uint256 required);
    event AppoveComplete(uint256 indexed invoiceId);

    constructor() Ownable(msg.sender) {
        // Default configs
        configs.push(ApprovalConfig(0, 0)); // < 1000: 0 approvals (Auto) - Logic handled in check
        configs.push(ApprovalConfig(1000 * 10**18, 1));
        configs.push(ApprovalConfig(10000 * 10**18, 2));
        configs.push(ApprovalConfig(100000 * 10**18, 3));
    }

    function getRequiredApprovals(uint256 amount) public view returns (uint256) {
        uint256 required = 0;
        // Iterate to find the highest matching threshold
        for (uint256 i = 0; i < configs.length; i++) {
            if (amount >= configs[i].threshold) {
                required = configs[i].requiredApprovals;
            } else {
                break;
            }
        }
        return required;
    }

    // Called by InvoiceManager
    function registerApproval(uint256 invoiceId, uint256 amount, address approver) external returns (bool) {
        uint256 required = getRequiredApprovals(amount);
        
        if (required == 0) return true; // Auto-approve

        ApprovalStatus storage status = approvals[invoiceId];
        require(!status.hasApproved[approver], "Already approved");
        
        status.hasApproved[approver] = true;
        status.approvalCount++;
        
        emit ApprovalReceived(invoiceId, approver, status.approvalCount, required);

        if (status.approvalCount >= required) {
            emit AppoveComplete(invoiceId);
            return true;
        }

        return false;
    }
}
