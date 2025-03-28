require("@nomicfoundation/hardhat-toolbox");
require('@openzeppelin/hardhat-upgrades');
require("dotenv").config();

module.exports = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: { 
        enabled: true, 
        runs: 200 
      },
      viaIR: true 
    }
  },
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 11155111
    },
    // mainnet: {
    //   url: process.env.MAINNET_RPC_URL,
    //   accounts: [process.env.PRIVATE_KEY],
    //   chainId: 1
    // }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};