const fs = require("fs");
const path = require("path");
const hre = require("hardhat");
const { ethers, upgrades } = hre; // Import upgrades from Hardhat

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("🚀 Deploying upgradable contracts with the account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "ETH");

  // DAO Treasury Address
  const daoTreasuryAddress = "0xc225947942dB485c107dEDD6E476eE69ECA9Df4a";

  // Get Contract Factory
  const FundingPool = await ethers.getContractFactory("FundingPool");

  // Get Current Nonce
  const nonce = await ethers.provider.getTransactionCount(deployer.address, "latest");
  console.log("🔢 Using nonce:", nonce);

  // Deploy Proxy and Implementation with Initialization
  console.log("⚡ Deploying FundingPool as an upgradable contract...");
  const fundingPoolProxy = await upgrades.deployProxy(
    FundingPool,
    [daoTreasuryAddress], // Arguments for the initialize function
    {
      initializer: "initialize",
      gasLimit: 4000000,
      gasPrice: ethers.parseUnits("30", "gwei"),
      nonce: nonce,
    }
  );

  await fundingPoolProxy.waitForDeployment();
  const contractAddress = await fundingPoolProxy.getAddress();
  console.log("✅ FundingPool Proxy deployed at:", contractAddress);

  // Get Implementation Address (for reference)
  const implementationAddress = await upgrades.erc1967.getImplementationAddress(contractAddress);
  console.log("ℹ️ Implementation deployed at:", implementationAddress);

  // Set AI Oracle Address (Replace with actual deployed AI Oracle address)
  const aiOracleAddress = "0xYourAIOracleAddressHere"; // Change this
  if (aiOracleAddress !== "0xYourAIOracleAddressHere") {
    console.log("⚡ Setting AI Oracle address...");
    const fundingPool = FundingPool.attach(contractAddress); // Attach to proxy
    const tx = await fundingPool.setAIOracle(aiOracleAddress);
    await tx.wait();
    console.log("✅ AI Oracle address set successfully!");
  } else {
    console.log("⚠️ AI Oracle address not set. Please update '0xYourAIOracleAddressHere' with a real address.");
  }

  // Save Constructor Arguments for Verification (for initialize function)
  const args = `module.exports = [ "${daoTreasuryAddress}" ];`;
  fs.writeFileSync("constructorArgs.js", args);
  console.log("📂 Constructor arguments saved to constructorArgs.js");

  // Update .env.local in Frontend
  const envPath = path.join(__dirname, "../frontend/.env.local"); // Adjust if needed
  const envContent = `NEXT_PUBLIC_FUNDINGPOOL_ADDRESS=${contractAddress}\n`;
  fs.writeFileSync(envPath, envContent);
  console.log("📂 .env.local updated with new proxy address!");

  // Update getFundingPoolContract.js in Frontend
  const contractPath = path.join(__dirname, "../frontend/lib/getFundingPoolContract.js");
  const contractCode = `
  import { ethers } from "ethers";
  import FundingPoolABI from "../utils/FundingPoolABI.json";

  const CONTRACT_ADDRESS = "${contractAddress}";

  export const getFundingPoolContract = (providerOrSigner) => {
  return new ethers.Contract(CONTRACT_ADDRESS, FundingPoolABI, providerOrSigner);
  };
  `;
  fs.writeFileSync(contractPath, contractCode);
  console.log("📂 getFundingPoolContract.js updated with verified ABI and proxy address!");

  // Copy ABI to Frontend
  const abiSource = path.join(__dirname, "../artifacts/contracts/FundingPool.sol/FundingPool.json");
  const abiDestination = path.join(__dirname, "../frontend/utils/FundingPoolABI.json");

  if (fs.existsSync(abiSource)) {
    fs.copyFileSync(abiSource, abiDestination);
    console.log("📂 ABI copied to frontend/utils/FundingPoolABI.json!");
  } else {
    console.error("❌ ABI source file not found at:", abiSource);
    console.log("ℹ️ Please run 'npx hardhat compile' to generate the ABI.");
  }

  console.log("🚀 Upgradable deployment complete! Use the proxy address to interact and verify.");
  console.log("ℹ️ Note: Use the proxy address", contractAddress, "for all interactions.");
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exit(1);
});