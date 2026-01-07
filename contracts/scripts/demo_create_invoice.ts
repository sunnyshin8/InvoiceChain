import { ethers } from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
    const [vendor, buyer] = await ethers.getSigners();
    const networkMapPath = path.resolve(__dirname, "../frontend/app/network-map.json");
    const networkMap = JSON.parse(fs.readFileSync(networkMapPath, "utf8"));

    console.log("Creating invoice...");
    console.log("Vendor (Sender):", vendor.address);
    console.log("Buyer (Recipient):", buyer.address);

    const InvoiceManager = await ethers.getContractAt("InvoiceManager", networkMap.invoiceManager);

    const amount = ethers.parseEther("150"); // Matches the video demo amount
    const dueDate = Math.floor(Date.now() / 1000) + 86400 * 7; // 7 days

    const tx = await InvoiceManager.connect(vendor).createInvoice(
        buyer.address,
        amount,
        "ipfs://demo-video-match",
        dueDate
    );
    await tx.wait();

    console.log("SUCCESS: Real Invoice created on local blockchain.");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
