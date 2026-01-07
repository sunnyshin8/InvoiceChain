import { ethers } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // 1. Deploy Mock MNEE
    const MNEE = await ethers.getContractFactory("MockMNEE");
    const mnee = await MNEE.deploy();
    await mnee.waitForDeployment();
    console.log("MockMNEE deployed to:", await mnee.getAddress());

    // 2. Deploy Escrow
    const SmartEscrow = await ethers.getContractFactory("SmartEscrow");
    const smartEscrow = await SmartEscrow.deploy(await mnee.getAddress());
    await smartEscrow.waitForDeployment();
    console.log("SmartEscrow deployed to:", await smartEscrow.getAddress());

    // 3. Deploy ApprovalWorkflow
    const ApprovalWorkflow = await ethers.getContractFactory("ApprovalWorkflow");
    const approvalWorkflow = await ApprovalWorkflow.deploy();
    await approvalWorkflow.waitForDeployment();
    console.log("ApprovalWorkflow deployed to:", await approvalWorkflow.getAddress());

    // 4. Deploy TreasuryManager
    const TreasuryManager = await ethers.getContractFactory("TreasuryManager");
    const treasuryManager = await TreasuryManager.deploy();
    await treasuryManager.waitForDeployment();
    console.log("TreasuryManager deployed to:", await treasuryManager.getAddress());

    // 5. Deploy InvoiceManager
    const InvoiceManager = await ethers.getContractFactory("InvoiceManager");
    const invoiceManager = await InvoiceManager.deploy(
        await smartEscrow.getAddress(),
        await approvalWorkflow.getAddress(),
        await treasuryManager.getAddress()
    );
    await invoiceManager.waitForDeployment();
    console.log("InvoiceManager deployed to:", await invoiceManager.getAddress());
    const addresses = {
        mnee: await mnee.getAddress(),
        smartEscrow: await smartEscrow.getAddress(),
        approvalWorkflow: await approvalWorkflow.getAddress(),
        treasuryManager: await treasuryManager.getAddress(),
        invoiceManager: await invoiceManager.getAddress(),
    };

    console.log("Addresses:", addresses);

    const fs = require("fs");
    fs.writeFileSync("../frontend/app/network-map.json", JSON.stringify(addresses, null, 2));
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
