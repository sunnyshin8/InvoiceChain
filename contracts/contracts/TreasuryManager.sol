// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract TreasuryManager is Ownable {
    uint256 public totalVolume;
    uint256 public totalInvoicesPaid;
    
    // Add more metrics as needed
    mapping(address => uint256) public vendorVolume;

    event VolumeTracked(address indexed vendor, uint256 amount);

    constructor() Ownable(msg.sender) {}

    function recordPayment(address vendor, uint256 amount) external {
        // In reality, restrict this to InvoiceManager or valid callers
        totalVolume += amount;
        totalInvoicesPaid++;
        vendorVolume[vendor] += amount;
        emit VolumeTracked(vendor, amount);
    }
}
