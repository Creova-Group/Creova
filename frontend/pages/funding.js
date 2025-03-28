import { useState, useEffect } from "react";
import { ethers } from "ethers";
import {
  Box,
  Container,
  Heading,
  VStack,
  Input,
  Button,
  Textarea,
  useToast,
  Text,
  FormControl,
  FormLabel,
  FormHelperText,
  InputGroup,
  InputRightElement,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  HStack,
  Icon,
} from "@chakra-ui/react";
import { useAccount } from "wagmi";
import { getFundingPoolContract } from "../lib/getFundingPoolContract";
import { motion } from "framer-motion";
import {
  FaFileUpload,
  FaEthereum,
  FaChevronDown,
  FaPencilAlt,
  FaCoins,
  FaFileAlt,
  FaEye,
} from "react-icons/fa";
import Footer from "../components/Footer";
import { uploadFileToIPFS } from "../utils/pinata";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_FUNDINGPOOL_ADDRESS;
const MotionBox = motion(Box);

const MAX_DESCRIPTION_CHARS = 100;
const MAX_HERO_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const KYC_THRESHOLD = 5;

const CustomDropdown = ({ value, onChange, name }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasSelected, setHasSelected] = useState(false);

  const options = ["Crowdfunding", "TreasuryGrant"];
  const bg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.900", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const shadow = useColorModeValue("md", "0 4px 6px rgba(255, 255, 255, 0.1)");

  const handleSelect = (option) => {
    onChange({ target: { name, value: option } });
    setIsOpen(false);
    setHasSelected(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") setIsOpen(!isOpen);
    if (isOpen && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      const index = options.indexOf(value);
      const newIndex = e.key === "ArrowDown" ? (index + 1) % 2 : (index - 1 + 2) % 2;
      handleSelect(options[newIndex]);
    }
  };

  return (
    <Box position="relative" fontFamily="Poppins, sans-serif">
      <Box
        as="button"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        bg={bg}
        border="1px solid"
        borderColor={hasSelected && !isOpen ? "teal.400" : borderColor}
        borderRadius="md"
        px={4}
        py={2}
        height="48px"
        width="full"
        textAlign="left"
        fontSize="16px"
        fontFamily="Poppins, sans-serif"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        _hover={{ borderColor: "teal.500", transform: "scale(1.02)" }}
        _focus={{ borderColor: "teal.400", bg: "teal.400", color: "white" }}
      >
        <Text fontWeight={isOpen ? "bold" : "normal"}>{value || "Select Funding Type"}</Text>
        <FaChevronDown color={isOpen ? "teal.400" : "gray.500"} />
      </Box>
      {isOpen && (
        <Box
          position="absolute"
          top="100%"
          left={0}
          right={0}
          bg={bg}
          border="1px solid"
          borderColor={borderColor}
          borderRadius="md"
          mt={1}
          zIndex={10}
          boxShadow={shadow}
        >
          {options.map((option) => (
            <Box
              key={option}
              px={4}
              py={2}
              fontSize="16px"
              fontFamily="Poppins, sans-serif"
              _hover={{ bg: "teal.400", color: "white" }}
              onClick={() => handleSelect(option)}
              cursor="pointer"
              color={value === option ? textColor : textColor}
            >
              {option}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default function Funding() {
  const initialFormData = {
    name: "",
    fundingAmount: "",
    fundingType: "Crowdfunding",
    description: "",
    file: null,
    heroMedia: null,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [isKYCVerified, setIsKYCVerified] = useState(false);
  const [availableTreasuryFunds, setAvailableTreasuryFunds] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [submissionCount, setSubmissionCount] = useState(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [gasEstimate, setGasEstimate] = useState(null);
  const [lastTxHash, setLastTxHash] = useState(null);
  const [tip, setTip] = useState("A thorough description helps with finding and securing funding!");

  const toast = useToast();
  const { address, isConnected } = useAccount();

  // Initialize and validate localStorage data
  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedDraft = localStorage.getItem("fundingDraft");
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          setFormData((prev) => ({
            ...initialFormData,
            ...parsed,
          }));
        } else {
          console.error("Invalid fundingDraft in localStorage: not a plain object", parsed);
          localStorage.removeItem("fundingDraft");
          setFormData(initialFormData);
        }
      } catch (error) {
        console.error("Error parsing fundingDraft from localStorage:", error);
        localStorage.removeItem("fundingDraft");
        setFormData(initialFormData);
      }
    }

    const savedCount = localStorage.getItem("submissionCount");
    if (savedCount) {
      const count = parseInt(savedCount, 10);
      if (!isNaN(count)) {
        setSubmissionCount(count);
      } else {
        console.error("Invalid submissionCount in localStorage:", savedCount);
        localStorage.removeItem("submissionCount");
        setSubmissionCount(0);
      }
    }
  }, []);

  // Save to localStorage with validation
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem("fundingDraft", JSON.stringify(formData));
      localStorage.setItem("submissionCount", submissionCount.toString());
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  }, [formData, submissionCount]);

  // Fetch KYC status and treasury funds
  useEffect(() => {
    if (!isConnected || !address || !window.ethereum) {
      console.log("Skipping fetchData: Wallet not connected or not initialized", { isConnected, address, hasEthereum: !!window.ethereum });
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setLoadingText("Fetching data...");
      try {
        const expectedChainId = (process.env.NEXT_PUBLIC_EXPECTED_CHAIN_ID || "0x1").toLowerCase();
const currentChainId = (await window.ethereum.request({ method: "eth_chainId" })).toLowerCase();

if (currentChainId !== expectedChainId) {
  throw new Error(`Wrong network. Please switch to chain ID ${expectedChainId} (e.g., Mainnet).`);
}

const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();
const contract = await getFundingPoolContract(signer);

        if (!contract || typeof contract.isKYCVerified !== "function" || typeof contract.getAvailableTreasuryFunds !== "function") {
          console.error("Contract instance invalid:", contract);
          throw new Error("Invalid contract instance: missing required methods");
        }
        console.log("Contract initialized at:", CONTRACT_ADDRESS);

// Fetch KYC status
console.log("🔍 KYC address being checked:", address);

if (
  !address ||
  !contract ||
  typeof contract.isKYCVerified !== "function"
) {
  console.log("⏳ Contract or method not ready");
  return;
}

try {
  const kycStatus = await contract.isKYCVerified(address);
  setIsKYCVerified(kycStatus);
  localStorage.setItem("kycVerified", `${kycStatus}|${Date.now()}`);
} catch (err) {
  console.error("❌ Failed to check KYC status:", err);
}
        // Fetch treasury funds if applicable
        if (formData.fundingType === "TreasuryGrant") {
          const funds = await contract.getAvailableTreasuryFunds();
          const formattedFunds = ethers.formatEther(funds);
          setAvailableTreasuryFunds(formattedFunds);
          localStorage.setItem("treasuryFunds", `${formattedFunds}|${Date.now()}`);
        } else {
          setAvailableTreasuryFunds(null);
        }
      } catch (error) {
        console.error("fetchData error:", error);
        let errorMessage = "Could not load treasury funds or KYC status. Please check your wallet connection.";
        if (error.message.includes("Wrong network")) errorMessage = error.message;
        else if (error.message.includes("Invalid contract instance")) errorMessage = "Contract configuration error. Check address and ABI.";
        else if (error.code === "CALL_EXCEPTION") errorMessage = "Contract call failed. Ensure it’s deployed correctly.";
        toast({
          title: "Error fetching data",
          description: errorMessage,
          status: "error",
          colorScheme: "teal",
          duration: 5000,
        });
        setIsKYCVerified(false);
        setAvailableTreasuryFunds(null);
      } finally {
        setLoading(false);
        setLoadingText("");
      }
    };

    fetchData();
    const interval = setInterval(() => formData.fundingType === "TreasuryGrant" && fetchData(), 30000);
    return () => clearInterval(interval);
  }, [address, isConnected, formData.fundingType, toast]);

  const validateForm = () => {
    let isValid = true;

    if (!formData.name) {
      toast({
        title: "Validation Error",
        description: "Project name is required",
        status: "error",
        colorScheme: "teal",
        duration: 3000,
      });
      isValid = false;
    }

    if (!formData.fundingAmount || isNaN(formData.fundingAmount) || parseFloat(formData.fundingAmount) <= 0) {
      toast({
        title: "Validation Error",
        description: "Enter a valid ETH amount (e.g., 1.5)",
        status: "error",
        colorScheme: "teal",
        duration: 3000,
      });
      isValid = false;
    } else if (formData.fundingType === "TreasuryGrant") {
      const fundingAmount = parseFloat(formData.fundingAmount);
      if (fundingAmount > KYC_THRESHOLD && !isKYCVerified) {
        toast({
          title: "Validation Error",
          description: `KYC required for Treasury Grants over ${KYC_THRESHOLD} ETH`,
          status: "error",
          colorScheme: "teal",
          duration: 3000,
        });
        isValid = false;
      }
      if (availableTreasuryFunds !== null && fundingAmount > parseFloat(availableTreasuryFunds)) {
        toast({
          title: "Validation Error",
          description: `Exceeds available treasury funds (${parseFloat(availableTreasuryFunds).toFixed(2)} ETH)`,
          status: "error",
          colorScheme: "teal",
          duration: 3000,
        });
        isValid = false;
      }
    }

    if (!formData.description) {
      toast({
        title: "Validation Error",
        description: "Description is required",
        status: "error",
        colorScheme: "teal",
        duration: 3000,
      });
      isValid = false;
    } else if (formData.description.length > MAX_DESCRIPTION_CHARS) {
      toast({
        title: "Validation Error",
        description: `Max ${MAX_DESCRIPTION_CHARS} characters`,
        status: "error",
        colorScheme: "teal",
        duration: 3000,
      });
      isValid = false;
    }

    if (formData.heroMedia && (!["image/jpeg", "image/png", "video/mp4"].includes(formData.heroMedia.type) || formData.heroMedia.size > MAX_HERO_SIZE)) {
      toast({
        title: "Validation Error",
        description: "Upload a JPEG/PNG image or MP4 video (max 5MB)",
        status: "error",
        colorScheme: "teal",
        duration: 3000,
      });
      isValid = false;
    }

    if (formData.file && formData.file.size > MAX_FILE_SIZE) {
      toast({
        title: "Validation Error",
        description: "File must be under 10MB",
        status: "error",
        colorScheme: "teal",
        duration: 3000,
      });
      isValid = false;
    }

    return isValid;
  };

  const handleChange = (e) => {
    const sanitizedValue = e.target.name === "description" ? e.target.value.replace(/<script.*?>.*?<\/script>/gi, "") : e.target.value;
    setFormData((prev) => ({ ...prev, [e.target.name]: sanitizedValue }));
  };

  const handleAmountSuggestion = (amount) => {
    setFormData((prev) => ({ ...prev, fundingAmount: amount.toString() }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!["application/pdf", "application/msword"].includes(file.type)) {
      toast({
        title: "File Error",
        description: "Only PDF or Word documents are allowed",
        status: "error",
        colorScheme: "teal",
        duration: 3000,
      });
      setFormData((prev) => ({ ...prev, file: null }));
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File Error",
        description: "File must be under 10MB",
        status: "error",
        colorScheme: "teal",
        duration: 3000,
      });
      setFormData((prev) => ({ ...prev, file: null }));
      return;
    }
    setFormData((prev) => ({ ...prev, file }));
  };

  const handleHeroMediaChange = (e) => {
    const heroMedia = e.target.files[0];
    if (!heroMedia) return;
    if (!["image/jpeg", "image/png", "video/mp4"].includes(heroMedia.type)) {
      toast({
        title: "File Error",
        description: "Only JPEG, PNG, or MP4 files are allowed",
        status: "error",
        colorScheme: "teal",
        duration: 3000,
      });
      setFormData((prev) => ({ ...prev, heroMedia: null }));
      return;
    }
    if (heroMedia.size > MAX_HERO_SIZE) {
      toast({
        title: "File Error",
        description: "File must be under 5MB",
        status: "error",
        colorScheme: "teal",
        duration: 3000,
      });
      setFormData((prev) => ({ ...prev, heroMedia: null }));
      return;
    }
    setFormData((prev) => ({ ...prev, heroMedia }));
  };

  const estimateGas = async (provider, signer, contract, name, fundingGoalWei, fundingTypeNumeric, milestoneDescriptions, milestoneAmounts, projectCID, heroMediaCID, description) => {
    try {
      const feeData = await provider.getFeeData();
      const gasPrice = feeData.gasPrice;

      const gasUnits = await contract.createCampaign.estimateGas(
        name,
        fundingGoalWei,
        fundingTypeNumeric,
        milestoneDescriptions,
        milestoneAmounts,
        projectCID,
        heroMediaCID,
        description
      );

      const totalCostWei = gasUnits * gasPrice; // Use BigInt multiplication
      const totalCostEth = ethers.formatEther(totalCostWei);
      setGasEstimate(totalCostEth);
    } catch (error) {
      console.error("Gas estimation error:", error);
      setGasEstimate("N/A");
      toast({
        title: "Gas Estimation Failed",
        description: "Could not estimate gas cost. Transaction might still proceed.",
        status: "warning",
        colorScheme: "teal",
        duration: 3000,
      });
    }
  };

  const handleSubmit = async () => {
    if (!window.ethereum || !isConnected || !address) {
      toast({
        title: "Wallet Error",
        description: "Please connect your wallet",
        status: "error",
        colorScheme: "teal",
        duration: 3000,
      });
      return;
    }

    if (submissionCount >= 5) {
      toast({
        title: "Limit Reached",
        description: "Max 5 submissions per session. Reload to reset.",
        status: "warning",
        colorScheme: "teal",
        duration: 3000,
      });
      return;
    }

    const isFormValid = validateForm();
    if (!isFormValid) return;

    setLoading(true);
    setLoadingText("Uploading files to IPFS...");

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = await getFundingPoolContract(signer);
      console.log("✅ ENV from build:", process.env.NEXT_PUBLIC_EXPECTED_CHAIN_ID);

      const fundingGoalWei = ethers.parseEther(formData.fundingAmount);

      // Define milestone arrays based on funding type
      let milestoneDescriptions = [];
      let milestoneAmounts = [];
      if (formData.fundingType === "Crowdfunding") {
        milestoneDescriptions = ["Full Project"];
        milestoneAmounts = [fundingGoalWei];
      } else if (formData.fundingType === "TreasuryGrant") {
        // Supply a default 100% milestone to avoid empty array error
        milestoneDescriptions = ["Initial Grant"];
        milestoneAmounts = [fundingGoalWei];
      }

      const projectCID = formData.file ? await uploadFileToIPFS(formData.file) : "";
      const heroMediaCID = formData.heroMedia ? await uploadFileToIPFS(formData.heroMedia) : "";

      console.log("Submitting with args:", {
        name: formData.name,
        fundingGoalWei: fundingGoalWei.toString(),
        fundingType: formData.fundingType === "Crowdfunding" ? 0 : 1,
        milestoneDescriptions,
        milestoneAmounts: milestoneAmounts.map((amt) => amt.toString()),
        projectCID,
        heroMediaCID,
        description: formData.description,
      });

      setLoadingText("Estimating gas...");
      await estimateGas(
        provider,
        signer,
        contract,
        formData.name,
        fundingGoalWei,
        formData.fundingType === "Crowdfunding" ? 0 : 1,
        milestoneDescriptions,
        milestoneAmounts,
        projectCID,
        heroMediaCID,
        formData.description
      );

      setLoadingText("Submitting to blockchain...");
      const tx = await contract.createCampaign(
        formData.name,
        fundingGoalWei,
        formData.fundingType === "Crowdfunding" ? 0 : 1, // FundingType enum: 0 = Crowdfunding, 1 = TreasuryGrant
        milestoneDescriptions,
        milestoneAmounts,
        projectCID,
        heroMediaCID,
        formData.description
      );

      setLoadingText("Waiting for transaction confirmation...");
      const receipt = await tx.wait();
      setLastTxHash(tx.hash);
      setSubmissionCount((prev) => prev + 1);

      toast({
        title: "Project submitted successfully!",
        description: (
          <VStack align="start">
            <Text>
              {formData.fundingType === "Crowdfunding"
                ? "Awaiting voter approval to start collecting funds."
                : "Awaiting voter approval for treasury funding and milestone reviews."}
            </Text>
            <Button size="sm" variant="link" onClick={() => window.open(`https://etherscan.io/tx/${tx.hash}`, "_blank")}>
              View Transaction
            </Button>
            <Button size="sm" variant="link" onClick={() => window.open(`https://twitter.com/intent/tweet?text=I just submitted ${formData.name} for funding!`, "_blank")}>
              Share on Twitter
            </Button>
            <Button size="sm" variant="link" onClick={() => (window.location.href = "/dashboard")}>
              Go to Dashboard
            </Button>
          </VStack>
        ),
        status: "success",
        colorScheme: "teal",
        duration: 10000,
        isClosable: true,
      });

      setFormData((prev) => ({ ...prev, fundingAmount: "", description: "" }));
    } catch (error) {
      console.error("Submission error:", error);
      let errorMessage = "An error occurred during submission.";
      if (error.reason) errorMessage = error.reason;
      else if (error.message.includes("t is not iterable")) errorMessage = "Invalid milestone data format. Check arrays.";
      else if (error.message) errorMessage = error.message;
      toast({
        title: "Submission Failed",
        description: errorMessage,
        status: "error",
        colorScheme: "teal",
        duration: 5000,
      });
    } finally {
      setLoading(false);
      setLoadingText("");
    }
  };

  console.log("Rendering Funding component with state:", {
    formData,
    availableTreasuryFunds,
    gasEstimate,
    tip,
  });

  const bgGradient = useColorModeValue("linear(to-br, #14B8A6, #ffffff)", "linear(to-br, #0D9488, #1A202C)");
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.900", "white");
  const subTextColor = useColorModeValue("gray.500", "gray.300");
  const shadow = useColorModeValue("lg", "0 4px 6px rgba(255, 255, 255, 0.1)");
  const infoBoxBg = useColorModeValue("teal.50", "gray.700");
  const infoBoxBorderColor = useColorModeValue("teal.400", "teal.600");
  const infoBoxTextColor = useColorModeValue("teal.800", "gray.300");
  const infoBoxHeadingColor = useColorModeValue("teal.700", "teal.300");
  const treasuryBoxBg = useColorModeValue("yellow.50", "gray.700");
  const treasuryBoxBorderColor = useColorModeValue("yellow.400", "yellow.600");
  const treasuryBoxTextColor = useColorModeValue("yellow.800", "gray.300");
  const treasuryBoxHeadingColor = useColorModeValue("yellow.700", "yellow.300");

  return (
    <>
      <MotionBox
        minH="100vh"
        bgGradient={bgGradient}
        py={24}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Container maxW="container.md">
          <MotionBox
            bg={cardBg}
            p={10}
            rounded="2xl"
            boxShadow={shadow}
            border="2px solid"
            borderColor="teal.400"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <VStack spacing={6} align="stretch">
              <Heading
                size="xl"
                color={textColor}
                textAlign="center"
                fontFamily="Poppins, sans-serif"
                fontWeight="extrabold"
                textShadow="0 0.5px 0.5px rgba(0, 0, 0, 0.8)"
              >
                Launch Your Project
              </Heading>

              <FormControl>
                <FormLabel fontFamily="Poppins, sans-serif" fontWeight="bold" color={textColor}>
                  <Icon as={FaFileAlt} mr={2} /> Funding Type
                </FormLabel>
                <CustomDropdown name="fundingType" value={formData.fundingType} onChange={handleChange} />
              </FormControl>

              <FormControl>
                <FormLabel fontFamily="Poppins, sans-serif" fontWeight="bold" color={textColor}>
                  <Icon as={FaPencilAlt} mr={2} /> Project Name
                </FormLabel>
                <Input
                  name="name"
                  placeholder="Enter project name"
                  size="lg"
                  value={formData.name}
                  onChange={handleChange}
                  focusBorderColor="teal.400"
                  fontFamily="Poppins, sans-serif"
                  bg={cardBg}
                  color={textColor}
                  aria-label="Project name"
                />
              </FormControl>

              <FormControl>
                <FormLabel fontFamily="Poppins, sans-serif" fontWeight="bold" color={textColor}>
                  <Icon as={FaFileUpload} mr={2} /> Hero Image/Video
                </FormLabel>
                <Button
                  as="label"
                  colorScheme="teal"
                  variant="outline"
                  leftIcon={<FaFileUpload />}
                  size="lg"
                  fontFamily="Poppins, sans-serif"
                  _hover={{ bgGradient: "linear(to-r, teal.400, teal.500)", color: "white", transform: "scale(1.05)" }}
                >
                  Upload Hero Media
                  <input type="file" hidden onChange={handleHeroMediaChange} accept="image/jpeg,image/png,video/mp4" />
                </Button>
                {formData.heroMedia && (
                  <Text
                    fontSize="sm"
                    mt={2}
                    color={subTextColor}
                    cursor="pointer"
                    onClick={() => formData.heroMedia && window.open(URL.createObjectURL(formData.heroMedia), "_blank")}
                  >
                    {formData.heroMedia.name}
                  </Text>
                )}
                <FormHelperText color={subTextColor}>Optional: JPEG/PNG or MP4 (max 5MB)</FormHelperText>
              </FormControl>

              <FormControl>
                <FormLabel fontFamily="Poppins, sans-serif" fontWeight="bold" color={textColor}>
                  <Icon as={FaCoins} mr={2} /> Funding Goal (ETH)
                </FormLabel>
                <InputGroup size="lg">
                  <Input
                    name="fundingAmount"
                    placeholder="e.g., 1.5"
                    type="number"
                    step="0.1"
                    value={formData.fundingAmount}
                    onChange={handleChange}
                    focusBorderColor="teal.400"
                    fontFamily="Poppins, sans-serif"
                    bg={cardBg}
                    color={textColor}
                    aria-label="Funding goal in ETH"
                  />
                  <InputRightElement pointerEvents="none">
                    <FaEthereum color={subTextColor} />
                  </InputRightElement>
                </InputGroup>
                <HStack mt={2} spacing={2}>
                  {[1, 5, 10].map((amount) => (
                    <Button
                      key={amount}
                      size="sm"
                      variant="outline"
                      colorScheme="teal"
                      onClick={() => handleAmountSuggestion(amount)}
                    >
                      {amount} ETH
                    </Button>
                  ))}
                </HStack>
                <FormHelperText color={subTextColor}>
                  {formData.fundingType === "TreasuryGrant" && availableTreasuryFunds !== null && !isNaN(parseFloat(availableTreasuryFunds))
                    ? `Available this quarter: ${parseFloat(availableTreasuryFunds).toFixed(2)} ETH`
                    : "Enter your funding goal"}
                </FormHelperText>
              </FormControl>

              <FormControl>
                <FormLabel fontFamily="Poppins, sans-serif" fontWeight="bold" color={textColor}>
                  <Icon as={FaPencilAlt} mr={2} /> Description
                </FormLabel>
                <Textarea
                  name="description"
                  placeholder="Briefly describe your project (max 100 characters)"
                  size="lg"
                  value={formData.description}
                  onChange={handleChange}
                  focusBorderColor="teal.400"
                  resize="vertical"
                  fontFamily="Poppins, sans-serif"
                  maxLength={MAX_DESCRIPTION_CHARS}
                  bg={cardBg}
                  color={textColor}
                  aria-label="Project description"
                />
                <FormHelperText color={formData.description.length > 80 ? "red.500" : subTextColor}>
                  {formData.description.length}/{MAX_DESCRIPTION_CHARS} characters
                </FormHelperText>
              </FormControl>

              <FormControl>
                <FormLabel fontFamily="Poppins, sans-serif" fontWeight="bold" color={textColor}>
                  <Icon as={FaFileUpload} mr={2} /> Project Details (PDF/Doc)
                </FormLabel>
                <Button
                  as="label"
                  colorScheme="teal"
                  variant="outline"
                  leftIcon={<FaFileUpload />}
                  size="lg"
                  fontFamily="Poppins, sans-serif"
                  _hover={{ bgGradient: "linear(to-r, teal.400, teal.500)", color: "white", transform: "scale(1.05)" }}
                >
                  Upload Project Details
                  <input type="file" hidden onChange={handleFileChange} accept="application/pdf,application/msword" />
                </Button>
                {formData.file && (
                  <Text
                    fontSize="sm"
                    mt={2}
                    color={subTextColor}
                    cursor="pointer"
                    onClick={() => formData.file && window.open(URL.createObjectURL(formData.file), "_blank")}
                  >
                    {formData.file.name}
                  </Text>
                )}
                <FormHelperText color={subTextColor}>Optional: Upload a PDF or Word document (max 10MB)</FormHelperText>
              </FormControl>

              {formData.fundingType === "Crowdfunding" && (
                <Box p={4} bg={infoBoxBg} rounded="lg" border="1px solid" borderColor={infoBoxBorderColor} w="full">
                  <Heading size="md" color={infoBoxHeadingColor} mb={2} fontFamily="Poppins, sans-serif">
                    Crowdfunding Details
                  </Heading>
                  <Text fontSize="sm" color={infoBoxTextColor} fontFamily="Poppins, sans-serif">
                    • 100% - Full Project Funding
                  </Text>
                  <Text fontSize="xs" color={infoBoxTextColor} mt={2} fontFamily="Poppins, sans-serif">
                    Requires voter approval to start. Funds released once goal is met or deadline passes (30 days).
                  </Text>
                </Box>
              )}

              {formData.fundingType === "TreasuryGrant" && (
                <Box p={4} bg={treasuryBoxBg} rounded="lg" border="1px solid" borderColor={treasuryBoxBorderColor} w="full">
                  <Heading size="md" color={treasuryBoxHeadingColor} mb={2} fontFamily="Poppins, sans-serif">
                    Treasury Grant Details
                  </Heading>
                  <HStack spacing={4}>
                    <Box p={2} bg="yellow.100" rounded="md">30% - Proof of Concept</Box>
                    <Box p={2} bg="yellow.100" rounded="md">30% - Beta Completed</Box>
                    <Box p={2} bg="yellow.100" rounded="md">40% - Final Launch</Box>
                  </HStack>
                  <Text fontSize="xs" color={treasuryBoxTextColor} mt={2} fontFamily="Poppins, sans-serif">
                    Requires voter approval within 14 days, then milestone approvals. KYC needed for grants over {KYC_THRESHOLD} ETH.
                  </Text>
                </Box>
              )}

              {tip && (
                <Box p={2} bg="gray.100" rounded="md">
                  <Text fontSize="sm" color="gray.600" fontFamily="Poppins, sans-serif">Tip: {tip}</Text>
                </Box>
              )}

              <Text fontSize="sm" color={subTextColor} fontFamily="Poppins, sans-serif">
                You should upload very clear full project details to increase your chances of approval
              </Text>
              {gasEstimate && <Text fontSize="sm" color={subTextColor}>Estimated Gas: {gasEstimate} ETH</Text>}

              <HStack spacing={4}>
                <Button
                  colorScheme="teal"
                  size="lg"
                  w="full"
                  isLoading={loading}
                  loadingText={loadingText || "Submitting..."}
                  onClick={handleSubmit}
                  fontFamily="Poppins, sans-serif"
                  fontWeight="bold"
                  _hover={{ bgGradient: "linear(to-r, teal.400, teal.500)", boxShadow: "md", transform: "scale(1.05)" }}
                  disabled={!isConnected || loading}
                >
                  Submit Project
                </Button>
                <Button
                  colorScheme="teal"
                  variant="outline"
                  size="lg"
                  onClick={() => setIsPreviewOpen(true)}
                  fontFamily="Poppins, sans-serif"
                  _hover={{ transform: "scale(1.05)" }}
                  disabled={!isConnected || loading}
                >
                  <FaEye /> Preview
                </Button>
              </HStack>
            </VStack>
          </MotionBox>
        </Container>
      </MotionBox>

      <Modal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontFamily="Poppins, sans-serif">{formData.name || "Your Project"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Text fontFamily="Poppins, sans-serif"><strong>Type:</strong> {formData.fundingType}</Text>
              {formData.heroMedia && (
                <Text fontFamily="Poppins, sans-serif"><strong>Media:</strong> {formData.heroMedia.name}</Text>
              )}
              <Text fontFamily="Poppins, sans-serif"><strong>Goal:</strong> {formData.fundingAmount} ETH</Text>
              <Text fontFamily="Poppins, sans-serif"><strong>Description:</strong> {formData.description}</Text>
              {formData.file && <Text fontFamily="Poppins, sans-serif"><strong>File:</strong> {formData.file.name}</Text>}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Footer />
    </>
  );
}

export async function getServerSideProps() {
  return { props: {} };
}