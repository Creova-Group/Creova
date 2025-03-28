import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import {
  Box,
  Container,
  Heading,
  Text,
  Spinner,
  Link,
  Button,
  Flex,
  Badge,
  VStack,
  Image,
  useToast,
  Input,
  Progress,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Radio,
  RadioGroup,
  Stack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";
import { getFundingPoolContract } from "../../lib/getFundingPoolContract";
import Footer from "../../components/Footer";
import {
  FaEthereum,
  FaUsers,
  FaGift,
  FaExternalLinkAlt,
  FaTwitter,
  FaDiscord,
  FaFacebook,
  FaLinkedin,
  FaTelegram,
  FaInstagram,
} from "react-icons/fa";

const MotionBox = motion(Box);
const MotionImage = motion(Image);



export default function ProjectDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fundingAmount, setFundingAmount] = useState("");
  const [isFunding, setIsFunding] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [feeOption, setFeeOption] = useState("include"); // "include" or "add"
  const toast = useToast();
  const { address, isConnected } = useAccount();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchProjectDetails = async () => {
    if (!router.isReady || !id || !window.ethereum || !isConnected) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const fundingPoolContract = getFundingPoolContract(signer);

      const campaign = await fundingPoolContract.campaigns(id);
      const milestones = await fundingPoolContract.getCampaignMilestones(id);
      const crowdfundedAmount = await fundingPoolContract.getCrowdfundedAmount(id);
      const deadline = Number(campaign.deadline) > 0 ? new Date(Number(campaign.deadline) * 1000) : null;

      setProject({
        id,
        name: campaign.name,
        creator: campaign.creator,
        type: ["Crowdfunding", "TreasuryGrant"][Number(campaign.fundingType)],
        description: campaign.description || "No description provided.",
        fundingGoal: ethers.formatEther(campaign.fundingGoal),
        amountRaised: ethers.formatEther(campaign.amountRaised || 0),
        crowdfundedAmount: ethers.formatEther(crowdfundedAmount || 0),
        documentCID: campaign.projectCID,
        status: ["Pending", "Approved", "Rejected"][Number(campaign.status)],
        heroMediaCID: campaign.heroMediaCID,
        milestones: milestones.map((m, index) => ({
          title: m.description,
          completed: m.completed,
          amount: ethers.formatEther(m.amount),
          index,
        })),
        deadline: deadline ? deadline.toLocaleDateString() : "No deadline",
      });
    } catch (error) {
      toast({ title: "Error loading project", description: error.message, status: "error" });
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
  }, [router.isReady, id, isConnected, address, toast]);

  const handleFundProject = () => {
    if (!fundingAmount || parseFloat(fundingAmount) <= 0) {
      toast({ title: "Invalid amount", description: "Please enter a valid ETH amount.", status: "warning" });
      return;
    }
    onOpen();
  };

  const calculateFundingValues = () => {
    const amount = parseFloat(fundingAmount);
    const feePercentage = 0.05; // 5% fee as per contract

    if (feeOption === "include") {
      const treasuryFee = amount * feePercentage;
      const projectAmount = amount - treasuryFee;
      const totalAmount = amount;
      return { projectAmount, treasuryFee, totalAmount };
    } else {
      const projectAmount = amount;
      const treasuryFee = amount * feePercentage;
      const totalAmount = amount + treasuryFee;
      return { projectAmount, treasuryFee, totalAmount };
    }
  };

  const confirmFunding = async () => {
    if (!isConnected || !window.ethereum) {
      toast({ title: "Wallet not connected", description: "Please connect your wallet.", status: "warning" });
      return;
    }

    setIsFunding(true);
    toast({ title: "Processing...", description: "Sending your contribution.", status: "info", duration: null });

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const fundingPoolContract = getFundingPoolContract(signer);

      const { totalAmount } = calculateFundingValues();
      const tx = await fundingPoolContract.fundProject(id, {
        value: ethers.parseEther(totalAmount.toString()),
      });
      await tx.wait();

      const { projectAmount } = calculateFundingValues();
      toast.closeAll();
      toast({
        title: "Thank You!",
        description: `Successfully sent ${projectAmount} ETH to ${project.name}${project.type === "TreasuryGrant" ? " (Community Funding)" : ""}!`,
        status: "success",
        duration: 5000,
      });

      // Auto-refresh project data
      await fetchProjectDetails();
      setFundingAmount("");
      onClose();
    } catch (error) {
      toast.closeAll();
      toast({ title: "Funding failed", description: error.message, status: "error" });
    } finally {
      setIsFunding(false);
    }
  };

  if (loading) {
    return (
      <Flex align="center" justify="center" h="100vh" bgGradient="linear(to-br, #14B8A6, #ffffff)">
        <MotionBox
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Spinner size="xl" color="teal.500" thickness="4px" speed="0.65s" />
        </MotionBox>
      </Flex>
    );
  }

  if (!project) {
    return (
      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        minH="100vh"
        bgGradient="linear(to-br, #14B8A6, #ffffff)"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Text fontSize="xl" color="white" fontFamily="Poppins, sans-serif" fontWeight="bold" textShadow="0 2px 4px rgba(0, 0, 0, 0.8)">
          Project not found.
        </Text>
      </MotionBox>
    );
  }

  const { projectAmount, treasuryFee, totalAmount } = fundingAmount ? calculateFundingValues() : { projectAmount: 0, treasuryFee: 0, totalAmount: 0 };

  return (
    <>
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        minH="100vh"
        bgGradient="linear(to-br, #14B8A6, #ffffff)"
        py={20}
        pt={28}
        position="relative"
      >
        <Container maxW="container.md">
          <MotionBox
            bg="white"
            p={8}
            rounded="2xl"
            boxShadow="lg"
            border="2px solid"
            borderColor={project.type === "Crowdfunding" ? "teal.400" : "yellow.400"}
          >
            <VStack align="stretch" spacing={6}>
              <Heading
                size="2xl"
                textAlign="center"
                fontFamily="Poppins, sans-serif"
                fontWeight="extrabold"
                color="gray.900"
                textShadow="0 2px 2px rgba(0, 0, 0, 0.8)"
              >
                {project.name}
              </Heading>

              <Flex justify="space-between" w="100%">
                <Badge
                  colorScheme={project.status === "Approved" ? "green" : "yellow"}
                  px={3}
                  py={1}
                  rounded="full"
                  fontSize="sm"
                  fontFamily="Poppins, sans-serif"
                  boxShadow={project.status === "Approved" ? "0 0 8px rgba(0, 255, 0, 0.3)" : "none"}
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
                  {project.type === "Crowdfunding" ? (
                    <FaUsers size="14px" style={{ marginRight: "6px" }} />
                  ) : (
                    <FaGift size="14px" style={{ marginRight: "6px" }} />
                  )}
                  {project.type}
                </Badge>
              </Flex>

              <MotionImage
                src={project.heroMediaCID ? `https://gateway.pinata.cloud/ipfs/${project.heroMediaCID}` : "/placeholder-project.png"}
                alt={`${project.name} Hero`}
                w="100%"
                h="300px"
                objectFit="cover"
                rounded="lg"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                whileHover={{ scale: 1.02, boxShadow: "md" }}
                transition={{ duration: 0.3 }}
                onError={(e) => (e.target.src = "/placeholder-project.png")}
              />

              <MotionBox
                bg="gray.50"
                p={4}
                rounded="lg"
                border="1px solid"
                borderColor={project.type === "Crowdfunding" ? "teal.400" : "yellow.400"}
                boxShadow="sm"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <VStack align="start" spacing={2}>
                  <Link href={`https://etherscan.io/address/${project.creator}`} isExternal>
                    <HStack spacing={2}>
                      <Text fontFamily="Poppins, sans-serif" fontWeight="medium">
                        <strong>Creator:</strong> {project.creator ? `${project.creator.slice(0, 6)}...${project.creator.slice(-4)}` : "N/A"}
                      </Text>
                      <FaExternalLinkAlt size="12px" color="teal.500" />
                      <Button
                        size="xs"
                        variant="ghost"
                        onClick={() => {
                          navigator.clipboard.writeText(project.creator);
                          toast({ title: "Copied!", status: "success" });
                        }}
                      >
                        Copy
                      </Button>
                    </HStack>
                  </Link>
                  <HStack spacing={2}>
                    <FaEthereum color="gray.700" />
                    <Text fontFamily="Poppins, sans-serif" fontWeight="bold">Goal: {project.fundingGoal} ETH</Text>
                  </HStack>
                  <Text fontFamily="Poppins, sans-serif" fontWeight="medium">
                    <strong>Deadline:</strong> {project.deadline}
                  </Text>
                </VStack>
              </MotionBox>

              <Box>
                <Text fontWeight="bold" fontFamily="Poppins, sans-serif" mb={2}>Description:</Text>
                <Text color="gray.600" fontFamily="Poppins, sans-serif" noOfLines={isExpanded ? 0 : 3}>
                  {project.description}
                </Text>
                <Button
                  size="sm"
                  variant="link"
                  colorScheme="teal"
                  onClick={() => setIsExpanded(!isExpanded)}
                  mt={2}
                  fontFamily="Poppins, sans-serif"
                >
                  {isExpanded ? "Show Less" : "Read More"}
                </Button>
                {project.documentCID && (
                  <Link href={`https://gateway.pinata.cloud/ipfs/${project.documentCID}`} isExternal mt={4} display="block">
                    <Button
                      colorScheme="teal"
                      size="md"
                      variant="outline"
                      fontFamily="Poppins, sans-serif"
                      fontWeight="bold"
                      _hover={{
                        bgGradient: "linear(to-r, teal.400, teal.500)",
                        color: "white",
                        boxShadow: "md",
                      }}
                      transition="all 0.3s ease-in-out"
                    >
                      View Project Details
                    </Button>
                  </Link>
                )}
              </Box>

              {project.type === "TreasuryGrant" && project.milestones.map((milestone, idx) => (
                <MotionBox
                  key={idx}
                  bg="gray.100"
                  rounded="lg"
                  p={4}
                  border="1px solid"
                  borderColor="yellow.400"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                >
                  <Flex justify="space-between">
                    <Text fontWeight="bold" fontFamily="Poppins, sans-serif">{milestone.title}</Text>
                    <Badge
                      colorScheme={milestone.completed ? "green" : "yellow"}
                      px={2}
                      py={1}
                      rounded="full"
                    >
                      {milestone.completed ? "Completed" : "Pending"}
                    </Badge>
                  </Flex>
                  <Text fontFamily="Poppins, sans-serif">Amount: {milestone.amount} ETH</Text>
                  <Progress
                    value={milestone.completed ? 100 : 0}
                    size="xs"
                    colorScheme="teal"
                    rounded="full"
                    mt={2}
                  />
                </MotionBox>
              ))}

              <MotionBox
                bg="gray.50"
                p={4}
                rounded="lg"
                border="1px solid"
                borderColor={project.type === "Crowdfunding" ? "teal.400" : "yellow.400"}
                boxShadow="sm"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Text fontWeight="bold" fontFamily="Poppins, sans-serif" mb={2}>
                  {project.type === "Crowdfunding" ? "Funding Progress" : "Treasury Funding"}
                </Text>
                <Progress
                  value={(project.amountRaised / project.fundingGoal) * 100 || 0}
                  colorScheme="teal"
                  size="md"
                  rounded="full"
                  bg="gray.200"
                  border="1px solid"
                  borderColor="teal.200"
                />
                <HStack spacing={2} justify="center" mt={2}>
                  <FaEthereum color="gray.700" />
                  <Text
                    fontSize="md"
                    color="gray.700"
                    fontWeight="bold"
                    fontFamily="Poppins, sans-serif"
                  >
                    {project.amountRaised} ETH {project.type === "Crowdfunding" ? "raised" : "funded"} of {project.fundingGoal} ETH
                  </Text>
                </HStack>
              </MotionBox>

              {project.type === "TreasuryGrant" && (
                <MotionBox
                  bg="gray.50"
                  p={4}
                  rounded="lg"
                  border="1px solid"
                  borderColor="teal.400"
                  boxShadow="sm"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Text fontWeight="bold" fontFamily="Poppins, sans-serif" mb={2}>Community Funding</Text>
                  <Progress
                    value={parseFloat(project.crowdfundedAmount) > 0 ? 100 : 0} // No goal for crowdfunding, just show progress if funded
                    colorScheme="teal"
                    size="md"
                    rounded="full"
                    bg="gray.200"
                    border="1px solid"
                    borderColor="teal.200"
                  />
                  <HStack spacing={2} justify="center" mt={2}>
                    <FaEthereum color="gray.700" />
                    <Text
                      fontSize="md"
                      color="gray.700"
                      fontWeight="bold"
                      fontFamily="Poppins, sans-serif"
                    >
                      {project.crowdfundedAmount} ETH raised from the community
                    </Text>
                  </HStack>
                </MotionBox>
              )}

              {project.status === "Approved" && (
                <MotionBox
                  bg="gray.50"
                  p={6}
                  rounded="lg"
                  border="1px solid"
                  borderColor="teal.400"
                  boxShadow="sm"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Text
                    fontWeight="bold"
                    fontSize="lg"
                    mb={3}
                    fontFamily="Poppins, sans-serif"
                  >
                    Support this Project
                  </Text>
                  <Flex direction={{ base: "column", md: "row" }} gap={2}>
                    <Input
                      placeholder="ETH Amount"
                      type="number"
                      value={fundingAmount}
                      onChange={(e) => setFundingAmount(e.target.value)}
                      bg="white"
                      borderRadius="md"
                      _focus={{ borderColor: "teal.500" }}
                      isDisabled={isFunding}
                    />
                    <Button
                      colorScheme="teal"
                      size="md"
                      variant="outline"
                      fontFamily="Poppins, sans-serif"
                      fontWeight="bold"
                      _hover={{
                        bgGradient: "linear(to-r, teal.400, teal.500)",
                        color: "white",
                        boxShadow: "md",
                      }}
                      transition="all 0.3s ease-in-out"
                      onClick={handleFundProject}
                      isLoading={isFunding}
                      loadingText="Funding..."
                    >
                      Fund Now
                    </Button>
                  </Flex>
                </MotionBox>
              )}

              <Flex justify="space-between" align="center" mt={6}>
                <Button
                  colorScheme="teal"
                  size="md"
                  variant="outline"
                  fontFamily="Poppins, sans-serif"
                  fontWeight="bold"
                  _hover={{
                    bgGradient: "linear(to-r, teal.400, teal.500)",
                    color: "white",
                    boxShadow: "md",
                  }}
                  transition="all 0.3s ease-in-out"
                  onClick={() => router.push("/explore")}
                >
                  Back to All Projects
                </Button>
                <HStack spacing={4}>
                  <Button
                    as="a"
                    href={`https://twitter.com/intent/tweet?text=Check out ${encodeURIComponent(
                      project.name
                    )} on Creova!&url=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    variant="ghost"
                    colorScheme="teal"
                    fontFamily="Poppins, sans-serif"
                  >
                    <FaTwitter size="20px" />
                  </Button>
                  <Button
                    as="a"
                    href={`https://discord.com/channels/@me?text=Check out ${encodeURIComponent(
                      project.name
                    )} on Creova! ${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    variant="ghost"
                    colorScheme="teal"
                    fontFamily="Poppins, sans-serif"
                  >
                    <FaDiscord size="20px" />
                  </Button>
                  <Button
                    as="a"
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                      window.location.href
                    )}`}
                    target="_blank"
                    variant="ghost"
                    colorScheme="teal"
                    fontFamily="Poppins, sans-serif"
                  >
                    <FaFacebook size="20px" />
                  </Button>
                  <Button
                    as="a"
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                      window.location.href
                    )}`}
                    target="_blank"
                    variant="ghost"
                    colorScheme="teal"
                    fontFamily="Poppins, sans-serif"
                  >
                    <FaLinkedin size="20px" />
                  </Button>
                  <Button
                    as="a"
                    href={`https://t.me/share/url?url=${encodeURIComponent(
                      window.location.href
                    )}&text=Check out ${encodeURIComponent(
                      project.name
                    )} on Creova!`}
                    target="_blank"
                    variant="ghost"
                    colorScheme="teal"
                    fontFamily="Poppins, sans-serif"
                  >
                    <FaTelegram size="20px" />
                  </Button>
                  <Button
                    as="a"
                    href={`https://www.instagram.com/?url=${encodeURIComponent(
                      window.location.href
                    )}`}
                    target="_blank"
                    variant="ghost"
                    colorScheme="teal"
                    fontFamily="Poppins, sans-serif"
                  >
                    <FaInstagram size="20px" />
                  </Button>
                </HStack>
              </Flex>
            </VStack>
          </MotionBox>
        </Container>
      </MotionBox>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent fontFamily="Poppins, sans-serif">
          <ModalHeader>Confirm Funding</ModalHeader>
          <ModalBody>
            <VStack align="stretch" spacing={4}>
              <Text>
                You entered {fundingAmount} ETH. How would you like to handle the 5% Creova fee?
              </Text>
              <RadioGroup onChange={setFeeOption} value={feeOption}>
                <Stack spacing={3}>
                  <Radio value="include">
                    Include fee in {fundingAmount} ETH (Project gets {projectAmount.toFixed(4)} ETH, Creova fee: {treasuryFee.toFixed(4)} ETH)
                  </Radio>
                  <Radio value="add">
                    Add fee on top of {fundingAmount} ETH (Project gets {projectAmount.toFixed(4)} ETH, Creova fee: {treasuryFee.toFixed(4)} ETH, Total: {totalAmount.toFixed(4)} ETH)
                  </Radio>
                </Stack>
              </RadioGroup>
              <Text fontWeight="bold">
                Total amount from your wallet: {totalAmount.toFixed(4)} ETH
              </Text>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={confirmFunding} isLoading={isFunding}>
              Confirm
            </Button>
            <Button variant="ghost" onClick={onClose} isDisabled={isFunding}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Footer />
    </>
  );
}