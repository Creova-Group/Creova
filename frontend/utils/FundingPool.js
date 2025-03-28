import { ethers } from "ethers";
import FundingPoolABI from "./FundingPoolABI.json"; 

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_FUNDINGPOOL_ADDRESS;


export function getFundingPoolContract(providerOrSigner) {
    return new ethers.Contract(CONTRACT_ADDRESS, FundingPoolABI, provider);
}

// ✅ Function: Fetch Total Campaigns Count
export async function getTotalCampaigns(provider) {
    try {
        const contract = getFundingPoolContract(provider);
        const campaignCount = await contract.campaignIds();
        return Number(campaignCount);
    } catch (error) {
        console.error("Error fetching total campaigns:", error);
        return 0;
    }
}

// ✅ Function: Fetch Campaign Details by ID
export async function getCampaignDetails(provider, campaignId) {
    try {
        const contract = getFundingPoolContract(provider);
        const campaign = await contract.campaigns(campaignId);

        return {
            id: campaignId,
            name: campaign.name,
            creator: campaign.creator,
            fundingGoal: ethers.formatEther(campaign.fundingGoal),
            amountRaised: ethers.formatEther(campaign.amountRaised),
            status: ["Pending", "Approved", "Rejected"][campaign.status],
            fundingType: campaign.fundingType.toString() === "0" ? "Crowdfunding" : "Treasury Grant",
            milestones: campaign.milestones.map((m) => ({
                description: m.description,
                completed: m.completed,
                amount: ethers.formatEther(m.amount),
            })),
            projectCID: campaign.projectCID,
            heroMediaCID: campaign.heroMediaCID,
        };
    } catch (error) {
        console.error("Error fetching campaign details:", error);
        return null;
    }
}

// ✅ Function: Get DAO Treasury Balance
export async function getDaoTreasuryBalance(provider) {
    try {
        const contract = getFundingPoolContract(provider);
        const daoTreasuryAddress = await contract.daoTreasury();
        const balanceWei = await provider.getBalance(daoTreasuryAddress);
        return ethers.formatEther(balanceWei);
    } catch (error) {
        console.error("Error fetching DAO Treasury balance:", error);
        return null;
    }
}

// ✅ Function: Get Available Treasury Funds
export async function getAvailableTreasuryFunds(provider) {
    try {
        const contract = getFundingPoolContract(provider);
        const availableFundsWei = await contract.getAvailableTreasuryFunds();
        return ethers.formatEther(availableFundsWei);
    } catch (error) {
        console.error("Error fetching available treasury funds:", error);
        return null;
    }
}

// ✅ Function: Fund a Project
export async function fundProject(signer, campaignId, amountInEth) {
    try {
        const contract = getFundingPoolContract(signer);
        const amountWei = ethers.parseEther(amountInEth.toString());

        const tx = await contract.fundProject(campaignId, { value: amountWei });
        await tx.wait();
        return true;
    } catch (error) {
        console.error("Error funding project:", error);
        return false;
    }
}

// ✅ Function: Approve a Campaign
export async function approveCampaign(signer, campaignId) {
    try {
        const contract = getFundingPoolContract(signer);
        const tx = await contract.voteCampaign(campaignId);
        await tx.wait();
        return true;
    } catch (error) {
        console.error("Error approving campaign:", error);
        return false;
    }
}

// ✅ Function: Approve a Milestone
export async function approveMilestone(signer, campaignId, milestoneId) {
    try {
        const contract = getFundingPoolContract(signer);
        const tx = await contract.approveMilestone(campaignId, milestoneId);
        await tx.wait();
        return true;
    } catch (error) {
        console.error("Error approving milestone:", error);
        return false;
    }
}

// ✅ Function: Withdraw Funds for a Milestone from Treasury
export async function withdrawMilestoneFunds(signer, campaignId, milestoneId) {
    try {
        const contract = getFundingPoolContract(signer);
        const tx = await contract.withdrawMilestoneFunds(campaignId, milestoneId);
        await tx.wait();
        return true;
    } catch (error) {
        console.error("Error withdrawing milestone funds:", error);
        return false;
    }
}

// ✅ Function: Owner Withdraw Funds
export async function ownerWithdraw(signer, amountInEth) {
    try {
        const contract = getFundingPoolContract(signer);
        const amountWei = ethers.parseEther(amountInEth.toString());
        const tx = await contract.ownerWithdraw(amountWei);
        await tx.wait();
        return true;
    } catch (error) {
        console.error("Error withdrawing owner funds:", error);
        return false;
    }
}
