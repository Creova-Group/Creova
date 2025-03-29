const fs = require("fs");
const path = require("path");
const hre = require("hardhat");
const { ethers, upgrades } = hre;

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("🚀 Deploying upgradable contracts with the account:", deployer.address);
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "ETH");

  const daoTreasuryAddress = "0xc225947942dB485c107dEDD6E476eE69ECA9Df4a";
  const FundingPool = await ethers.getContractFactory("FundingPool");

  const nonce = await ethers.provider.getTransactionCount(deployer.address, "latest");
  console.log("🔢 Using nonce:", nonce);

  const fundingPoolProxy = await upgrades.deployProxy(
    FundingPool,
    [daoTreasuryAddress],
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

  const implementationAddress = await upgrades.erc1967.getImplementationAddress(contractAddress);
  console.log("ℹ️ Implementation deployed at:", implementationAddress);

  // Optional: Set AI Oracle
  const aiOracleAddress = "0xYourAIOracleAddressHere"; // change this later
  if (aiOracleAddress !== "0xYourAIOracleAddressHere") {
    console.log("⚡ Setting AI Oracle address...");
    const fundingPool = FundingPool.attach(contractAddress);
    const tx = await fundingPool.setAIOracle(aiOracleAddress);
    await tx.wait();
    console.log("✅ AI Oracle address set successfully!");
  } else {
    console.log("⚠️ Skipping Oracle setup. Update address later if needed.");
  }

  const args = `module.exports = [ "${daoTreasuryAddress}" ];`;
  fs.writeFileSync("constructorArgs.js", args);
  console.log("📂 Constructor arguments saved to constructorArgs.js");

  // ✅ 🔁 CHANGED: Update root .env instead of frontend/.env.local
  const envPath = path.join(__dirname, "../.env");
  let env = fs.readFileSync(envPath, "utf8");
  env = env.replace(/^NEXT_PUBLIC_FUNDINGPOOL_ADDRESS=.*/m, `NEXT_PUBLIC_FUNDINGPOOL_ADDRESS=${contractAddress}`);
  fs.writeFileSync(envPath, env);
  console.log("📂 .env updated with proxy address");

  // ✅ Update frontend getFundingPoolContract.js
  const contractPath = path.join(__dirname, "../frontend/lib/getFundingPoolContract.js");
  const contractCode = `
  import { ethers } from "ethers";
  import FundingPoolABI from "../utils/FundingPoolABI.json";

  export const CONTRACT_ADDRESS = "${contractAddress}";

  export const getFundingPoolContract = (providerOrSigner) => {
    if (!providerOrSigner) {
      console.error("❌ getFundingPoolContract received undefined providerOrSigner");
    } else {
      console.log("✅ getFundingPoolContract received:", providerOrSigner);
    }

    return new ethers.Contract(CONTRACT_ADDRESS, FundingPoolABI.abi, providerOrSigner);
  };
  `;
  fs.writeFileSync(contractPath, contractCode);
  console.log("📂 getFundingPoolContract.js updated");

  // ✅ Copy ABI correctly
  const abiSource = path.join(__dirname, "../artifacts/contracts/FundingPool.sol/FundingPool.json");
  const abiDestination = path.join(__dirname, "../frontend/utils/FundingPoolABI.json");

  if (fs.existsSync(abiSource)) {
    const fullABI = JSON.parse(fs.readFileSync(abiSource));
    fs.writeFileSync(abiDestination, JSON.stringify({ abi: fullABI.abi }, null, 2));
    console.log("📂 ABI copied to frontend/utils/FundingPoolABI.json");
  } else {
    console.error("❌ ABI source not found. Run `npx hardhat compile` first.");
  }

  console.log("🚀 Upgradable deployment complete. Use the proxy address for all frontend and contract interactions.");
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exit(1);
});