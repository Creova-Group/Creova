import { ethers } from "ethers";

export const getRpcProvider = () => {
  const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL;

  if (!rpcUrl) {
    console.error("❌ NEXT_PUBLIC_RPC_URL is undefined (fallback in use)");
  }

  return new ethers.JsonRpcProvider(
    rpcUrl || "https://eth-sepolia.g.alchemy.com/v2/HUkuEALHIqK__AvpuyMr0bs5Ijx3pMPM"
  );
};