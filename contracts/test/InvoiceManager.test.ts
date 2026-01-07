
import { time, loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("InvoiceChain Pro", function () {
    async function deployFixture() {
        const [owner, buyer, vendor, otherAccount] = await ethers.getSigners();

        // Deploy Mock MNEE
        const MNEE = await ethers.getContractFactory("MockMNEE");
        const mnee = await MNEE.deploy();

        // Deploy Escrow
        const SmartEscrow = await ethers.getContractFactory("SmartEscrow");
        const smartEscrow = await SmartEscrow.deploy(await mnee.getAddress());

        // Deploy ApprovalWorkflow
        const ApprovalWorkflow = await ethers.getContractFactory("ApprovalWorkflow");
        const approvalWorkflow = await ApprovalWorkflow.deploy();

        // Deploy TreasuryManager
        const TreasuryManager = await ethers.getContractFactory("TreasuryManager");
        const treasuryManager = await TreasuryManager.deploy();

        // Deploy InvoiceManager
        const InvoiceManager = await ethers.getContractFactory("InvoiceManager");
        const invoiceManager = await InvoiceManager.deploy(
            await smartEscrow.getAddress(),
            await approvalWorkflow.getAddress(),
            await treasuryManager.getAddress()
        );

        // Transfer ownership of Escrow to InvoiceManager? 
        // Wait, SmartEscrow is Ownable. InvoiceManager needs to call createEscrow.
        // In SmartEscrow.sol: "require(mneeToken.transferFrom(msg.sender...))".
        // InvoiceManager calls createEscrow. 
        // And InvoiceManager calls this inside payInvoice(buyer calls this).
        // So msg.sender in createEscrow will be InvoiceManager?
        // No. InvoiceManager calls `escrowContract.createEscrow`. 
        // Inside SmartEscrow.createEscrow: `msg.sender` involves the immediate caller.
        // If InvoiceManager calls it, msg.sender is InvoiceManager.
        // So InvoiceManager must hold the tokens?
        // Correct Flow: 
        // Buyer approves InvoiceManager or Escrow?
        // If Buyer calls InvoiceManager.payInvoice -> InvoiceManager calls Escrow.createEscrow.
        // Escrow tries transferFrom(msg.sender, ...). msg.sender is InvoiceManager.
        // So InvoiceManager needs to pull tokens from Buyer first?
        // OR: InvoiceManager just forwards the call?
        // Let's check logic:
        // InvoiceManager.payInvoice:
        // `escrowContract.createEscrow(...)`
        // Inside SmartEscrow: `mneeToken.transferFrom(msg.sender, address(this), _amount)`
        // Here msg.sender is InvoiceManager.
        // InvoiceManager doesn't have the tokens. Buyer has them.
        // FIX:
        // Option A: Buyer approves Escrow. Buyer calls Escrow directly? No, we want InvoiceManager to track status.
        // Option B: InvoiceManager pulls from Buyer, then approves Escrow, then calls Escrow.
        //    - Requires InvoiceManager to have transferFrom logic.
        //    - Buyer approves InvoiceManager.
        //    - InvoiceManager: `mnee.transferFrom(buyer, address(this))` -> `mnee.approve(escrow)` -> `escrow.createEscrow`.
        // Option C: Use `tx.origin`? (Bad practice).

        // I will use Option B (Standard pattern).
        // I need to update InvoiceManager to pull tokens.

        // Mint tokens to Buyer
        await mnee.mint(buyer.address, ethers.parseEther("10000"));

        return { mnee, smartEscrow, approvalWorkflow, treasuryManager, invoiceManager, owner, buyer, vendor };
    }

    describe("Deployment", function () {
        it("Should deploy all contracts", async function () {
            const { invoiceManager } = await loadFixture(deployFixture);
            expect(await invoiceManager.getAddress()).to.be.properAddress;
        });
    });

    // Note: I identified a bug in the thought process above regarding transferFrom.
    // The current contracts likely have this bug. 
    // InvoiceManager calls createEscrow. createEscrow calls transferFrom(msg.sender...).
    // msg.sender is InvoiceManager.
    // I need to fix InvoiceManager.sol to pull tokens from Buyer (msg.sender of payInvoice).
});
