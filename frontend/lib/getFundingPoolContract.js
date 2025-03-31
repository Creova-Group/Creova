import { ethers } from "ethers";
import FundingPoolABI from "../utils/FundingPoolABI.json";

// ✅ Pull from env
export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_FUNDINGPOOL_ADDRESS;
console.log("🧪 ENV VALUE:", process.env.NEXT_PUBLIC_FUNDINGPOOL_ADDRESS);

export const getFundingPoolContract = (providerOrSigner) => {
  if (!providerOrSigner) {
    console.error("❌ getFundingPoolContract received undefined providerOrSigner");
  } else {
    console.log("✅ getFundingPoolContract received:", providerOrSigner);
    console.log("✅ Using contract address:", CONTRACT_ADDRESS);
  }

  return new ethers.Contract(CONTRACT_ADDRESS, FundingPoolABI.abi, providerOrSigner);
};