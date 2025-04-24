import { useEffect, useState, useCallback } from "react";
import { ethers } from "ethers";
import {
  Box,
  Heading,
  Text,
  Container,
  SimpleGrid,
  Flex,
  Badge,
  Spinner,
  Image,
  Progress,
  VStack,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  useColorModeValue, 
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { getFundingPoolContract } from "../lib/getFundingPoolContract";
import { useRouter } from "next/router";
import Footer from "../components/Footer";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { FaEthereum, FaUsers, FaGift } from "react-icons/fa";
import { getRpcProvider } from "../utils/getRpcProvider";
console.log("🧪 NEXT_PUBLIC_RPC_URL =", process.env.NEXT_PUBLIC_RPC_URL); 

const MotionBox = motion(Box);
const MotionImage = motion(Image);
const MotionChevronDownIcon = motion(ChevronDownIcon);
const MotionMenuList = motion(MenuList);

const StatNumber = ({ endValue, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true });

  useEffect(() => {
    if (inView) {
      let start = 0;
      const duration = 2000;
      const increment = endValue / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= endValue) {
          start = endValue;
          clearInterval(timer);
        }
        setCount(Math.floor(start * 100) / 100);
      }, 16);
      return () => clearInterval(timer);
    }
  }, [inView, endValue]);

  return (
    <span
      ref={ref}
      style={{ fontSize: "1.25rem", color: "teal.500", fontWeight: "bold", fontFamily: "Poppins, sans-serif" }}
    >
      {`${count.toLocaleString()}${suffix}`}
    </span>
  );
};

