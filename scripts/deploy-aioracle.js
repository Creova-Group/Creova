const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("🚀 Deploying AI Oracle with account:", deployer.address);

    const AIOracle = await hre.ethers.getContractFactory("AIOracle");
    const aiOracle = await AIOracle.deploy();

    await aiOracle.waitForDeployment();
    const aiOracleAddress = await aiOracle.getAddress();

    console.log("✅ AI Oracle deployed at:", aiOracleAddress);
}

main().catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
});