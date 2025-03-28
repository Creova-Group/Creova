const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    const balance = await deployer.provider.getBalance(deployer.address);
    
    console.log("Deployer Address:", deployer.address);
    console.log("Balance:", ethers.formatEther(balance), "ETH");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});