import { useState } from "react";
import { ethers } from "ethers";
import { Button, Spinner, useToast } from "@chakra-ui/react";
import { getFundingPoolContract } from "../lib/getFundingPoolContract";
import { useAccount } from "wagmi";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_FUNDINGPOOL_ADDRESS; // ✅ Correct

export default function WithdrawFunds({ campaignId }) {
    const { isConnected } = useAccount();
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const handleWithdraw = async () => {
        if (!window.ethereum || !isConnected) {
            toast({
                title: "Wallet not connected",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            return;
        }

        setLoading(true);

        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = getFundingPoolContract(signer, CONTRACT_ADDRESS);

            const tx = await contract.withdrawFunds(campaignId);
            await tx.wait();

            toast({
                title: "Withdrawal Successful",
                description: "Funds have been transferred to your wallet.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            console.error("Withdrawal error:", error);
            toast({
                title: "Withdrawal Failed",
                description: error.reason || "An error occurred during withdrawal.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button mt={4} size="sm" colorScheme="green" onClick={handleWithdraw} isDisabled={loading}>
            {loading ? <Spinner size="sm" /> : "Withdraw Funds"}
        </Button>
    );
}