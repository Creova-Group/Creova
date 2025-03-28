import { ethers } from "ethers";
import FundingPoolABI from "../utils/FundingPoolABI.json";

export const CONTRACT_ADDRESS = "0x8e857937E1Fe63bf5fe709413B4521F2F4261533";

export const getFundingPoolContract = (providerOrSigner) => {
  if (!providerOrSigner) {
    console.error("❌ getFundingPoolContract received undefined providerOrSigner");
  } else {
    console.log("✅ getFundingPoolContract received:", providerOrSigner);
  }

  return new ethers.Contract(CONTRACT_ADDRESS, FundingPoolABI.abi, providerOrSigner);
};