export default function Explore() {
  const [projects, setProjects] = useState([]);
  const [filterType, setFilterType] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Define dynamic styles using useColorModeValue
  const bgGradient = useColorModeValue(
    "linear(to-br, #14B8A6, #ffffff)", // Light mode
    "linear(to-br, #0D9488, #1A202C)"  // Dark mode
  );
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("white", "white");
  const subTextColor = useColorModeValue("gray.600", "gray.300");
  const headingColor = useColorModeValue("gray.900", "white");
  const shadow = useColorModeValue(
    "lg",
    "0 4px 6px rgba(255, 255, 255, 0.1)"
  );
  const inputBg = useColorModeValue("white", "gray.700");
  const menuButtonBg = useColorModeValue("white", "gray.700");
  const progressBg = useColorModeValue("gray.200", "gray.600");
  const boxBg = useColorModeValue("gray.50", "gray.700");
  const boxBorderColor = useColorModeValue("gray.200", "gray.600");

  const handleSearchChange = useCallback((value) => {
    setIsSearching(true);
    const timer = setTimeout(() => {
      setSearchQuery(value);
      setIsSearching(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
      
        const provider = getRpcProvider();
        const contract = getFundingPoolContract(provider);
        const campaignCount = await contract.campaignIds();
        const loadedProjects = [];
        for (let i = 1; i <= campaignCount; i++) {
          const campaign = await contract.campaigns(i);
          loadedProjects.push({
            id: i,
            name: campaign.name,
            status: ["Pending", "Approved", "Rejected"][campaign.status],
            type: ["Crowdfunding", "TreasuryGrant"][campaign.fundingType],
            fundingGoal: ethers.formatEther(campaign.fundingGoal),
            amountRaised: ethers.formatEther(campaign.amountRaised),
            heroMediaCID: campaign.heroMediaCID,
            description: campaign.description || "No description provided.",
          });
        }
        setProjects(loadedProjects);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filteredProjects = filterType === "All" ? projects : projects.filter((p) => p.type === filterType);
  const searchedProjects = searchQuery
    ? filteredProjects.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredProjects;

  if (loading) {
    return (
      <Flex align="center" justify="center" h="100vh" bgGradient={bgGradient}>
        <MotionBox
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Spinner size="xl" color={textColor} thickness="4px" speed="0.65s" />
        </MotionBox>
      </Flex>
    );
  }

  return (
    <Flex direction="column" minH="100vh" bgGradient={bgGradient}>
      <Container maxW="container.xl" py={24} textAlign="center">
        <MotionBox
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Heading
            as="h1"
            size={{ base: "xl", md: "3xl" }}
            fontWeight="extrabold"
            color={textColor}
            textShadow="0 4px 6px rgba(0, 0, 0, 0.8)"
            fontFamily="Poppins, sans-serif"
            mb={4}
          >
            Explore Community-Led Public Goods Projects
          </Heading>
          <Text
            fontSize={{ base: "md", md: "lg" }}
            color={textColor}
            fontWeight="semibold"
            maxW="800px"
            mx="auto"
            textShadow="0 2px 4px rgba(0, 0, 0, 0.8)"
          >
            Discover and support impactful, open-source projects funded transparently through the Ethereum ecosystem.
          </Text>
        </MotionBox>

        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          mt={10}
          mb={12}
        >
          <HStack spacing={4} justify="center">
            <InputGroup maxW="400px" w="full">
              <Input
                placeholder="Search projects..."
                onChange={(e) => handleSearchChange(e.target.value)}
                bg={inputBg}
                borderRadius="full"
                boxShadow="0px 4px 12px rgba(0,0,0,0.1)"
                _focus={{ borderColor: "teal.500", boxShadow: "0 0 0 3px teal.200" }}
                py={6}
              />
              <InputRightElement>
                <Spinner
                  size="sm"
                  color="teal.500"
                  display={isSearching ? "block" : "none"}
                />
              </InputRightElement>
            </InputGroup>
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={
                  <MotionChevronDownIcon
                    initial={{ rotate: 0 }}
                    whileHover={{ rotate: 180 }}
                    transition={{ duration: 0.3 }}
                    aria-hidden="true"
                  />
                }
                bg={menuButtonBg}
                color="teal.600"
                fontSize="lg"
                fontWeight="bold"
                fontFamily="Poppins, sans-serif"
                py={6}
                px={12}
                borderRadius="full"
                boxShadow="0px 8px 16px rgba(0,0,0,0.15)"
                transition="all 0.3s ease-in-out"
                _hover={{
                  bgGradient: "linear(to-r, teal.400, teal.500)",
                  color: "white",
                  transform: "scale(1.05)",
                  boxShadow: "0px 12px 24px rgba(0,0,0,0.2)",
                }}
                _active={{
                  bgGradient: "linear(to-r, teal.500, teal.600)",
                  color: "white",
                  transform: "scale(0.98)",
                }}
                _focus={{ outline: "none", boxShadow: "0 0 0 3px teal.300" }}
              >
                {filterType === "All" ? "All Projects" : filterType === "Crowdfunding" ? "Crowdfunding" : "Treasury Grants"}
              </MenuButton>
              <MotionMenuList
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                exit={{ opacity: 0, scaleY: 0 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                transformOrigin="top"
                position="absolute"
                left={0}
                right={0}
                margin="0 auto"
                borderRadius="md"
                boxShadow={shadow}
                border="none"
                py={0}
                px={3}
                w="100%"
                bg={cardBg}
                mt={1}
              >
                {["All", "Crowdfunding", "TreasuryGrant"].map((type) => (
                  <MenuItem
                    key={type}
                    onClick={() => setFilterType(type)}
                    fontSize="md"
                    fontFamily="Poppins, sans-serif"
                    fontWeight="medium"
                    py={2}
                    px={3}
                    justifyContent="center"
                    transition="all 0.2s ease-in-out"
                    _hover={{
                      borderBottom: "2px solid teal.400",
                      color: "teal.600",
                    }}
                    borderBottom={filterType === type ? "2px solid teal.400" : "none"}
                    color={filterType === type ? "teal.600" : subTextColor}
                    w="100%"
                    m={0}
                  >
                    {type === "All" ? "All Projects" : type === "Crowdfunding" ? "Crowdfunding" : "Treasury Grants"}
                  </MenuItem>
                ))}
              </MotionMenuList>
            </Menu>
          </HStack>
        </MotionBox>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
          {searchedProjects.map((project, index) => (
            <MotionBox
              key={project.id}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 * index }}
              bg={cardBg}
              p={6}
              rounded="2xl"
              boxShadow={shadow}
              cursor="pointer"
              minH="400px"
              border="2px solid"
              borderColor={project.type === "Crowdfunding" ? "teal.400" : "yellow.400"}
              _hover={{
                transform: "scale(1.03)",
                boxShadow: "xl",
                borderColor: project.type === "Crowdfunding" ? "teal.500" : "yellow.500",
              }}
            >
              <VStack align="stretch" spacing={4} w="100%">
                <MotionImage
                  src={`https://gateway.pinata.cloud/ipfs/${project.heroMediaCID}`}
                  alt={`${project.name} Hero`}
                  rounded="lg"
                  w="100%"
                  h="180px"
                  objectFit="cover"
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  fallbackSrc="/placeholder-project.png"
                />
                <Heading
                  size="md"
                  color={headingColor}
                  fontFamily="Poppins, sans-serif"
                  fontWeight="extrabold"
                  textAlign="center"
                  w="100%"
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
                  >
                    {project.type === "Crowdfunding" ? (
                      <FaUsers size="14px" style={{ marginRight: "6px" }} />
                    ) : (
                      <FaGift size="14px" style={{ marginRight: "6px" }} />
                    )}
                    {project.type}
                  </Badge>
                </Flex>
                <Text
                  fontSize="sm"
                  color={subTextColor}
                  noOfLines={2}
                  minH="40px"
                >
                  {project.description}
                </Text>
                <Box
                  bg={boxBg}
                  p={3}
                  rounded="lg"
                  w="100%"
                  border="1px solid"
                  borderColor={boxBorderColor}
                  boxShadow="sm"
                >
                  <HStack spacing={2} justify="center" mb={2}>
                    <FaEthereum color={subTextColor} />
                    <Text
                      fontSize="md"
                      color={subTextColor}
                      fontWeight="extrabold"
                      fontFamily="Poppins, sans-serif"
                    >
                      Goal: {project.fundingGoal} ETH
                    </Text>
                  </HStack>
                  <Progress
                    value={(project.amountRaised / project.fundingGoal) * 100 || 0}
                    colorScheme="teal"
                    size="md"
                    rounded="full"
                    width="100%"
                    bg={progressBg}
                    border="1px solid"
                    borderColor="teal.200"
                  />
                  <HStack spacing={2} justify="center" mt={2}>
                    <FaEthereum color={subTextColor} />
                    <Text
                      fontSize="md"
                      color={subTextColor}
                      fontWeight="extrabold"
                      fontFamily="Poppins, sans-serif"
                    >
                      Raised: {parseFloat(project.amountRaised).toLocaleString()} ETH
                    </Text>
                  </HStack>
                </Box>
                <Button
                  colorScheme="teal"
                  size="md"
                  variant="outline"
                  w="220px"
                  alignSelf="center"
                  fontWeight="bold"
                  mt={4}
                  _hover={{
                    bgGradient: "linear(to-r, teal.400, teal.500)",
                    color: "white",
                    boxShadow: "md",
                  }}
                  onClick={() => router.push(`/projects/${project.id}`)}
                >
                  View Project
                </Button>
              </VStack>
            </MotionBox>
          ))}
        </SimpleGrid>

        {searchedProjects.length === 0 && (
          <MotionBox
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            mt={10}
          >
            <Text fontSize="lg" color={subTextColor}>
              No projects found. Be the first to share your mission and engage the community through Creova.
            </Text>
          </MotionBox>
        )}
      </Container>
      <Footer />
    </Flex>
  );
}