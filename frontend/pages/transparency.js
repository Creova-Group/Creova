import { useEffect, useState, useMemo, useCallback } from "react";
import { ethers } from "ethers";
import {
  Box, Heading, Text, Container, SimpleGrid, Flex, Badge, Button, Spinner, Progress,
  VStack, HStack, Input, InputGroup, InputRightElement, Stat, StatLabel, StatNumber,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter,
  Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Select,
  Tooltip, Alert, AlertIcon, useColorModeValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import {
  FaEthereum, FaUsers, FaProjectDiagram, FaMoneyBillWave, FaCalendarAlt, FaUser, FaGift,
} from "react-icons/fa";
import { getFundingPoolContract, CONTRACT_ADDRESS } from "../lib/getFundingPoolContract";
import Footer from "../components/Footer";

const MotionBox = motion(Box);

const formatETH = (wei) => {
  return Number(ethers.formatEther(wei)).toFixed(3);
};

export default function Transparency() {
  const [contractData, setContractData] = useState({
    daoTreasuryBalance: "0.000",
    totalRaised: "0.000",
    totalFeesRaised: "0.000",
    activeProjects: 0,
    newCampaigns: 0,
    quarterlyTreasuryLimit: "0.000",
    quarterlyFundsUsed: "0.000",
    totalTreasuryFunded: "0.000",
    totalTreasuryFundedProjects: 0,
  });
  const [projects, setProjects] = useState([]);
  const [recentEvents, setRecentEvents] = useState([]);
  const [uiState, setUiState] = useState({
    loading: true,
    lastUpdated: null,
    searchQuery: "",
    fundingTypeFilter: "All",
    statusFilter: "All",
    isSearching: false,
    selectedProject: null,
    error: null,
  });

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

  const fetchTransparencyData = useCallback(async () => {
    if (!window.ethereum) {
      setUiState((prev) => ({ ...prev, loading: false, error: "Please install MetaMask to view data." }));
      return;
    }

    setUiState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const fundingContract = getFundingPoolContract(provider);

      const treasuryBalanceWei = await provider.getBalance(CONTRACT_ADDRESS);
      const quarterlyLimitWei = await fundingContract.getAvailableTreasuryFunds();
      const quarterlyFundsUsedWei = await fundingContract.quarterlyFundsUsed();

      const campaignCount = Number(await fundingContract.campaignIds()) || 0;
      const loadedProjects = [];
      let totalRaisedWei = ethers.parseEther("0");
      let totalFeesWei = ethers.parseEther("0");
      let totalTreasuryFundedWei = ethers.parseEther("0");
      let activeCount = 0;
      let treasuryFundedProjects = 0;
      const thirtyDaysAgo = Math.floor(Date.now() / 1000) - 30 * 24 * 60 * 60;
      let newCampaignCount = 0;
      const allEvents = [];

      const fundingFilter = fundingContract.filters.ProjectFunded();
      const fundingEvents = await fundingContract.queryFilter(fundingFilter, -5000, "latest").catch(() => []);
      fundingEvents.forEach((event) => {
        totalFeesWei = totalFeesWei + BigInt(event.args.treasuryFee || 0);
        allEvents.push({
          type: "Project Funded",
          name: `Campaign ${event.args.campaignId}`,
          timestamp: new Date(Number(event.args.timestamp || 0) * 1000).toLocaleString(),
        });
      });

      for (let i = 1; i <= campaignCount; i++) {
        const campaign = await fundingContract.campaigns(i).catch(() => null);
        if (!campaign) continue;

        const milestonesData = await fundingContract.getCampaignMilestones(i).catch(() => []);
        const contributorsList = await fundingContract.getContributors(i).catch(() => []);

        const statusNum = Number(campaign.status);
        if (statusNum === 1) activeCount++;
        if (Number(campaign.createdAt || 0) >= thirtyDaysAgo) newCampaignCount++;
        if (campaign.fundingType.toString() === "1" && statusNum === 1) {
          treasuryFundedProjects++;
          totalTreasuryFundedWei = totalTreasuryFundedWei + BigInt(campaign.amountRaised || 0);
        }

        totalRaisedWei = totalRaisedWei + BigInt(campaign.amountRaised || 0) + BigInt(campaign.crowdfundedAmount || 0);

        const milestones = milestonesData.map((m) => ({
          title: m.description,
          amount: formatETH(m.amount),
          completed: m.completed,
          completedAt: m.completedAt.toString() ? new Date(Number(m.completedAt) * 1000).toLocaleString() : "",
          proofCID: m.proofCID,
          rejectedAt: m.rejectedAt.toString() ? new Date(Number(m.rejectedAt) * 1000).toLocaleString() : "",
        }));

        const contributors = await Promise.all(
          contributorsList.map(async (addr) => {
            const contributionWei = await fundingContract.getUserContribution(i, addr).catch(() => 0n);
            return { address: addr, amount: formatETH(contributionWei) };
          })
        ).then((list) => list.sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount)));

        const deadline = campaign.fundingType.toString() === "0"
          ? new Date(Number(campaign.deadline) * 1000).toLocaleString()
          : new Date(Number(campaign.applicationExpiry) * 1000).toLocaleString();

        const project = {
          id: i,
          name: campaign.name?.toString() || "Unnamed Project",
          creator: campaign.creator || ethers.ZeroAddress,
          status: ["Pending", "Approved", "Rejected"][statusNum] || "Pending",
          type: campaign.fundingType?.toString() === "0" ? "Crowdfunding" : "TreasuryGrant",
          fundingGoal: formatETH(campaign.fundingGoal || 0),
          amountRaised: formatETH(campaign.amountRaised || 0),
          crowdfundedAmount: formatETH(campaign.crowdfundedAmount || 0),
          withdrawnAmount: formatETH(campaign.withdrawnAmount || 0),
          crowdfundedWithdrawnAmount: formatETH(campaign.crowdfundedWithdrawnAmount || 0),
          projectCID: campaign.projectCID?.toString() || "",
          heroMediaCID: campaign.heroMediaCID?.toString() || "",
          description: campaign.description?.toString() || "No description available",
          createdAt: campaign.createdAt ? new Date(Number(campaign.createdAt) * 1000).toLocaleString() : new Date().toLocaleString(),
          deadline,
          milestones,
          contributors,
          fundingEvents: [],
          withdrawalEvents: [],
        };

        const projectFundingEvents = await fundingContract.queryFilter(fundingContract.filters.ProjectFunded(i), -5000, "latest").catch(() => []);
        const withdrawalEvents = await fundingContract.queryFilter(fundingContract.filters.FundsWithdrawn(i), -5000, "latest").catch(() => []);
        const milestoneCompletedEvents = await fundingContract.queryFilter(fundingContract.filters.MilestoneCompleted(i), -5000, "latest").catch(() => []);
        const milestoneProofEvents = await fundingContract.queryFilter(fundingContract.filters.MilestoneProofSubmitted(i), -5000, "latest").catch(() => []);
        const milestoneRejectedEvents = await fundingContract.queryFilter(fundingContract.filters.MilestoneRejected(i), -5000, "latest").catch(() => []);
        const treasuryGrantEvents = await fundingContract.queryFilter(fundingContract.filters.TreasuryGrantFunded(i), -5000, "latest").catch(() => []);

        project.fundingEvents = projectFundingEvents.map((e) => ({
          funder: e.args.funder || ethers.ZeroAddress,
          amount: formatETH(e.args.amount || 0),
          treasuryFee: formatETH(e.args.treasuryFee || 0),
          timestamp: new Date(Number(e.args.timestamp || 0) * 1000).toLocaleString(),
        }));
        project.withdrawalEvents = withdrawalEvents.map((e) => ({
          creator: e.args.creator || ethers.ZeroAddress,
          amount: formatETH(e.args.amount || 0),
          timestamp: new Date(Number(e.blockTimestamp || 0) * 1000).toLocaleString(),
        }));

        loadedProjects.push(project);
        allEvents.push({ type: "Campaign Created", name: project.name, timestamp: project.createdAt });
        project.fundingEvents.forEach((e) => allEvents.push({ type: "Project Funded", name: project.name, timestamp: e.timestamp }));
        project.withdrawalEvents.forEach((e) => allEvents.push({ type: "Funds Withdrawn", name: project.name, timestamp: e.timestamp }));
        milestoneCompletedEvents.forEach((e) => allEvents.push({ type: "Milestone Completed", name: project.name, timestamp: new Date(Number(e.args.completedAt) * 1000).toLocaleString() }));
        milestoneProofEvents.forEach((e) => allEvents.push({ type: "Milestone Proof Submitted", name: project.name, timestamp: new Date(Number(e.blockTimestamp) * 1000).toLocaleString() }));
        milestoneRejectedEvents.forEach((e) => allEvents.push({ type: "Milestone Rejected", name: project.name, timestamp: new Date(Number(e.args.rejectedAt) * 1000).toLocaleString() }));
        treasuryGrantEvents.forEach((e) => allEvents.push({ type: "Treasury Grant Funded", name: project.name, timestamp: new Date(Number(e.blockTimestamp) * 1000).toLocaleString() }));
      }

      setContractData({
        daoTreasuryBalance: formatETH(treasuryBalanceWei),
        totalRaised: formatETH(totalRaisedWei),
        totalFeesRaised: formatETH(totalFeesWei),
        activeProjects: activeCount,
        newCampaigns: newCampaignCount,
        quarterlyTreasuryLimit: formatETH(quarterlyLimitWei),
        quarterlyFundsUsed: formatETH(quarterlyFundsUsedWei),
        totalTreasuryFunded: formatETH(totalTreasuryFundedWei),
        totalTreasuryFundedProjects: treasuryFundedProjects,
      });
      setProjects(loadedProjects);
      setRecentEvents(allEvents.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 5));
      setUiState((prev) => ({ ...prev, lastUpdated: new Date().toLocaleString() }));
    } catch (error) {
      console.error("Error loading transparency data:", error);
      setUiState((prev) => ({ ...prev, error: "Failed to load data. Please try again later." }));
    } finally {
      setUiState((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  useEffect(() => {
    fetchTransparencyData();
    return () => {};
  }, [fetchTransparencyData]);

  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setUiState((prev) => ({ ...prev, isSearching: true }));
    const timer = setTimeout(() => {
      setUiState((prev) => ({ ...prev, searchQuery: value || "", isSearching: false }));
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const searchedProjects = useMemo(() => {
    let filtered = projects;
    if (uiState.searchQuery) {
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(uiState.searchQuery.toLowerCase()));
    }
    if (uiState.fundingTypeFilter !== "All") {
      filtered = filtered.filter((p) => p.type === uiState.fundingTypeFilter);
    }
    if (uiState.statusFilter !== "All") {
      filtered = filtered.filter((p) => p.status === uiState.statusFilter);
    }
    return filtered;
  }, [projects, uiState.searchQuery, uiState.fundingTypeFilter, uiState.statusFilter]);

  const StatCard = ({ title, value, icon, tooltip }) => (
    <MotionBox
      bg={cardBg}
      p={5}
      rounded="xl"
      boxShadow={shadow}
      transition="all 0.2s"
      _hover={{ shadow: useColorModeValue("lg", "0 6px 8px rgba(255, 255, 255, 0.15)") }}
      initial={uiState.loading ? { scale: 0.95, opacity: 0.8 } : {}}
      animate={uiState.loading ? { scale: 1, opacity: 1 } : {}}
      key={title}
    >
      <Stat textAlign="center">
        <Tooltip label={tooltip} placement="top">
          <StatLabel color={subTextColor} fontSize="md" fontWeight="bold">{title}</StatLabel>
        </Tooltip>
        <HStack mt={2} justify="center">
          {icon}
          <StatNumber color="teal.600" fontSize="xl" fontWeight="bold">{value}</StatNumber>
        </HStack>
      </Stat>
    </MotionBox>
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
      minH="460px"
    >
      <VStack align="stretch" spacing={4}>
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
              <HStack minW="100px" justify="flex-end"><FaEthereum /><Text color={textColor}>{project.fundingGoal}</Text></HStack>
            </HStack>
            <HStack w="full" justify="space-between">
              <Text fontSize="sm" color={subTextColor}>Treasury:</Text>
              <HStack minW="100px" justify="flex-end"><FaEthereum /><Text color={textColor}>{project.type === "TreasuryGrant" ? project.amountRaised : "0.000"}</Text></HStack>
            </HStack>
            <HStack w="full" justify="space-between">
              <Text fontSize="sm" color={subTextColor}>Crowdfunded:</Text>
              <HStack minW="100px" justify="flex-end"><FaEthereum /><Text color={textColor}>{project.type === "Crowdfunding" ? project.amountRaised : project.crowdfundedAmount}</Text></HStack>
            </HStack>
            <HStack w="full" justify="space-between">
              <Text fontSize="sm" color={subTextColor}>Withdrawn:</Text>
              <HStack minW="100px" justify="flex-end"><FaEthereum /><Text color={textColor}>{project.withdrawnAmount}</Text></HStack>
            </HStack>
            <Progress
              value={(parseFloat(project.amountRaised) + parseFloat(project.crowdfundedAmount)) / parseFloat(project.fundingGoal) * 100}
              colorScheme="teal"
              size="sm"
              w="full"
              rounded="full"
            />
          </VStack>
        </Box>
        <Button
          colorScheme="teal"
          size="md"
          variant="outline"
          w="220px"
          alignSelf="center"
          fontWeight="bold"
          borderRadius="full"
          boxShadow="0px 4px 12px rgba(0,0,0,0.1)"
          fontFamily="Poppins, sans-serif"
          _hover={{ bgGradient: "linear(to-r, teal.400, teal.500)", color: "white", boxShadow: "md", transform: "scale(1.05)" }}
          onClick={() => setUiState((prev) => ({ ...prev, selectedProject: project }))}
        >
          Project Details
        </Button>
      </VStack>
    </MotionBox>
  );

  if (uiState.loading && !uiState.error) {
    return (
      <Flex minH="100vh" align="center" justify="center" bgGradient={bgGradient}>
        <MotionBox initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8 }}>
          <Spinner size="xl" color="white" thickness="3px" />
        </MotionBox>
      </Flex>
    );
  }

  return (
    <Flex direction="column" minH="100vh" bgGradient={bgGradient}>
      <Container maxW="container.xl" py={24} textAlign="center">
        <MotionBox initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, ease: "easeOut" }}>
          <Heading 
            as="h1" 
            size={{ base: "xl", md: "3xl" }} 
            fontWeight="extrabold" 
            color="white" 
            textShadow="0 4px 6px rgba(0, 0, 0, 0.8)" 
            mb={4}
          >
            Creova Transparency Dashboard
          </Heading>
          <Text 
            fontSize={{ base: "md", md: "lg" }} 
            color="white" 
            fontWeight="semibold" 
            maxW="800px" 
            mx="auto" 
            textShadow="0 2px 4px rgba(0, 0, 0, 0.8)"
          >
            A transparent view into Creova’s decentralised funding ecosystem.
          </Text>
        </MotionBox>

        {/* Short Explainer Added Here */}
        <Text 
          fontSize={{ base: "sm", md: "md" }} 
          color="white" 
          fontWeight="medium" 
          maxW="600px" 
          mx="auto" 
          mt={4} 
          mb={6} 
          textShadow="0 2px 4px rgba(0, 0, 0, 0.8)"
        >
          All funding activity on Creova is recorded on-chain. This dashboard shows real-time data from our smart contracts and treasury.
        </Text>

        {uiState.error && (
          <Alert status="error" mt={4} rounded="md" bg={cardBg}>
            <AlertIcon />
            <Text color={textColor}>{uiState.error}</Text>
          </Alert>
        )}

        <VStack spacing={8} align="stretch" mt={10}>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
            <StatCard
              title="Creova Treasury Balance"
              value={contractData.daoTreasuryBalance}
              icon={<FaEthereum color="teal.600" />}
              tooltip="Current ETH balance in the Creova treasury"
            />
            <StatCard
              title="Total Funds Raised"
              value={contractData.totalRaised}
              icon={<FaEthereum color="teal.600" />}
              tooltip="Total ETH raised from all funding types"
            />
            <StatCard
              title="Active Projects"
              value={contractData.activeProjects.toLocaleString()}
              icon={<FaProjectDiagram color="teal.600" />}
              tooltip="Number of currently active projects"
            />
            <StatCard
              title="Total Creova Fees"
              value={contractData.totalFeesRaised}
              icon={<FaMoneyBillWave color="teal.600" />}
              tooltip="Total ETH fees collected by Creova"
            />
            <StatCard
              title="Quarterly Treasury Max Limit"
              value={contractData.quarterlyTreasuryLimit}
              icon={<FaEthereum color="teal.600" />}
              tooltip="Available ETH limit for quarterly treasury funding"
            />
            <StatCard
              title="Treasury Limit Used"
              value={contractData.quarterlyFundsUsed}
              icon={<FaEthereum color="teal.600" />}
              tooltip="ETH used from quarterly treasury limit"
            />
            <StatCard
              title="Total Treasury Funded"
              value={contractData.totalTreasuryFunded}
              icon={<FaEthereum color="teal.600" />}
              tooltip="All-time ETH funded from treasury to approved projects"
            />
            <StatCard
              title="Total Treasury Funded Projects"
              value={contractData.totalTreasuryFundedProjects.toLocaleString()}
              icon={<FaProjectDiagram color="teal.600" />}
              tooltip="Total number of approved treasury-funded projects"
            />
          </SimpleGrid>

          <HStack spacing={4} flexWrap="wrap" justify="center">
            <Select
              value={uiState.fundingTypeFilter}
              onChange={(e) => setUiState((prev) => ({ ...prev, fundingTypeFilter: e.target.value }))}
              w={{ base: "full", md: "200px" }}
              bg={cardBg}
              rounded="full"
              size="md"
              color={textColor}
            >
              <option value="All">Project Types</option>
              <option value="Crowdfunding">Crowdfunding</option>
              <option value="TreasuryGrant">Treasury Grant</option>
            </Select>
            <Select
              value={uiState.statusFilter}
              onChange={(e) => setUiState((prev) => ({ ...prev, statusFilter: e.target.value }))}
              w={{ base: "full", md: "200px" }}
              bg={cardBg}
              rounded="full"
              size="md"
              color={textColor}
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </Select>
            <InputGroup w={{ base: "full", md: "300px" }}>
              <Input
                placeholder="Search projects..."
                onChange={handleSearchChange}
                bg={cardBg}
                rounded="full"
                color={textColor}
                _focus={{ borderColor: "teal.400" }}
              />
              <InputRightElement>{uiState.isSearching && <Spinner size="sm" color="teal.500" />}</InputRightElement>
            </InputGroup>
            <Button
              colorScheme="teal"
              size="md"
              rounded="full"
              px={6}
              fontWeight="bold"
              fontFamily="Poppins, sans-serif"
              boxShadow="0px 4px 12px rgba(0,0,0,0.1)"
              _hover={{ bgGradient: "linear(to-r, teal.400, teal.500)", boxShadow: "md", transform: "scale(1.05)" }}
              onClick={fetchTransparencyData}
              isLoading={uiState.loading}
            >
              Refresh
            </Button>
            <Button
              colorScheme="teal"
              size="md"
              rounded="full"
              px={6}
              fontWeight="bold"
              fontFamily="Poppins, sans-serif"
              boxShadow="0px 4px 12px rgba(0,0,0,0.1)"
              _hover={{ bgGradient: "linear(to-r, teal.400, teal.500)", boxShadow: "md", transform: "scale(1.05)" }}
              onClick={() => {
                const data = JSON.stringify({ ...contractData, projects });
                const blob = new Blob([data], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = "creova_transparency_data.json";
                link.click();
                URL.revokeObjectURL(url);
              }}
            >
              Download Data
            </Button>
          </HStack>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {searchedProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </SimpleGrid>

          {searchedProjects.length === 0 && (
            <Text color="white" textAlign="center" py={4}>
              No projects found matching your search.
            </Text>
          )}

          <Box py={8}>
            <Heading 
              size="lg" 
              color="white" 
              mb={4} 
              fontWeight="extrabold" 
              textShadow="0 3px 3px rgba(0, 0, 0, 0.8)"
            >
              Recent Activity
            </Heading>
            <Box bg={cardBg} p={6} rounded="xl" shadow={shadow}>
              <VStack align="stretch" spacing={4}>
                {recentEvents.map((event, i) => (
                  <HStack key={i} spacing={3}>
                    <Box w="8px" h="8px" bg="teal.500" rounded="full" />
                    <Text flex={1} fontSize="sm" color={textColor}>{event.type}: {event.name}</Text>
                    <Text fontSize="sm" color={subTextColor}>{event.timestamp}</Text>
                  </HStack>
                ))}
              </VStack>
            </Box>
          </Box>

          <Text fontSize="sm" color={useColorModeValue("gray.900", "white")} textAlign="center">
            Last Updated: {uiState.lastUpdated}
          </Text>
        </VStack>
      </Container>

      <Modal isOpen={!!uiState.selectedProject} onClose={() => setUiState((prev) => ({ ...prev, selectedProject: null }))} size="xl">
        <ModalOverlay />
        <ModalContent rounded="xl" bg={cardBg}>
          <ModalHeader color={textColor}>{uiState.selectedProject?.name || "Project Details"}</ModalHeader>
          <ModalBody>
            <VStack align="stretch" spacing={6}>
              <Box bg={useColorModeValue("gray.50", "gray.700")} p={4} rounded="lg">
                <Text fontSize="sm" color={subTextColor} mb={2}>Description:</Text>
                <Text color={textColor}>{uiState.selectedProject?.description}</Text>
                <Text fontSize="sm" color={subTextColor} mt={2}>Deadline: {uiState.selectedProject?.deadline}</Text>
              </Box>
              <Accordion allowToggle>
                <AccordionItem>
                  <AccordionButton><Box flex="1" textAlign="left" color={textColor}>Funding Timeline</Box><AccordionIcon /></AccordionButton>
                  <AccordionPanel pb={4}>
                    {uiState.selectedProject?.fundingEvents.map((e, i) => (
                      <VStack key={i} spacing={1} py={2} align="stretch">
                        <HStack spacing={3}>
                          <Box w="8px" h="8px" bg="teal.500" rounded="full" />
                          <Text flex={1} color={textColor}>{e.funder.slice(0, 6)}... funded {e.amount} ETH</Text>
                          <Text fontSize="sm" color={subTextColor}>{e.timestamp}</Text>
                        </HStack>
                        <Text fontSize="sm" color={subTextColor} ml={5}>Fee: {e.treasuryFee} ETH</Text>
                      </VStack>
                    ))}
                  </AccordionPanel>
                </AccordionItem>
                <AccordionItem>
                  <AccordionButton><Box flex="1" textAlign="left" color={textColor}>Withdrawal History</Box><AccordionIcon /></AccordionButton>
                  <AccordionPanel pb={4}>
                    {uiState.selectedProject?.withdrawalEvents.map((e, i) => (
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
                    {uiState.selectedProject?.milestones.map((m, i) => (
                      <VStack key={i} spacing={2} py={2} align="stretch">
                        <HStack spacing={3}>
                          <Box w="8px" h="8px" bg={m.completed ? "teal.500" : m.rejectedAt ? "red.500" : "gray.300"} rounded="full" />
                          <Text flex={1} color={textColor}>{m.title} - {m.amount} ETH</Text>
                          <Text fontSize="sm" color={subTextColor}>{m.completedAt || "Pending"}</Text>
                        </HStack>
                        {m.proofCID && (
                          <Text fontSize="sm" as="a" href={`https://ipfs.io/ipfs/${m.proofCID}`} target="_blank" color="teal.500">
                            Proof: {m.proofCID.slice(0, 10)}...
                          </Text>
                        )}
                        {m.rejectedAt && <Text fontSize="sm" color="red.500">Rejected: {m.rejectedAt}</Text>}
                      </VStack>
                    ))}
                  </AccordionPanel>
                </AccordionItem>
                <AccordionItem>
                  <AccordionButton><Box flex="1" textAlign="left" color={textColor}>Top Contributors</Box><AccordionIcon /></AccordionButton>
                  <AccordionPanel pb={4}>
                    {uiState.selectedProject?.contributors.slice(0, 3).map((c, i) => (
                      <HStack key={i} spacing={3} py={2}>
                        <FaUser color="teal.500" />
                        <Text flex={1} color={textColor}>{c.address.slice(0, 6)}...{c.address.slice(-4)}</Text>
                        <Text color={textColor}>{c.amount} ETH</Text>
                      </HStack>
                    ))}
                    {uiState.selectedProject?.contributors.length > 3 && (
                      <Text fontSize="sm" color={subTextColor} mt={2}>+{uiState.selectedProject.contributors.length - 3} more</Text>
                    )}
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
              {uiState.selectedProject?.projectCID && (
                <Button
                  colorScheme="teal"
                  size="md"
                  variant="outline"
                  w="220px"
                  fontWeight="bold"
                  borderRadius="full"
                  boxShadow="0px 4px 12px rgba(0,0,0,0.1)"
                  fontFamily="Poppins, sans-serif"
                  _hover={{ bgGradient: "linear(to-r, teal.400, teal.500)", color: "white", boxShadow: "md", transform: "scale(1.05)" }}
                  as="a"
                  href={`https://ipfs.io/ipfs/${uiState.selectedProject.projectCID}`}
                  target="_blank"
                >
                  View Project Details
                </Button>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="teal"
              size="md"
              fontWeight="bold"
              borderRadius="full"
              boxShadow="0px 4px 12px rgba(0,0,0,0.1)"
              fontFamily="Poppins, sans-serif"
              _hover={{ bgGradient: "linear(to-r, teal.400, teal.500)", color: "white", boxShadow: "md", transform: "scale(1.05)" }}
              onClick={() => setUiState((prev) => ({ ...prev, selectedProject: null }))}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Footer />
    </Flex>
  );
}