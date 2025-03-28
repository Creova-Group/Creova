import { ethers } from 'ethers';

const contractAddress = 'YOUR0x790Cd030687Ca73Cb4D1E8661b1401b34DCdB684'; 
const abi = [
  // Replace with your FundingPool ABI
  "function balanceOf(address) public view returns (uint256)",
  "function deposit() public payable",
  "function withdraw(uint256 amount) public"
];

export const connectWallet = async () => {
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    await window.ethereum.request({ method: 'eth_requestAccounts' }); // Request wallet connection
    const address = await signer.getAddress();
    console.log("Connected Address: ", address);
    return signer;
  } else {
    alert('MetaMask not installed');
  }
};

export const getBalance = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contract = new ethers.Contract(contractAddress, abi, provider);
  const balance = await contract.balanceOf(await provider.getSigner().getAddress());
  console.log("Contract Balance: ", ethers.utils.formatEther(balance));
};

export const depositFunds = async (amount) => {
  const signer = await connectWallet();
  const contract = new ethers.Contract(contractAddress, abi, signer);
  const tx = await contract.deposit({ value: ethers.utils.parseEther(amount) });
  await tx.wait();
  console.log("Deposit Successful", tx);
};

export const withdrawFunds = async (amount) => {
  const signer = await connectWallet();
  const contract = new ethers.Contract(contractAddress, abi, signer);
  const tx = await contract.withdraw(ethers.utils.parseEther(amount));
  await tx.wait();
  console.log("Withdrawal Successful", tx);
};