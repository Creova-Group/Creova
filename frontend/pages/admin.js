import { useEffect, useState, useRef } from "react";
import { ethers } from "ethers";
import {
  Box,
  Heading,
  Input,
  Button,
  VStack,
  Text,
  Flex,
  useToast,
  Badge,
  Spinner,
  SimpleGrid,
  Container,
  FormControl,
  FormLabel,
  Link as ChakraLink,
  Tooltip,
  HStack,
  Progress,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";
import { getFundingPoolContract } from "../lib/getFundingPoolContract";
import Footer from "../components/Footer";
import Link from "next/link";
import { FaEthereum, FaUsers, FaCoins, FaTrash } from "react-icons/fa";

const MotionBox = motion(Box);
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_FUNDINGPOOL_ADDRESS || "0x8e857937E1Fe63bf5fe709413B4521F2F4261533";
export default function AdminPage() {
  const { address, isConnected, isConnecting } = useAccount();
  const [campaigns, setCampaigns] = useState([]);
  const [newVoter, setNewVoter] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(""); // New state for loading message
  const [isVoter, setIsVoter] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [ownerAddress, setOwnerAddress] = useState(null);
  const [treasuryInfo, setTreasuryInfo] = useState({
    limit: "0",
    used: "0",
    fullBalance: "0",
    quarterStart: 0,
  });
  const [customMilestones, setCustomMilestones] = useState([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState(null);
  const toast = useToast();
  const cancelRef = useRef(); // For AlertDialog

  const loadContractData = async () => {
    if (!window.ethereum || !isConnected) return;

    setLoading(true);
    setLoadingMessage("Loading contract data...");
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = await getFundingPoolContract(signer);
      const contractOwner = await contract.owner();
      setOwnerAddress(contractOwner);
      setIsOwner(contractOwner.toLowerCase() === address.toLowerCase());

      const voterRole = await contract.VOTER_ROLE();
      setIsVoter(await contract.hasRole(voterRole, address));

      const limit = ethers.formatEther(await contract.quarterlyTreasuryLimit());
      const used = ethers.formatEther(await contract.quarterlyFundsUsed());
      const fullBalance = ethers.formatEther(await provider.getBalance(CONTRACT_ADDRESS));
      const quarterStart = Number(await contract.currentQuarterStart());
      setTreasuryInfo({ limit, used, fullBalance, quarterStart });

      const campaignCount = Number(await contract.campaignIds());
      const loadedCampaigns = [];

      for (let i = 1; i <= campaignCount; i++) {
        const campaign = await contract.campaigns(i);
        if (campaign.creator === ethers.ZeroAddress) continue; // Skip deleted campaigns
        const milestones = await contract.getCampaignMilestones(i);
        const contributors = await contract.getContributors(i);
        const supportersCount = contributors.length;

        loadedCampaigns.push({
          id: i,
          name: campaign.name,
          creator: campaign.creator,
          fundingGoal: ethers.formatEther(campaign.fundingGoal),
          amountRaised: ethers.formatEther(campaign.amountRaised),
          status: ["Pending", "Approved", "Rejected"][campaign.status],
          type: campaign.fundingType.toString() === "0" ? "Crowdfunding" : "Treasury Grant",
          deadline: Number(campaign.deadline),
          applicationExpiry: Number(campaign.applicationExpiry),
          projectCID: campaign.projectCID,
          heroMediaCID: campaign.heroMediaCID,
          description: campaign.description,
          createdAt: Number(campaign.createdAt),
          supportersCount,
          milestones: milestones.map((m, idx) => ({
            id: idx,
            description: m.description,
            amount: ethers.formatEther(m.amount),
            completed: m.completed,
            completedAt: m.completedAt > 0 ? new Date(Number(m.completedAt) * 1000).toLocaleString() : "",
            proofCID: m.proofCID,
            rejectedAt: m.rejectedAt > 0 ? new Date(Number(m.rejectedAt) * 1000).toLocaleString() : "",
            isPredefined: campaign.fundingType.toString() === "1" && idx < 3 && (m.description.includes("Proof of Concept") || m.description.includes("Beta/Prototype") || m.description.includes("Final Product")),
          })),
        });
      }

      setCampaigns(loadedCampaigns);
    } catch (error) {
      console.error("Error loading data:", error);
      toast({ title: "Error loading data", description: error.message, status: "error" });
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };

  const getTimeRemaining = (timestamp) => {
    const now = Math.floor(Date.now() / 1000);
    const diff = timestamp - now;
    if (diff <= 0) return "Expired";
    const days = Math.floor(diff / 86400);
    const hours = Math.floor((diff % 86400) / 3600);
    return `${days}d ${hours}h`;
  };

  const handleVoteCampaign = async (id) => {
    if (!isVoter) return;
    setLoading(true);
    setLoadingMessage("Waiting for wallet approval to approve campaign...");
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = getFundingPoolContract(signer);
      const tx = await contract.voteCampaign(id);
      setLoadingMessage("Confirming transaction on the blockchain...");
      await tx.wait();
      toast({ title: "Campaign approved!", status: "success" });
      setLoadingMessage("Refreshing campaign data...");
      await loadContractData();
    } catch (error) {
      toast({ title: "Error approving campaign", description: error.message, status: "error" });
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };

  const handleAutoReject = async (id) => {
    if (!isVoter) return;
    setLoading(true);
    setLoadingMessage("Waiting for wallet approval to reject campaign...");
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = getFundingPoolContract(signer);
      const tx = await contract.autoRejectUnreviewedTreasuryGrants(id);
      setLoadingMessage("Confirming transaction on the blockchain...");
      await tx.wait();
      toast({ title: "Campaign rejected!", status: "success" });
      setLoadingMessage("Refreshing campaign data...");
      await loadContractData();
    } catch (error) {
      toast({ title: "Error rejecting campaign", description: error.message, status: "error" });
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };

  const handleOverrideRejection = async (id) => {
    if (!isVoter) return;
    setLoading(true);
    setLoadingMessage("Waiting for wallet approval to override rejection...");
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = getFundingPoolContract(signer);
      const tx = await contract.overrideAutoRejection(id);
      setLoadingMessage("Confirming transaction on the blockchain...");
      await tx.wait();
      toast({ title: "Rejection overridden!", status: "success" });
      setLoadingMessage("Refreshing campaign data...");
      await loadContractData();
    } catch (error) {
      toast({ title: "Error overriding rejection", description: error.message, status: "error" });
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };

  const handleApproveMilestone = async (campaignId, milestoneId) => {
    if (!isVoter) return;
    setLoading(true);
    setLoadingMessage("Waiting for wallet approval to approve milestone...");
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = getFundingPoolContract(signer);
      const tx = await contract.approveMilestone(campaignId, milestoneId);
      setLoadingMessage("Confirming transaction on the blockchain...");
      await tx.wait();
      toast({ title: "Milestone approved!", status: "success" });
      setLoadingMessage("Refreshing campaign data...");
      await loadContractData();
    } catch (error) {
      toast({ title: "Error approving milestone", description: error.message, status: "error" });
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };

  const handleRejectMilestone = async (campaignId, milestoneId) => {
    if (!isVoter) return;
    setLoading(true);
    setLoadingMessage("Waiting for wallet approval to reject milestone...");
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = getFundingPoolContract(signer);
      const tx = await contract.rejectMilestone(campaignId, milestoneId);
      setLoadingMessage("Confirming transaction on the blockchain...");
      await tx.wait();
      toast({ title: "Milestone rejected!", status: "success" });
      setLoadingMessage("Refreshing campaign data...");
      await loadContractData();
    } catch (error) {
      toast({ title: "Error rejecting milestone", description: error.message, status: "error" });
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };

  const handleRefundUnspentFunds = async (id) => {
    setLoading(true);
    setLoadingMessage("Waiting for wallet approval to refund unspent funds...");
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = getFundingPoolContract(signer);
      const tx = await contract.refundUnspentFunds(id);
      setLoadingMessage("Confirming transaction on the blockchain...");
      await tx.wait();
      toast({ title: "Unspent funds refunded!", status: "success" });
      setLoadingMessage("Refreshing campaign data...");
      await loadContractData();
    } catch (error) {
      toast({ title: "Error refunding funds", description: error.message, status: "error" });
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };

  const handleApproveCustomMilestones = async (campaignId) => {
    if (!isVoter || customMilestones.length === 0) return;
    setLoading(true);
    setLoadingMessage("Waiting for wallet approval to approve custom milestones...");
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = getFundingPoolContract(signer);
      const descriptions = customMilestones.map((m) => m.description);
      const amounts = customMilestones.map((m) => ethers.parseEther(m.amount));
      const tx = await contract.approveCustomMilestones(campaignId, descriptions, amounts);
      setLoadingMessage("Confirming transaction on the blockchain...");
      await tx.wait();
      toast({ title: "Custom milestones approved!", status: "success" });
      setCustomMilestones([]);
      setLoadingMessage("Refreshing campaign data...");
      await loadContractData();
    } catch (error) {
      toast({ title: "Error approving custom milestones", description: error.message, status: "error" });
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };

  const handleAddCustomMilestone = () => {
    setCustomMilestones([...customMilestones, { description: "", amount: "" }]);
  };

  const updateCustomMilestone = (index, field, value) => {
    const updated = [...customMilestones];
    updated[index][field] = value;
    setCustomMilestones(updated);
  };

  const handleAddVoter = async () => {
    if (!isOwner || !ethers.isAddress(newVoter)) {
      toast({ title: "Invalid address or not owner", status: "warning" });
      return;
    }
    setLoading(true);
    setLoadingMessage("Waiting for wallet approval to add voter...");
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = getFundingPoolContract(signer);
      const tx = await contract.grantRole(ethers.keccak256(ethers.toUtf8Bytes("VOTER_ROLE")), newVoter);
      setLoadingMessage("Confirming transaction on the blockchain...");
      await tx.wait();
      toast({ title: "Voter added!", status: "success" });
      setNewVoter("");
      setLoadingMessage("Refreshing data...");
      await loadContractData();
    } catch (error) {
      toast({ title: "Error adding voter", description: error.message, status: "error" });
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };

  const handleOwnerWithdraw = async () => {
    if (!isOwner || !withdrawAmount) return;
    setLoading(true);
    setLoadingMessage("Waiting for wallet approval to withdraw funds...");
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = getFundingPoolContract(signer);
      const tx = await contract.ownerWithdraw(ethers.parseEther(withdrawAmount));
      setLoadingMessage("Confirming transaction on the blockchain...");
      await tx.wait();
      toast({ title: "Funds withdrawn!", status: "success" });
      setWithdrawAmount("");
      setLoadingMessage("Refreshing treasury data...");
      await loadContractData();
    } catch (error) {
      toast({ title: "Error withdrawing funds", description: error.message, status: "error" });
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };

  const handleUpdateTreasuryLimit = async () => {
    if (!isOwner) return;
    setLoading(true);
    setLoadingMessage("Waiting for wallet approval to update treasury limit...");
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = getFundingPoolContract(signer);
      const tx = await contract.updateTreasuryLimit();
      setLoadingMessage("Confirming transaction on the blockchain...");
      await tx.wait();
      toast({ title: "Treasury limit updated!", status: "success" });
      setLoadingMessage("Refreshing treasury data...");
      await loadContractData();
    } catch (error) {
      toast({ title: "Error updating treasury limit", description: error.message, status: "error" });
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };

  const handleDeleteCampaign = async () => {
    if (!isOwner || !campaignToDelete) return;
    setLoading(true);
    setLoadingMessage("Waiting for wallet approval to delete campaign...");
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = getFundingPoolContract(signer);
      const tx = await contract.deleteCampaign(campaignToDelete.id);
      setLoadingMessage("Confirming transaction on the blockchain...");
      await tx.wait();
      toast({ title: "Campaign deleted!", status: "success" });
      setIsDeleteDialogOpen(false);
      setCampaignToDelete(null);
      setLoadingMessage("Refreshing campaign data...");
      await loadContractData();
    } catch (error) {
      toast({ title: "Error deleting campaign", description: error.message, status: "error" });
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };

  const openDeleteDialog = (campaign) => {
    setCampaignToDelete(campaign);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setCampaignToDelete(null);
  };

  useEffect(() => {
    if (isConnected && window.ethereum) loadContractData();
  }, [isConnected, address]);

  if (!isConnected || !address) {
    return (
      <Flex direction="column" minH="100vh" bgGradient="linear(to-br, #14B8A6, #ffffff)" justify="center" align="center">
        <Container maxW="container.md" textAlign="center">
          <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
            <Heading as="h1" size="2xl" color="white" textShadow="0 4px 6px rgba(0, 0, 0, 0.8)" fontFamily="Poppins, sans-serif" mb={6}>
              Admin Panel
            </Heading>
            <Text color="white" fontSize="lg" fontFamily="Poppins, sans-serif">
              {isConnecting ? "Connecting to your wallet..." : "Please connect your wallet to access the admin panel."}
            </Text>
            {isConnecting && (
              <Flex justify="center" mt={4}>
                <Spinner size="md" color="white" thickness="2px" />
              </Flex>
            )}
          </MotionBox>
        </Container>
        <Footer />
      </Flex>
    );
  }

  if (!isOwner) {
    return (
      <Flex direction="column" minH="100vh" bgGradient="linear(to-br, #14B8A6, #ffffff)" justify="center" align="center">
        <Container maxW="container.md" textAlign="center">
          <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
            <Heading as="h1" size="2xl" color="white" textShadow="0 4px 6px rgba(0, 0, 0, 0.8)" fontFamily="Poppins, sans-serif" mb={6}>
              Access Denied
            </Heading>
            <Text color="white" fontSize="lg" fontFamily="Poppins, sans-serif" mb={4}>
              Only the contract owner can access this page.
            </Text>
            <Text color="white" fontSize="sm" fontFamily="Poppins, sans-serif">
              Contract Owner: {ownerAddress ? `${ownerAddress.slice(0, 6)}...${ownerAddress.slice(-4)}` : "Loading..."}
            </Text>
            <Text color="white" fontSize="sm" fontFamily="Poppins, sans-serif" mt={2}>
              Your Address: {address.slice(0, 6)}...{address.slice(-4)}
            </Text>
          </MotionBox>
        </Container>
        <Footer />
      </Flex>
    );
  }

  return (
    <Flex
      direction="column"
      minH="100vh"
      bgGradient="linear(to-br, #14B8A6, #ffffff)"
      pt="64px"
    >
      <Container maxW="container.xl" py={12} textAlign="center">
        <MotionBox initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, ease: "easeOut" }}>
          <Heading
            as="h1"
            size={{ base: "xl", md: "3xl" }}
            fontWeight="extrabold"
            color="white"
            lineHeight={1.3}
            textShadow="0 4px 12px rgba(0, 0, 0, 0.8)"
            letterSpacing="0.5px"
            fontFamily="Poppins, sans-serif"
            mb={8}
          >
            Admin Panel
          </Heading>
        </MotionBox>

        <VStack spacing={8} align="stretch">
          <MotionBox bg="white" p={6} maxWidth="600px" mx="auto" rounded="xl" shadow="md" transition="all 0.2s" _hover={{ shadow: "lg" }}>
            <Heading size="md" color="teal.600" mb={4} fontFamily="Poppins, sans-serif">
              Owner Controls
            </Heading>
            <VStack spacing={4} align="stretch">
              <Flex direction={{ base: "column", md: "row" }} gap={4} justify="center" align="center">
                <Input
                  placeholder="New Voter Address (0x...)"
                  value={newVoter}
                  onChange={(e) => setNewVoter(e.target.value)}
                  bg="gray.50"
                  rounded="lg"
                  maxW="200px"
                />
                <Tooltip label="Grants voter role to this address">
                  <Button
                    colorScheme="teal"
                    size="md"
                    fontWeight="bold"
                    borderRadius="full"
                    boxShadow="0px 4px 12px rgba(0,0,0,0.1)"
                    fontFamily="Poppins, sans-serif"
                    _hover={{
                      bgGradient: "linear(to-r, teal.400, teal.500)",
                      color: "white",
                      boxShadow: "md",
                      transform: "scale(1.05)",
                    }}
                    px={8}
                    w="180px"
                    whiteSpace="nowrap"
                    overflow="hidden"
                    textOverflow="ellipsis"
                    onClick={handleAddVoter}
                    isLoading={loading}
                  >
                    Add Voter
                  </Button>
                </Tooltip>
              </Flex>
              <Flex direction={{ base: "column", md: "row" }} gap={4} justify="center" align="center">
                <Input
                  placeholder="Amount in ETH"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  bg="gray.50"
                  rounded="lg"
                  maxW="200px"
                />
                <Tooltip label="Withdraws ETH to owner wallet">
                  <Button
                    colorScheme="teal"
                    size="md"
                    fontWeight="bold"
                    borderRadius="full"
                    boxShadow="0px 4px 12px rgba(0,0,0,0.1)"
                    fontFamily="Poppins, sans-serif"
                    _hover={{
                      bgGradient: "linear(to-r, teal.400, teal.500)",
                      color: "white",
                      boxShadow: "md",
                      transform: "scale(1.05)",
                    }}
                    px={8}
                    w="180px"
                    whiteSpace="nowrap"
                    overflow="hidden"
                    textOverflow="ellipsis"
                    onClick={handleOwnerWithdraw}
                    isLoading={loading}
                  >
                    Withdraw Funds
                  </Button>
                </Tooltip>
              </Flex>
            </VStack>
            <Heading size="md" color="teal.600" mt={6} mb={4} fontFamily="Poppins, sans-serif">
              Treasury Info
            </Heading>
            <VStack spacing={3} align="stretch">
              <Flex justify="space-between" align="center">
                <Text fontSize="sm" color="gray.600" fontWeight="bold">
                  Quarterly Limit:
                </Text>
                <HStack>
                  <FaEthereum color="teal.600" />
                  <Text fontSize="lg" color="teal.600">
                    {parseFloat(treasuryInfo.limit).toFixed(2)} ETH
                  </Text>
                </HStack>
              </Flex>
              <Flex justify="space-between" align="center">
                <Text fontSize="sm" color="gray.600" fontWeight="bold">
                  Funds Used:
                </Text>
                <HStack>
                  <FaEthereum color="teal.600" />
                  <Text fontSize="lg" color="teal.600">
                    {parseFloat(treasuryInfo.used).toFixed(2)} ETH
                  </Text>
                </HStack>
              </Flex>
              <Flex justify="space-between" align="center">
                <Text fontSize="sm" color="gray.600" fontWeight="bold">
                  Full Treasury Balance:
                </Text>
                <HStack>
                  <FaEthereum color="teal.600" />
                  <Text fontSize="lg" color="teal.600">
                    {parseFloat(treasuryInfo.fullBalance).toFixed(2)} ETH
                  </Text>
                </HStack>
              </Flex>
              <Flex justify="space-between" align="center">
                <Text fontSize="sm" color="gray.600" fontWeight="bold">
                  Quarter Start:
                </Text>
                <Text fontSize="sm" color="gray.800">
                  {new Date(treasuryInfo.quarterStart * 1000).toLocaleString()}
                </Text>
              </Flex>
              <Tooltip label="Recalculates quarterly treasury limit">
                <Button
                  colorScheme="teal"
                  size="md"
                  fontWeight="bold"
                  borderRadius="full"
                  boxShadow="0px 4px 12px rgba(0,0,0,0.1)"
                  fontFamily="Poppins, sans-serif"
                  _hover={{
                    bgGradient: "linear(to-r, teal.400, teal.500)",
                    color: "white",
                    boxShadow: "md",
                    transform: "scale(1.05)",
                  }}
                  px={6}
                  whiteSpace="nowrap"
                  overflow="hidden"
                  textOverflow="ellipsis"
                  mt={4}
                  onClick={handleUpdateTreasuryLimit}
                  isLoading={loading}
                >
                  Update Treasury Limit
                </Button>
              </Tooltip>
            </VStack>
          </MotionBox>

          <Heading
            size="lg"
            color="white"
            textShadow="0 4px 6px rgba(0, 0, 0, 0.8)"
            fontFamily="Poppins, sans-serif"
            mb={6}
            mt={10}
            textAlign="center"
          >
            Campaign Management
          </Heading>
          {loading ? (
            <Flex justify="center" py={10} direction="column" align="center">
              <Spinner size="xl" color="white" thickness="3px" />
              <Text color="white" mt={4} fontFamily="Poppins, sans-serif">
                {loadingMessage}
              </Text>
            </Flex>
          ) : campaigns.length === 0 ? (
            <Text color="white" textAlign="center" py={4} fontFamily="Poppins, sans-serif">
              No campaigns found.
            </Text>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {campaigns.map((campaign, index) => (
                <MotionBox
                  key={campaign.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  bg="white"
                  p={6}
                  rounded="xl"
                  shadow="md"
                  border="2px solid"
                  borderColor={campaign.type === "Crowdfunding" ? "teal.400" : "yellow.400"}
                  _hover={{ shadow: "lg", borderColor: campaign.type === "Crowdfunding" ? "teal.500" : "yellow.500" }}
                >
                  <VStack align="stretch" spacing={4}>
                    <Heading
                      size="md"
                      color="gray.800"
                      fontWeight="bold"
                      noOfLines={1}
                      textAlign="center"
                      fontSize="lg"
                      fontFamily="Poppins, sans-serif"
                    >
                      {campaign.name}
                    </Heading>
                    <HStack justify="center" spacing={3}>
                      <Badge
                        colorScheme={
                          campaign.status === "Approved" ? "green" : campaign.status === "Rejected" ? "red" : "yellow"
                        }
                        px={3}
                        py={1}
                        rounded="full"
                        fontSize="sm"
                        fontFamily="Poppins, sans-serif"
                      >
                        {campaign.status}
                      </Badge>
                      <Badge
                        colorScheme={campaign.type === "Crowdfunding" ? "teal" : "yellow"}
                        variant="outline"
                        px={3}
                        py={1}
                        rounded="full"
                        fontSize="sm"
                        fontFamily="Poppins, sans-serif"
                        display="flex"
                        alignItems="center"
                      >
                        {campaign.type === "Crowdfunding" ? (
                          <FaUsers size="16px" style={{ marginRight: "6px" }} />
                        ) : (
                          <FaCoins size="16px" style={{ marginRight: "6px" }} />
                        )}
                        {campaign.type}
                      </Badge>
                    </HStack>
                    <Box bg="gray.50" p={4} rounded="lg">
                      <VStack spacing={2} align="stretch">
                        <Text fontSize="sm" color="gray.600">
                          Creator:{" "}
                          <ChakraLink href={`https://sepolia.etherscan.io/address/${campaign.creator}`} target="_blank" color="teal.500">
                            {campaign.creator.slice(0, 6)}...{campaign.creator.slice(-4)}
                          </ChakraLink>
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          Goal: <Text as="span" color="teal.600">{parseFloat(campaign.fundingGoal).toFixed(2)} ETH</Text>
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          Raised: <Text as="span" color="teal.600">{parseFloat(campaign.amountRaised).toFixed(2)} ETH</Text>
                        </Text>
                        {campaign.type === "Crowdfunding" && (
                          <Text fontSize="sm" color="gray.600">
                            Deadline: <Text as="span" color="gray.800">{getTimeRemaining(campaign.deadline)}</Text>
                          </Text>
                        )}
                        {campaign.type === "Treasury Grant" && (
                          <Text fontSize="sm" color="gray.600">
                            Expiry: <Text as="span" color="gray.800">{getTimeRemaining(campaign.applicationExpiry)}</Text>
                          </Text>
                        )}
                      </VStack>
                    </Box>
                    {campaign.status === "Pending" && isVoter ? (
                      <HStack spacing={3} justify="center" wrap="wrap" gap={3}>
                        <Tooltip label="Approves the campaign for funding">
                          <Button
                            colorScheme="teal"
                            size="md"
                            variant="solid"
                            fontWeight="bold"
                            borderRadius="full"
                            boxShadow="0px 4px 12px rgba(0,0,0,0.1)"
                            fontFamily="Poppins, sans-serif"
                            _hover={{
                              bgGradient: "linear(to-r, teal.400, teal.500)",
                              color: "white",
                              boxShadow: "md",
                              transform: "scale(1.05)",
                            }}
                            px={6}
                            whiteSpace="nowrap"
                            overflow="hidden"
                            textOverflow="ellipsis"
                            onClick={() => handleVoteCampaign(campaign.id)}
                            isLoading={loading}
                            fontSize="sm"
                          >
                            Approve Project
                          </Button>
                        </Tooltip>
                        {campaign.type === "Treasury Grant" && (
                          <Tooltip label="Rejects the treasury grant application">
                            <Button
                              colorScheme="teal"
                              size="md"
                              variant="outline"
                              fontWeight="bold"
                              borderRadius="full"
                              boxShadow="0px 4px 12px rgba(0,0,0,0.1)"
                              fontFamily="Poppins, sans-serif"
                              _hover={{
                                bgGradient: "linear(to-r, teal.400, teal.500)",
                                color: "white",
                                boxShadow: "md",
                                transform: "scale(1.05)",
                              }}
                              px={6}
                              whiteSpace="nowrap"
                              overflow="hidden"
                              textOverflow="ellipsis"
                              onClick={() => handleAutoReject(campaign.id)}
                              isLoading={loading}
                              fontSize="sm"
                            >
                              Reject
                            </Button>
                          </Tooltip>
                        )}
                      </HStack>
                    ) : !isVoter && campaign.status === "Pending" ? (
                      <Text fontSize="sm" color="gray.600" textAlign="center" fontFamily="Poppins, sans-serif">
                        Requires voter role to manage
                      </Text>
                    ) : campaign.status === "Rejected" && campaign.type === "Treasury Grant" && isVoter ? (
                      <Tooltip label="Resets rejection to pending status">
                        <Button
                          colorScheme="teal"
                          size="md"
                          variant="solid"
                          fontWeight="bold"
                          borderRadius="full"
                          boxShadow="0px 4px 12px rgba(0,0,0,0.1)"
                          fontFamily="Poppins, sans-serif"
                          _hover={{
                            bgGradient: "linear(to-r, teal.400, teal.500)",
                            color: "white",
                            boxShadow: "md",
                            transform: "scale(1.05)",
                          }}
                          px={6}
                          whiteSpace="nowrap"
                          overflow="hidden"
                          textOverflow="ellipsis"
                          onClick={() => handleOverrideRejection(campaign.id)}
                          isLoading={loading}
                          fontSize="sm"
                        >
                          Override Rejection
                        </Button>
                      </Tooltip>
                    ) : null}

                    {campaign.type === "Treasury Grant" && (
                      <VStack spacing={3} align="stretch" mt={4}>
                        <Text fontSize="sm" color="gray.600" fontWeight="bold" fontFamily="Poppins, sans-serif">
                          Milestones (KYC required for grants or withdrawals over 5 ETH):
                        </Text>
                        {campaign.milestones.length === 0 && campaign.status === "Pending" && isVoter ? (
                          <VStack spacing={3} align="stretch">
                            <Text fontSize="sm" color="gray.600" fontFamily="Poppins, sans-serif">
                              Predefined: 30% (Proof of Concept), 30% (Beta), 40% (Final Product)
                            </Text>
                            <FormControl>
                              <FormLabel fontSize="sm" color="gray.600" fontFamily="Poppins, sans-serif">
                                Override with Custom Milestones
                              </FormLabel>
                              {customMilestones.map((m, idx) => (
                                <Flex key={idx} gap={2} mb={2} direction={{ base: "column", md: "row" }}>
                                  <Input
                                    placeholder="Description"
                                    value={m.description}
                                    onChange={(e) => updateCustomMilestone(idx, "description", e.target.value)}
                                    bg="gray.50"
                                    rounded="lg"
                                    fontSize="sm"
                                    maxW={{ base: "100%", md: "300px" }}
                                  />
                                  <Input
                                    placeholder="Amount (ETH)"
                                    type="number"
                                    value={m.amount}
                                    onChange={(e) => updateCustomMilestone(idx, "amount", e.target.value)}
                                    bg="gray.50"
                                    rounded="lg"
                                    fontSize="sm"
                                    maxW={{ base: "100%", md: "150px" }}
                                  />
                                </Flex>
                              ))}
                              <Tooltip label="Adds a new custom milestone">
                                <Button
                                  colorScheme="teal"
                                  size="sm"
                                  variant="outline"
                                  fontWeight="bold"
                                  borderRadius="full"
                                  boxShadow="0px 4px 12px rgba(0,0,0,0.1)"
                                  fontFamily="Poppins, sans-serif"
                                  _hover={{
                                    bgGradient: "linear(to-r, teal.400, teal.500)",
                                    color: "white",
                                    boxShadow: "md",
                                    transform: "scale(1.05)",
                                  }}
                                  px={4}
                                  whiteSpace="nowrap"
                                  overflow="hidden"
                                  textOverflow="ellipsis"
                                  onClick={handleAddCustomMilestone}
                                  fontSize="sm"
                                >
                                  Add Milestone
                                </Button>
                              </Tooltip>
                            </FormControl>
                            {customMilestones.length > 0 && (
                              <Tooltip label="Overrides predefined milestones">
                                <Button
                                  colorScheme="teal"
                                  size="md"
                                  variant="solid"
                                  fontWeight="bold"
                                  borderRadius="full"
                                  boxShadow="0px 4px 12px rgba(0,0,0,0.1)"
                                  fontFamily="Poppins, sans-serif"
                                  _hover={{
                                    bgGradient: "linear(to-r, teal.400, teal.500)",
                                    color: "white",
                                    boxShadow: "md",
                                    transform: "scale(1.05)",
                                  }}
                                  px={6}
                                  whiteSpace="nowrap"
                                  overflow="hidden"
                                  textOverflow="ellipsis"
                                  onClick={() => handleApproveCustomMilestones(campaign.id)}
                                  isLoading={loading}
                                  fontSize="sm"
                                >
                                  Submit Custom Milestones
                                </Button>
                              </Tooltip>
                            )}
                          </VStack>
                        ) : (
                          campaign.milestones.map((m) => (
                            <Box key={m.id} bg="gray.50" p={3} rounded="lg">
                              <Text fontSize="sm" color="gray.800" fontFamily="Poppins, sans-serif">
                                {m.description} ({parseFloat(m.amount).toFixed(2)} ETH) {m.isPredefined && (
                                  <Badge colorScheme="yellow" fontSize="xs">Predefined</Badge>
                                )}
                              </Text>
                              {m.proofCID ? (
                                <Text fontSize="sm" color="teal.500">
                                  Proof: <ChakraLink href={`https://ipfs.io/ipfs/${m.proofCID}`} target="_blank">{m.proofCID.slice(0, 10)}...</ChakraLink>
                                </Text>
                              ) : (
                                <Text fontSize="sm" color="gray.600" fontFamily="Poppins, sans-serif">
                                  Proof: Awaiting submission from creator
                                </Text>
                              )}
                              {m.rejectedAt && (
                                <Text fontSize="sm" color="red.500">
                                  Rejected: {m.rejectedAt} (Resubmit in {getTimeRemaining(Math.floor(new Date(m.rejectedAt).getTime() / 1000) + 7 * 86400)})
                                </Text>
                              )}
                              {isVoter && campaign.status === "Approved" && !m.completed && !m.rejectedAt && m.proofCID && (
                                <HStack spacing={2} mt={2} justify="center">
                                  <Tooltip label="Approves this milestone for fund release">
                                    <Button
                                      colorScheme="teal"
                                      size="sm"
                                      variant="outline"
                                      fontWeight="bold"
                                      borderRadius="full"
                                      boxShadow="0px 4px 12px rgba(0,0,0,0.1)"
                                      fontFamily="Poppins, sans-serif"
                                      _hover={{
                                        bgGradient: "linear(to-r, teal.400, teal.500)",
                                        color: "white",
                                        boxShadow: "md",
                                        transform: "scale(1.05)",
                                      }}
                                      px={4}
                                      whiteSpace="nowrap"
                                      overflow="hidden"
                                      textOverflow="ellipsis"
                                      onClick={() => handleApproveMilestone(campaign.id, m.id)}
                                      isLoading={loading}
                                      fontSize="sm"
                                    >
                                      Approve
                                    </Button>
                                  </Tooltip>
                                  <Tooltip label="Rejects this milestone (7-day resubmission)">
                                    <Button
                                      colorScheme="teal"
                                      size="sm"
                                      variant="outline"
                                      fontWeight="bold"
                                      borderRadius="full"
                                      boxShadow="0px 4px 12px rgba(0,0,0,0.1)"
                                      fontFamily="Poppins, sans-serif"
                                      _hover={{
                                        bgGradient: "linear(to-r, teal.400, teal.500)",
                                        color: "white",
                                        boxShadow: "md",
                                        transform: "scale(1.05)",
                                      }}
                                      px={4}
                                      whiteSpace="nowrap"
                                      overflow="hidden"
                                      textOverflow="ellipsis"
                                      onClick={() => handleRejectMilestone(campaign.id, m.id)}
                                      isLoading={loading}
                                      fontSize="sm"
                                    >
                                      Reject
                                    </Button>
                                  </Tooltip>
                                </HStack>
                              )}
                              {m.completed && (
                                <Text fontSize="sm" color="green.500">
                                  Completed: {m.completedAt}
                                </Text>
                              )}
                            </Box>
                          ))
                        )}
                        <HStack spacing={3} justify="center" mt={3} wrap="wrap" gap={3}>
                          <Tooltip label="View full project details">
                            <Link href={`/projects/${campaign.id}`} target="_blank" rel="noopener noreferrer">
                              <Button
                                as="a"
                                colorScheme="teal"
                                size="sm"
                                variant="outline"
                                fontWeight="bold"
                                borderRadius="full"
                                boxShadow="0px 4px 12px rgba(0,0,0,0.1)"
                                fontFamily="Poppins, sans-serif"
                                _hover={{
                                  bgGradient: "linear(to-r, teal.400, teal.500)",
                                  color: "white",
                                  boxShadow: "md",
                                  transform: "scale(1.05)",
                                }}
                                px={4}
                                whiteSpace="nowrap"
                                overflow="hidden"
                                textOverflow="ellipsis"
                                fontSize="sm"
                              >
                                See Project Details
                              </Button>
                            </Link>
                          </Tooltip>
                          {campaign.status === "Approved" && (
                            <Tooltip label="Refunds unspent treasury funds">
                              <Button
                                colorScheme="teal"
                                size="sm"
                                variant="outline"
                                fontWeight="bold"
                                borderRadius="full"
                                boxShadow="0px 4px 12px rgba(0,0,0,0.1)"
                                fontFamily="Poppins, sans-serif"
                                _hover={{
                                  bgGradient: "linear(to-r, teal.400, teal.500)",
                                  color: "white",
                                  boxShadow: "md",
                                  transform: "scale(1.05)",
                                }}
                                px={4}
                                whiteSpace="nowrap"
                                overflow="hidden"
                                textOverflow="ellipsis"
                                onClick={() => handleRefundUnspentFunds(campaign.id)}
                                isLoading={loading}
                                fontSize="sm"
                              >
                                Refund Unspent
                              </Button>
                            </Tooltip>
                          )}
                          <Tooltip label="Permanently deletes this campaign and refunds remaining funds">
                            <Button
                              colorScheme="red"
                              size="sm"
                              variant="outline"
                              fontWeight="bold"
                              borderRadius="full"
                              boxShadow="0px 4px 12px rgba(0,0,0,0.1)"
                              fontFamily="Poppins, sans-serif"
                              _hover={{
                                bgGradient: "linear(to-r, red.400, red.500)",
                                color: "white",
                                boxShadow: "md",
                                transform: "scale(1.05)",
                              }}
                              px={4}
                              whiteSpace="nowrap"
                              overflow="hidden"
                              textOverflow="ellipsis"
                              onClick={() => openDeleteDialog(campaign)}
                              isLoading={loading}
                              fontSize="sm"
                              leftIcon={<FaTrash />}
                            >
                              Delete
                            </Button>
                          </Tooltip>
                        </HStack>
                      </VStack>
                    )}

                    {campaign.type === "Crowdfunding" && campaign.status === "Approved" && (
                      <VStack spacing={3} mt={4}>
                        <VStack spacing={1}>
                          <Text fontSize="sm" color="gray.600" fontWeight="bold" fontFamily="Poppins, sans-serif">
                            Funding Progress: {((parseFloat(campaign.amountRaised) / parseFloat(campaign.fundingGoal)) * 100).toFixed(1)}% Funded
                          </Text>
                          <Progress
                            value={(parseFloat(campaign.amountRaised) / parseFloat(campaign.fundingGoal)) * 100}
                            colorScheme="teal"
                            height="12"
                            width="100%"
                            rounded="md"
                          />
                        </VStack>
                        <HStack justify="center">
                          <FaUsers color="teal.600" size="16px" />
                          <Text fontSize="sm" color="gray.600" fontFamily="Poppins, sans-serif">
                            {campaign.supportersCount} Contributors
                          </Text>
                        </HStack>
                        <HStack spacing={3} justify="center" mt={3} wrap="wrap" gap={3}>
                          <Tooltip label="View full project details">
                            <Link href={`/projects/${campaign.id}`} target="_blank" rel="noopener noreferrer">
                              <Button
                                as="a"
                                colorScheme="teal"
                                size="sm"
                                variant="outline"
                                fontWeight="bold"
                                borderRadius="full"
                                boxShadow="0px 4px 12px rgba(0,0,0,0.1)"
                                fontFamily="Poppins, sans-serif"
                                _hover={{
                                  bgGradient: "linear(to-r, teal.400, teal.500)",
                                  color: "white",
                                  boxShadow: "md",
                                  transform: "scale(1.05)",
                                }}
                                px={4}
                                whiteSpace="nowrap"
                                overflow="hidden"
                                textOverflow="ellipsis"
                                fontSize="sm"
                              >
                                See Project Details
                              </Button>
                            </Link>
                          </Tooltip>
                          <Tooltip label="Permanently deletes this campaign and refunds remaining funds">
                            <Button
                              colorScheme="red"
                              size="sm"
                              variant="outline"
                              fontWeight="bold"
                              borderRadius="full"
                              boxShadow="0px 4px 12px rgba(0,0,0,0.1)"
                              fontFamily="Poppins, sans-serif"
                              _hover={{
                                bgGradient: "linear(to-r, red.400, red.500)",
                                color: "white",
                                boxShadow: "md",
                                transform: "scale(1.05)",
                              }}
                              px={4}
                              whiteSpace="nowrap"
                              overflow="hidden"
                              textOverflow="ellipsis"
                              onClick={() => openDeleteDialog(campaign)}
                              isLoading={loading}
                              fontSize="sm"
                              leftIcon={<FaTrash />}
                            >
                              Delete
                            </Button>
                          </Tooltip>
                        </HStack>
                      </VStack>
                    )}
                  </VStack>
                </MotionBox>
              ))}
            </SimpleGrid>
          )}
        </VStack>

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          isOpen={isDeleteDialogOpen}
          leastDestructiveRef={cancelRef}
          onClose={closeDeleteDialog}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold" fontFamily="Poppins, sans-serif">
                Delete Campaign
              </AlertDialogHeader>
              <AlertDialogBody fontFamily="Poppins, sans-serif">
                Are you sure you want to delete "{campaignToDelete?.name}" (ID: {campaignToDelete?.id})?
                This action is irreversible and will refund any remaining funds:
                <Text mt={2} fontWeight="bold" color="red.500">
                  - Treasury: {(parseFloat(campaignToDelete?.amountRaised) - parseFloat(campaignToDelete?.amountRaised)).toFixed(2)} ETH
                  - Crowdfunded: {(parseFloat(campaignToDelete?.amountRaised) - parseFloat(campaignToDelete?.amountRaised)).toFixed(2)} ETH
                </Text>
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button
                  ref={cancelRef}
                  fontFamily="Poppins, sans-serif"
                  onClick={closeDeleteDialog}
                  mr={3}
                >
                  Cancel
                </Button>
                <Button
                  colorScheme="red"
                  onClick={handleDeleteCampaign}
                  isLoading={loading}
                  fontFamily="Poppins, sans-serif"
                >
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Container>
      <Footer />
    </Flex>
  );
}