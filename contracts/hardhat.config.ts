import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
    solidity: "0.8.20",
    networks: {
        hardhat: {
        },
        sepolia: {
            url: "https://sepolia.example.com",
            accounts: []
        }
    }
};

export default config;
