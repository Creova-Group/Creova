import { useEffect, useState } from "react";
import { ethers } from "ethers";
import {
  Box, Heading, Text, Container, SimpleGrid, Flex, Badge, Button, useToast, Spinner, Progress,
  Stat, StatLabel, StatNumber, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter,
  Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, VStack, HStack, Input, InputGroup, InputRightElement, Select,
  useColorModeValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";
import { useRouter } from "next/router";
import { uploadFileToIPFS } from "../utils/pinata";
import Footer from "../components/Footer";
import { FaEthereum, FaUser, FaUsers, FaGift, FaFileUpload } from "react-icons/fa";
import { getFundingPoolContract, CONTRACT_ADDRESS } from "../lib/getFundingPoolContract";
const MotionBox = motion(Box);
const MAX_PROOF_SIZE = 10 * 1024 * 1024; // 10MB

export default function Dashboard() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [walletBalance, setWalletBalance] = useState("0.0");
  const [daoTreasuryBalance, setDaoTreasuryBalance] = useState("0.0");
  const [availableTreasuryFunds, setAvailableTreasuryFunds] = useState("0.0");
  const [projects, setProjects] = useState([]);
  const [userContributions, setUserContributions] = useState("0.0");
  const [isKYCVerified, setIsKYCVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [milestoneProject, setMilestoneProject] = useState(null);
  const [selectedMilestoneIndex, setSelectedMilestoneIndex] = useState("");
  const [proofFile, setProofFile] = useState(null);
  const [proofCID, setProofCID] = useState("");
  const toast = useToast();

  // Define dynamic styles using useColorModeValue
  const bgGradient = useColorModeValue(
    "linear(to-br, #14B8A6, #ffffff)", // Light mode
    "linear(to-br, #0D9488, #1A202C)"  // Dark mode
  );

  const cardBg = useColorModeValue(
    "white",        // Light mode
    "gray.800"      // Dark mode
  );

  const textColor = useColorModeValue(
    "gray.800",     // Light mode
    "white"         // Dark mode
  );

  const subTextColor = useColorModeValue(
    "gray.600",     // Light mode
    "gray.300"      // Dark mode
  );

  const shadow = useColorModeValue(
    "md",                          // Light mode
    "0 4px 6px rgba(255, 255, 255, 0.1)"  // Dark mode
  );

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!window.ethereum || !isConnected || !address) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const fundingContract = getFundingPoolContract(signer);

        const walletBal = await provider.getBalance(address);
        setWalletBalance(ethers.formatEther(walletBal));
        const treasuryBalanceWei = await provider.getBalance(CONTRACT_ADDRESS);
        setDaoTreasuryBalance(ethers.formatEther(treasuryBalanceWei));
        const availableFundsWei = await fundingContract.getAvailableTreasuryFunds();
        setAvailableTreasuryFunds(ethers.formatEther(availableFundsWei));
        const kycStatus = await fundingContract.isKYCVerified(address);
        setIsKYCVerified(kycStatus);

        let totalUserContributed = ethers.parseEther("0");
        const campaignCount = await fundingContract.campaignIds();
        const loadedProjects = [];

        for (let i = 1; i <= campaignCount; i++) {
          const campaign = await fundingContract.campaigns(i);
          const milestonesData = await fundingContract.getCampaignMilestones(i);
          const emergencyOverride = await fundingContract.emergencyWithdrawalOverrides(address, i);
          const milestones = milestonesData.map((m, index) => ({
            index,
            title: m.description,
            completed: m.completed,
            amount: ethers.formatEther(m.amount),
            completedAt: m.completedAt.toString() ? new Date(Number(m.completedAt) * 1000).toLocaleString() : "Pending",
            proofCID: m.proofCID,
            rejectedAt: Number(m.rejectedAt) > 0 ? new Date(Number(m.rejectedAt) * 1000).toLocaleString() : "",
            canResubmit: Number(m.rejectedAt) > 0 && (Date.now() / 1000 >= Number(m.rejectedAt) + 7 * 24 * 60 * 60),
          }));

          const userContribution = await fundingContract.getUserContribution(i, address);
          totalUserContributed = totalUserContributed + userContribution;

          const contributorsList = await fundingContract.getContributors(i);
          const contributors = await Promise.all(
            contributorsList.map(async (addr) => {
              const contributionWei = await fundingContract.getUserContribution(i, addr).catch(() => 0n);
              return { address: addr, amount: ethers.formatEther(contributionWei) || "0.0" };
            })
          ).then(list => list.sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount)));

          const fundingFilter = fundingContract.filters.ProjectFunded(i);
          const withdrawalFilter = fundingContract.filters.FundsWithdrawn(i);
          const fundingEvents = await fundingContract.queryFilter(fundingFilter, -10000, "latest");
          const withdrawalEvents = await fundingContract.queryFilter(withdrawalFilter, -10000, "latest");

          const deadline = campaign.fundingType.toString() === "0"
            ? new Date(Number(campaign.deadline) * 1000).toLocaleString()
            : new Date(Number(campaign.applicationExpiry) * 1000).toLocaleString();

          const project = {
            id: i,
            name: campaign.name,
            creator: campaign.creator,
            status: ["Pending", "Approved", "Rejected"][campaign.status],
            type: campaign.fundingType.toString() === "0" ? "Crowdfunding" : "TreasuryGrant",
            fundingGoal: ethers.formatEther(campaign.fundingGoal),
            amountRaised: ethers.formatEther(campaign.amountRaised),
            crowdfundedAmount: ethers.formatEther(campaign.crowdfundedAmount),
            milestones,
            withdrawnAmount: ethers.formatEther(campaign.withdrawnAmount),
            crowdfundedWithdrawnAmount: ethers.formatEther(campaign.crowdfundedWithdrawnAmount),
            createdAt: new Date(Number(campaign.createdAt) * 1000).toLocaleString(),
            deadline,
            description: campaign.description || "No description available",
            projectCID: campaign.projectCID || "",
            heroMediaCID: campaign.heroMediaCID || "",
            contributors,
            fundingEvents: fundingEvents.map(event => ({
              funder: event.args.funder || ethers.ZeroAddress,
              amount: ethers.formatEther(event.args.amount || 0),
              timestamp: new Date(Number(event.args.timestamp || 0) * 1000).toLocaleString(),
            })),
            withdrawalEvents: withdrawalEvents.map(event => ({
              creator: event.args.creator || ethers.ZeroAddress,
              amount: ethers.formatEther(event.args.amount || 0),
              timestamp: new Date(Number(event.blockTimestamp || 0) * 1000).toLocaleString(),
            })),
            emergencyOverride,
          };

          loadedProjects.push(project);
        }

        setProjects(loadedProjects);
        setUserContributions(ethers.formatEther(totalUserContributed));
        setLastUpdated(new Date().toLocaleString());
      } catch (error) {
        toast({ title: "Error loading dashboard", description: error.message, status: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isConnected, address, toast]);

  const handleWithdraw = async (project, isCrowdfunded = false) => {
    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const fundingContract = getFundingPoolContract(signer);

      if (isCrowdfunded || project.type === "Crowdfunding") {
        const amountToWithdraw = project.type === "Crowdfunding"
          ? parseFloat(project.amountRaised) - parseFloat(project.withdrawnAmount)
          : parseFloat(project.crowdfundedAmount) - parseFloat(project.crowdfundedWithdrawnAmount);
        if (amountToWithdraw > 10 && !isKYCVerified && !project.emergencyOverride) {
          throw new Error("KYC or admin override required for withdrawals over 10 ETH");
        }
        const tx = await fundingContract.withdrawFunds(project.id);
        await tx.wait();
      } else {
        const nextMilestoneIndex = project.milestones.findIndex((m) => m.completed && parseFloat(m.amount) > 0);
        if (nextMilestoneIndex === -1) {
          toast({ title: "No Withdrawals Available", description: "No completed milestones with funds", status: "warning" });
          return;
        }
        if (parseFloat(project.milestones[nextMilestoneIndex].amount) > 10 && !isKYCVerified && !project.emergencyOverride) {
          throw new Error("KYC or admin override required for withdrawals over 10 ETH");
        }
        const tx = await fundingContract.withdrawMilestoneFunds(project.id, nextMilestoneIndex);
        await tx.wait();
      }

      toast({ title: "Congratulations!", description: "Funds withdrawn successfully!", status: "success", duration: 3000, isClosable: true });
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error) {
      toast({ title: "Withdrawal Failed", description: error.message, status: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitProof = async (projectId, milestoneIndex, proofCID) => {
    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const fundingContract = getFundingPoolContract(signer);

      const tx = await fundingContract.submitMilestoneProof(projectId, milestoneIndex, proofCID);
      await tx.wait();

      toast({ title: "Proof Submitted", description: "Milestone proof submitted for review!", status: "success" });
      refreshData();
    } catch (error) {
      toast({ title: "Submission Failed", description: error.message, status: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleMilestoneSubmit = () => {
    if (selectedMilestoneIndex === "" || !proofCID) {
      toast({ title: "Invalid Input", description: "Please select a milestone and upload a proof file.", status: "warning" });
      return;
    }
    handleSubmitProof(milestoneProject.id, parseInt(selectedMilestoneIndex), proofCID);
    setIsMilestoneModalOpen(false);
    setSelectedMilestoneIndex("");
    setProofFile(null);
    setProofCID("");
    setMilestoneProject(null);
  };

  const handleProofFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["application/pdf", "application/msword", "image/jpeg", "image/png", "video/mp4"];
    if (!allowedTypes.includes(file.type)) {
      toast({ title: "Invalid File Type", description: "Only PDF, Word, JPEG, PNG, or MP4 files are allowed.", status: "error" });
      setProofFile(null);
      return;
    }
    if (file.size > MAX_PROOF_SIZE) {
      toast({ title: "File Too Large", description: "File must be under 10MB.", status: "error" });
      setProofFile(null);
      return;
    }

    setProofFile(file);
    setLoading(true);
    try {
      const cid = await uploadFileToIPFS(file);
      setProofCID(cid);
      toast({ title: "Upload Successful", description: `File uploaded to Pinata with CID: ${cid}`, status: "success" });
    } catch (error) {
      toast({ title: "Upload Failed", description: error.message, status: "error" });
      setProofCID("");
    } finally {
      setLoading(false);
    }
  };

  const handleKYCVerification = async () => {
    if (!isConnected || !address) {
      toast({ title: "Wallet Not Connected", description: "Please connect your wallet first.", status: "warning" });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/sumsub/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicantId: address }),
      });
      const { token } = await response.json();

      const sumsubLauncher = window.Sumsub.init({
        accessToken: token,
        applicantId: address,
        onComplete: (result) => {
          toast({ title: "KYC Submitted", description: "Verification in progress. Please wait for admin approval.", status: "info" });
        },
        onError: (error) => {
          toast({ title: "KYC Error", description: error.message || "Something went wrong.", status: "error" });
        },
      });
      sumsubLauncher.launch();

      const checkKYCStatus = setInterval(async () => {
        const updatedStatus = await fundingContract.isKYCVerified(address);
        if (updatedStatus) {
          setIsKYCVerified(true);
          clearInterval(checkKYCStatus);
          toast({ title: "KYC Verified", description: "You are now KYC verified!", status: "success" });
        }
      }, 5000);
    } catch (error) {
      toast({ title: "KYC Initiation Failed", description: error.message, status: "error" });
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    setLoading(true);
    setLastUpdated(null);
  };

  const handleSearchChange = (value) => {
    setIsSearching(true);
    const timer = setTimeout(() => {
      setSearchQuery(value);
      setIsSearching(false);
    }, 300);
    return () => clearTimeout(timer);
  };

  const canWithdraw = (project) => {
    if (project.status !== "Approved" || project.creator !== address) return false;
    if (project.type === "Crowdfunding") {
      return parseFloat(project.amountRaised) > parseFloat(project.withdrawnAmount) &&
        (parseFloat(project.amountRaised) >= parseFloat(project.fundingGoal) || new Date(project.deadline) < new Date());
    }
    if (project.type === "TreasuryGrant") {
      return project.milestones.some((m) => m.completed && parseFloat(m.amount) > 0) ||
        parseFloat(project.crowdfundedAmount) > parseFloat(project.crowdfundedWithdrawnAmount);
    }
    return false;
  };

  const filteredProjects = projects
    .filter(p => filter === "all" || p.type === filter)
    .filter(p => p.creator === address || parseFloat(p.contributors.find(c => c.address === address)?.amount || 0) > 0);

  const searchedProjects = searchQuery
    ? filteredProjects.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : filteredProjects;

  const StatCard = ({ title, value, icon }) => (
    <Box 
      bg={cardBg}
      p={5} 
      rounded="xl" 
      shadow={shadow}
      transition="all 0.2s"
      _hover={{ shadow: useColorModeValue("lg", "0 6px 8px rgba(255, 255, 255, 0.15)") }}
    >
      <Stat textAlign="center">
        <StatLabel color={subTextColor} fontSize="sm" fontWeight="bold">{title}</StatLabel>
        <HStack mt={2} justify="center">
          {icon}
          <StatNumber color="teal.600" fontSize="xl">{value}</StatNumber>
        </HStack>
      </Stat>
    </Box>
  );

  const ProjectCard = ({ project, index }) => (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      bg={cardBg}
      p={6}
      rounded="xl"
      shadow={shadow}
      border="2px solid"
      borderColor={project.type === "Crowdfunding" ? "teal.400" : "yellow.400"}
      _hover={{ 
        shadow: useColorModeValue("lg", "0 6px 8px rgba(255, 255, 255, 0.15)"),
        borderColor: project.type === "Crowdfunding" ? "teal.500" : "yellow.500" 
      }}
      h="520px"
    >
      <VStack align="stretch" spacing={4} h="full">
        <Box minH="60px" display="flex" alignItems="center" justifyContent="center">
          <Heading size="md" color={textColor} fontWeight="bold" textAlign="center" noOfLines={2} maxW="90%">
            {project.name}
          </Heading>
        </Box>
        <HStack justify="center" spacing={4}>
          <Badge
            colorScheme={project.status === "Approved" ? "green" : project.status === "Rejected" ? "red" : "yellow"}
            px={3}
            py={1}
            rounded="full"
            fontSize="sm"
            fontFamily="Poppins, sans-serif"
          >
            {project.status}
          </Badge>
          <Badge
            colorScheme={project.type === "Crowdfunding" ? "teal" : "yellow"}
            variant="outline"
            px={3}
            py={1}
            rounded="full"
            display="flex"
            alignItems="center"
            fontSize="sm"
            fontFamily="Poppins, sans-serif"
          >
            {project.type === "Crowdfunding" ? <FaUsers size="14px" style={{ marginRight: "6px" }} /> : <FaGift size="14px" style={{ marginRight: "6px" }} />}
            {project.type}
          </Badge>
        </HStack>
        <Text fontSize="sm" color={subTextColor}>
          Creator: <Text as="a" href={`https://sepolia.etherscan.io/address/${project.creator}`} target="_blank" color="teal.500">{project.creator.slice(0, 6)}...{project.creator.slice(-4)}</Text>
        </Text>
        <Box bg={useColorModeValue("gray.50", "gray.700")} p={4} rounded="lg" flex={1}>
          <VStack spacing={3}>
            <HStack w="full" justify="space-between">
              <Text fontSize="sm" color={subTextColor}>Goal:</Text>
              <HStack minW="100px" justify="flex-end"><FaEthereum /><Text color={textColor}>{parseFloat(project.fundingGoal).toFixed(3)} ETH</Text></HStack>
            </HStack>
            <HStack w="full" justify="space-between">
              <Text fontSize="sm" color={subTextColor}>{project.type === "TreasuryGrant" ? "Treasury Raised" : "Raised"}:</Text>
              <HStack minW="100px" justify="flex-end"><FaEthereum /><Text color={textColor}>{parseFloat(project.amountRaised).toFixed(3)} ETH</Text></HStack>
            </HStack>
            <HStack w="full" justify="space-between">
              <Text fontSize="sm" color={subTextColor}>Crowdfunded:</Text>
              <HStack minW="100px" justify="flex-end"><FaEthereum /><Text color={textColor}>{parseFloat(project.crowdfundedAmount).toFixed(3)} ETH</Text></HStack>
            </HStack>
            <HStack w="full" justify="space-between">
              <Text fontSize="sm" color={subTextColor}>Withdrawn:</Text>
              <HStack minW="100px" justify="flex-end"><FaEthereum /><Text color={textColor}>{parseFloat(project.withdrawnAmount).toFixed(3)} ETH</Text></HStack>
            </HStack>
            <Progress
              value={(parseFloat(project.amountRaised) / parseFloat(project.fundingGoal)) * 100}
              colorScheme="teal"
              size="sm"
              w="full"
              rounded="full"
            />
          </VStack>
        </Box>
        <VStack spacing={2} justify="center">
          <Button
            colorScheme="teal"
            size="sm"
            variant="outline"
            w="full"
            fontWeight="bold"
            borderRadius="full"
            boxShadow="0px 4px 12px rgba(0,0,0,0.1)"
            fontFamily="Poppins, sans-serif"
            _hover={{ bgGradient: "linear(to-r, teal.400, teal.500)", color: "white", boxShadow: "md", transform: "scale(1.05)" }}
            onClick={() => setSelectedProject(project)}
          >
            Project Details
          </Button>
          {project.creator === address && canWithdraw(project) && (
            <Button
              colorScheme="teal"
              size="sm"
              variant="solid"
              w="full"
              fontWeight="bold"
              borderRadius="full"
              boxShadow="0px 4px 12px rgba(0,0,0,0.1)"
              fontFamily="Poppins, sans-serif"
              _hover={{ bgGradient: "linear(to-r, teal.400, teal.500)", boxShadow: "md", transform: "scale(1.05)" }}
              onClick={() => handleWithdraw(project, project.type === "TreasuryGrant" && parseFloat(project.crowdfundedAmount) > parseFloat(project.crowdfundedWithdrawnAmount))}
            >
              Withdraw
            </Button>
          )}
          {project.creator === address && project.type === "TreasuryGrant" && project.status === "Approved" && (
            <Button
              colorScheme="yellow"
              size="sm"
              variant="solid"
              w="full"
              fontWeight="bold"
              borderRadius="full"
              boxShadow="0px 4px 12px rgba(0,0,0,0.1)"
              fontFamily="Poppins, sans-serif"
              _hover={{ bgGradient: "linear(to-r, yellow.400, yellow.500)", boxShadow: "md", transform: "scale(1.05)" }}
              onClick={() => {
                setMilestoneProject(project);
                setIsMilestoneModalOpen(true);
              }}
            >
              Submit Milestone
            </Button>
          )}
        </VStack>
      </VStack>
    </MotionBox>
  );

  if (loading) {
    return (
      <Flex 
        minH="100vh" 
        align="center" 
        justify="center" 
        bgGradient={bgGradient}
      >
        <Spinner size="xl" color="white" thickness="3px" />
      </Flex>
    );
  }

  return (
    <Flex 
      direction="column" 
      minH="100vh" 
      bgGradient={bgGradient}
    >
      <Container maxW="container.xl" py={24} textAlign="center">
        <MotionBox initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, ease: "easeOut" }}>
          <Heading 
            as="h1" 
            size={{ base: "xl", md: "3xl" }} 
            fontWeight="extrabold" 
            color="white" 
            textShadow="0 4px 6px rgba(0, 0, 0, 0.8)" 
            fontFamily="Poppins, sans-serif" 
            mb={4}
          >
            Your Project Dashboard
          </Heading>
          <Text 
            fontSize={{ base: "md", md: "lg" }} 
            color="white" 
            fontWeight="semibold" 
            maxW="800px" 
            mx="auto" 
            textShadow="0 2px 4px rgba(0, 0, 0, 0.8)"
          >
            Track your contributions, projects, and community impact in real-time.
          </Text>
        </MotionBox>

        <VStack spacing={8} align="stretch" mt={10}>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
            <StatCard title="Wallet Balance" value={`${parseFloat(walletBalance).toLocaleString()} ETH`} icon={<FaEthereum color="teal.600" />} />
            <StatCard title="Creova Treasury" value={`${parseFloat(daoTreasuryBalance).toLocaleString()} ETH`} icon={<FaEthereum color="teal.600" />} />
            <StatCard title="Available Treasury" value={`${parseFloat(availableTreasuryFunds).toLocaleString()} ETH`} icon={<FaEthereum color="teal.600" />} />
            <StatCard title="Your Contributions" value={`${parseFloat(userContributions).toLocaleString()} ETH`} icon={<FaEthereum color="teal.600" />} />
          </SimpleGrid>

          <HStack spacing={4} flexWrap="wrap" justify="center">
            <Button
              colorScheme="teal"
              size="md"
              rounded="lg"
              px={6}
              onClick={() => router.push("/funding")}
            >
              Create Campaign
            </Button>
            {!isKYCVerified && (
              <Button
                colorScheme="teal"
                size="md"
                rounded="lg"
                px={6}
                onClick={handleKYCVerification}
                isLoading={loading}
              >
                Get KYC Verified
              </Button>
            )}
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              w={{ base: "full", md: "200px" }}
              bg={cardBg}
              rounded="lg"
              size="md"
              color={textColor}
            >
              <option value="all">All Types</option>
              <option value="Crowdfunding">Crowdfunding</option>
              <option value="TreasuryGrant">Treasury Grant</option>
            </Select>
            <InputGroup w={{ base: "full", md: "300px" }}>
              <Input
                placeholder="Search your projects..."
                onChange={(e) => handleSearchChange(e.target.value)}
                bg={cardBg}
                rounded="lg"
                color={textColor}
                _focus={{ borderColor: "teal.400" }}
              />
              <InputRightElement>{isSearching && <Spinner size="sm" color="teal.500" />}</InputRightElement>
            </InputGroup>
            <Button
              colorScheme="teal"
              size="md"
              rounded="lg"
              px={6}
              onClick={refreshData}
              isLoading={loading}
            >
              Refresh
            </Button>
          </HStack>

          <Box textAlign="left">
            <HStack spacing={2} mb={4}>
              <Heading size="md" color="white">Your Projects</Heading>
              <Badge colorScheme={isKYCVerified ? "green" : "red"} variant="solid" px={2} py={1} rounded="full">
                KYC: {isKYCVerified ? "Verified" : "Not Verified"}
              </Badge>
            </HStack>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {searchedProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </SimpleGrid>
            {searchedProjects.length === 0 && (
              <Text color="white" textAlign="center" py={4}>
                No projects found. Start creating with Creova today!
              </Text>
            )}
          </Box>

          <Text fontSize="sm" color="white" textAlign="center">Last Updated: {lastUpdated}</Text>
        </VStack>
      </Container>

      {/* Project Details Modal */}
      <Modal isOpen={!!selectedProject} onClose={() => setSelectedProject(null)} size="xl">
        <ModalOverlay />
        <ModalContent rounded="xl" bg={cardBg}>
          <ModalHeader textAlign="center" color={textColor}>{selectedProject?.name || "Project Details"}</ModalHeader>
          <ModalBody>
            <VStack align="stretch" spacing={6}>
              <Box bg={useColorModeValue("gray.50", "gray.700")} p={4} rounded="lg">
                <Text fontSize="sm" color={subTextColor} mb={2}>Description:</Text>
                <Text color={textColor}>{selectedProject?.description}</Text>
                <Text fontSize="sm" color={subTextColor} mt={2}>Deadline: {selectedProject?.deadline}</Text>
                {selectedProject?.emergencyOverride && (
                  <Text fontSize="sm" color="teal.500" mt={2}>Emergency Withdrawal Override: Enabled</Text>
                )}
              </Box>
              <Accordion allowToggle>
                <AccordionItem>
                  <AccordionButton><Box flex="1" textAlign="left" color={textColor}>Funding Timeline</Box><AccordionIcon /></AccordionButton>
                  <AccordionPanel pb={4}>
                    {selectedProject?.fundingEvents.map((e, i) => (
                      <HStack key={i} spacing={3} py={2}>
                        <Box w="8px" h="8px" bg="teal.500" rounded="full" />
                        <Text flex={1} color={textColor}>{e.funder.slice(0, 6)}... funded {e.amount} ETH</Text>
                        <Text fontSize="sm" color={subTextColor}>{e.timestamp}</Text>
                      </HStack>
                    ))}
                  </AccordionPanel>
                </AccordionItem>
                <AccordionItem>
                  <AccordionButton><Box flex="1" textAlign="left" color={textColor}>Withdrawal History</Box><AccordionIcon /></AccordionButton>
                  <AccordionPanel pb={4}>
                    {selectedProject?.withdrawalEvents.map((e, i) => (
                      <HStack key={i} spacing={3} py={2}>
                        <Box w="8px" h="8px" bg="teal.500" rounded="full" />
                        <Text flex={1} color={textColor}>Creator withdrew {e.amount} ETH</Text>
                        <Text fontSize="sm" color={subTextColor}>{e.timestamp}</Text>
                      </HStack>
                    ))}
                  </AccordionPanel>
                </AccordionItem>
                <AccordionItem>
                  <AccordionButton><Box flex="1" textAlign="left" color={textColor}>Milestones</Box><AccordionIcon /></AccordionButton>
                  <AccordionPanel pb={4}>
                    {selectedProject?.milestones.map((m, i) => (
                      <VStack key={i} spacing={3} py={2} align="stretch">
                        <HStack spacing={3}>
                          <Box w="8px" h="8px" bg={m.completed ? "teal.500" : m.rejectedAt ? "red.500" : "gray.300"} rounded="full" />
                          <Text flex={1} color={textColor}>{m.title} - {m.amount} ETH</Text>
                          <Text fontSize="sm" color={subTextColor}>{m.completedAt}</Text>
                        </HStack>
                        {m.proofCID && <Text fontSize="sm" color="teal.500"><a href={`https://ipfs.io/ipfs/${m.proofCID}`} target="_blank">View Proof</a></Text>}
                        {selectedProject.creator === address && selectedProject.type === "TreasuryGrant" && !m.completed && (!m.rejectedAt || m.canResubmit) && (
                          <HStack>
                            <Input placeholder="Proof CID" id={`proof-${i}`} color={textColor} />
                            <Button size="sm" onClick={() => handleSubmitProof(selectedProject.id, i, document.getElementById(`proof-${i}`).value)}>Submit Proof</Button>
                          </HStack>
                        )}
                        {m.rejectedAt && <Text fontSize="sm" color="red.500">Rejected: {m.rejectedAt}{m.canResubmit ? " (Resubmittable)" : ""}</Text>}
                      </VStack>
                    ))}
                  </AccordionPanel>
                </AccordionItem>
                <AccordionItem>
                  <AccordionButton><Box flex="1" textAlign="left" color={textColor}>Top Contributors</Box><AccordionIcon /></AccordionButton>
                  <AccordionPanel pb={4}>
                    {selectedProject?.contributors.slice(0, 3).map((c, i) => (
                      <HStack key={i} spacing={3} py={2}>
                        <FaUser color="teal.500" />
                        <Text flex={1} color={textColor}>{c.address.slice(0, 6)}...{c.address.slice(-4)}</Text>
                        <Text color={textColor}>{parseFloat(c.amount).toLocaleString()} ETH</Text>
                      </HStack>
                    ))}
                    {selectedProject?.contributors.length > 3 && <Text fontSize="sm" color={subTextColor} mt={2}>+{selectedProject.contributors.length - 3} more</Text>}
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
              {selectedProject?.projectCID && (
                <Button variant="link" colorScheme="teal" as="a" href={`https://ipfs.io/ipfs/${selectedProject.projectCID}`} target="_blank" mt={4}>
                  View Full Project Details
                </Button>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" onClick={() => setSelectedProject(null)} rounded="md">Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Milestone Submission Modal */}
      <Modal isOpen={isMilestoneModalOpen} onClose={() => setIsMilestoneModalOpen(false)} size="md">
        <ModalOverlay />
        <ModalContent rounded="xl" bg={cardBg}>
          <ModalHeader textAlign="center" color={textColor}>Submit Milestone Proof</ModalHeader>
          <ModalBody>
            <VStack spacing={4}>
              <Text color={textColor}>Submit proof for {milestoneProject?.name}</Text>
              <Select
                placeholder="Select Milestone"
                value={selectedMilestoneIndex}
                onChange={(e) => setSelectedMilestoneIndex(e.target.value)}
                bg={cardBg}
                rounded="lg"
                color={textColor}
              >
                {milestoneProject?.milestones
                  .filter(m => !m.completed && (!m.rejectedAt || m.canResubmit))
                  .map(m => (
                    <option key={m.index} value={m.index}>
                      Milestone {m.index + 1} - {m.title}
                    </option>
                  ))}
              </Select>
              <Button
                as="label"
                colorScheme="teal"
                variant="outline"
                leftIcon={<FaFileUpload />}
                size="md"
                fontFamily="Poppins, sans-serif"
                _hover={{ bgGradient: "linear(to-r, teal.400, teal.500)", color: "white" }}
              >
                Upload Proof
                <input type="file" hidden onChange={handleProofFileChange} />
              </Button>
              {proofFile && <Text fontSize="sm" color={textColor}>{proofFile.name}</Text>}
              {proofCID && <Text fontSize="sm" color="teal.500">CID: {proofCID}</Text>}
            </VStack>
          </ModalBody>
          <ModalFooter justifyContent="center">
            <Button
              colorScheme="teal"
              onClick={handleMilestoneSubmit}
              isLoading={loading}
              isDisabled={!proofCID || selectedMilestoneIndex === ""}
            >
              Submit Proof
            </Button>
            <Button variant="ghost" ml={3} onClick={() => setIsMilestoneModalOpen(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Success Modal */}
      <Modal isOpen={isSuccessModalOpen} onClose={() => setIsSuccessModalOpen(false)} isCentered size="md">
        <ModalOverlay />
        <ModalContent rounded="xl" bg={cardBg}>
          <ModalHeader color="teal.600" fontFamily="Poppins, sans-serif">Congratulations!</ModalHeader>
          <ModalBody>
            <VStack spacing={4}>
              <Text fontSize="lg" color={textColor}>You have successfully completed your action!</Text>
              <Text fontSize="md" color="teal.500" fontWeight="bold">Time to make an impact!</Text>
              <Spinner size="sm" color="teal.500" />
              <Text fontSize="sm" color={subTextColor}>Page will refresh automatically...</Text>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Footer />
    </Flex>
  );
}