
  import { ethers } from "ethers";
  import FundingPoolABI from "../utils/FundingPoolABI.json";

  export const CONTRACT_ADDRESS = "0xFBf21D3c9Ee2c0ed00E243E1260eC77fdD17DA02";

  export const getFundingPoolContract = (providerOrSigner) => {
    if (!providerOrSigner) {
      console.error("❌ getFundingPoolContract received undefined providerOrSigner");
    } else {
      console.log("✅ getFundingPoolContract received:", providerOrSigner);
    }

    return new ethers.Contract(CONTRACT_ADDRESS, FundingPoolABI.abi, providerOrSigner);
  };
  