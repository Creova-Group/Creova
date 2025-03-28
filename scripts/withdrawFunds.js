const { ethers } = require("ethers");
require("dotenv").config();

async function main() {
  // Load environment variables
  const rpcUrl = process.env.SEPOLIA_RPC_URL;
  const privateKey = process.env.PRIVATE_KEY;

  // Validate environment variables
  if (!rpcUrl || !privateKey) {
    throw new Error("Please set SEPOLIA_RPC_URL and PRIVATE_KEY in your .env file");
  }

  // Set up provider
  const provider = new ethers.JsonRpcProvider(rpcUrl, { chainId: 11155111, name: "sepolia" });
  const wallet = new ethers.Wallet(privateKey, provider);

  // ✅ Use the contract address directly (Fixed Issue)
  const contractAddress = "0x73a2119C444bfA18DF7ECDC23E9cA0391Ce0da20"; // Make sure this is the correct deployed contract

  // ✅ ABI with ownerWithdraw function
  const contractAbi = [
    "function ownerWithdraw(uint256 _amount) external",
    "function balanceOf(address) view returns (uint256)"
  ];

  // Connect to the contract
  const contract = new ethers.Contract(contractAddress, contractAbi, wallet);

  // ✅ Check the contract balance
  const contractBalance = await provider.getBalance(contractAddress);
  console.log(`🔹 Contract Balance: ${ethers.formatEther(contractBalance)} ETH`);

  if (contractBalance <= 0) {
    console.log("⚠️ No funds available to withdraw!");
    return;
  }

  // ✅ Withdraw full balance
  const amountToWithdraw = contractBalance;
  console.log(`🔹 Withdrawing ${ethers.formatEther(amountToWithdraw)} ETH...`);

  const tx = await contract.ownerWithdraw(amountToWithdraw);
  await tx.wait();

  console.log(`✅ Successfully withdrew ${ethers.formatEther(amountToWithdraw)} ETH!`);
  console.log(`🔗 Transaction Hash: ${tx.hash}`);

  // ✅ Verify new balance
  const newBalance = await provider.getBalance(contractAddress);
  console.log(`🔹 New Contract Balance: ${ethers.formatEther(newBalance)} ETH`);
}

// Execute the script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });