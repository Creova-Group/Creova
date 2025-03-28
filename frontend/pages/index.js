import { Box, Heading, Text, Button, VStack, Container, Image, SimpleGrid, Flex, Link, HStack, useColorModeValue, useBreakpointValue } from "@chakra-ui/react";
import NextLink from "next/link";
import { FaBolt, FaLock, FaUsers, FaDollarSign, FaCheckCircle, FaVoteYea, FaCoins, FaArrowRight } from "react-icons/fa";
import { motion, useAnimationControls } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import FundingPoolABI from "../utils/FundingPoolABI.json";

// Motion components
const MotionBox = motion(Box);
const MotionImage = motion(Image);
const MotionSpan = motion.span;

// Contract address from environment variable
const CONTRACT_ADDRESS = "0x8e857937E1Fe63bf5fe709413B4521F2F4261533";

// StatNumber component (unchanged)
const StatNumber = ({ endValue, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true });
  const controls = useAnimationControls();

  useEffect(() => {
    if (inView) {
      controls.start({ opacity: 1, scale: 1 });
      let start = 0;
      const duration = 2000;
      const increment = endValue / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= endValue) {
          start = endValue;
          clearInterval(timer);
        }
        setCount(Math.floor(start));
      }, 16);
      return () => clearInterval(timer);
    }
  }, [inView, endValue, controls]);

  const textColor = useColorModeValue("teal.500", "teal.300");

  return (
    <MotionSpan
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={controls}
      transition={{ duration: 0.5 }}
      style={{
        fontSize: "2.25rem",
        color: textColor,
        fontFamily: "Poppins, sans-serif",
        fontWeight: "bold",
      }}
    >
      {`${count.toLocaleString()}${suffix}`}
    </MotionSpan>
  );
};

export default function Home() {
  const [spotlightCampaign, setSpotlightCampaign] = useState(null);
  const abi = FundingPoolABI.abi;
  const [totalFunding, setTotalFunding] = useState(0);
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalMembers, setTotalMembers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  const bgGradient = useColorModeValue("linear(to-br, #14B8A6, #ffffff)", "linear(to-br, #0D9488, #1A202C)");
  const textColor = useColorModeValue("gray.900", "white");
  const subTextColor = useColorModeValue("gray.700", "gray.300");
  const cardBg = useColorModeValue("white", "gray.800");
  const buttonBg = useColorModeValue("white", "gray.700");
  const buttonText = useColorModeValue("teal.600", "teal.200");
  const shadowColor = useColorModeValue("rgba(0, 0, 0, 0.2)", "rgba(255, 255, 255, 0.1)");

  const shouldAnimate = useBreakpointValue({
    base: false,
    md: true,
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!abi) return;

    const fetchContractData = async () => {
      setLoading(true);
      setError(null);

      try {
        let provider;
        if (typeof window !== "undefined" && window.ethereum) {
          provider = new ethers.BrowserProvider(window.ethereum);
        } else {
          const infuraUrl = process.env.NEXT_PUBLIC_MAINNET_RPC_URL;
          if (!infuraUrl) {
            console.warn("Infura URL not set. Falling back to a public RPC provider.");
            provider = new ethers.JsonRpcProvider("https://cloudflare-eth.com");
          } else {
            provider = new ethers.JsonRpcProvider(infuraUrl);
          }
          const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
        }

        const network = await provider.getNetwork();
        if (!network) {
          throw new Error("Could not connect to the Ethereum network.");
        }

        const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
        const campaignId = 1;
        const campaign = await contract.campaigns(campaignId);

        if (campaign && campaign.name) {
          const amountRaised = campaign.amountRaised || 0n;
          const crowdfundedAmount = campaign.crowdfundedAmount || 0n;
          const totalRaised = amountRaised + crowdfundedAmount;
          const amountRaisedEth = ethers.formatEther(totalRaised);

          setSpotlightCampaign({
            name: campaign.name,
            amountRaised: amountRaisedEth,
            description: campaign.description,
            heroMediaCID: campaign.heroMediaCID,
          });
        } else {
          console.warn(`Campaign with ID ${campaignId} not found or missing name. Skipping spotlight campaign.`);
          setSpotlightCampaign(null);
        }

        const campaignIds = await contract.campaignIds();
        let totalEthRaised = BigInt(0);
        let successfulProjects = 0;

        for (let i = 1; i <= Number(campaignIds); i++) {
          try {
            const camp = await contract.campaigns(i);
            if (camp.status === 1) {
              successfulProjects += 1;
            }
            totalEthRaised += (camp.amountRaised || 0n) + (camp.crowdfundedAmount || 0n);
          } catch (err) {
            console.error(`Error fetching campaign ${i}:`, err);
          }
        }

        setTotalFunding(parseFloat(ethers.formatEther(totalEthRaised)));
        setTotalProjects(successfulProjects);
        setTotalMembers(398);
      } catch (err) {
        console.error("Error fetching contract data:", err);
        setError("Failed to load data from the blockchain. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchContractData();
  }, [abi]);

  if (loading) {
    return (
      <Flex minH="100vh" align="center" justify="center" bgGradient={bgGradient}>
        <MotionBox initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8 }}>
          <Text color={textColor} fontSize="lg" mr={4}>Loading...</Text>
        </MotionBox>
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex minH="100vh" align="center" justify="center" bgGradient={bgGradient}>
        <VStack spacing={4}>
          <Text color={textColor} fontSize="lg">{error}</Text>
          <Button
            colorScheme="teal"
            onClick={() => window.location.reload()}
            borderRadius="full"
            px={6}
            fontFamily="Poppins, sans-serif"
          >
            Retry
          </Button>
        </VStack>
      </Flex>
    );
  }

  return (
    <Flex
      direction="column"
      minH="100vh"
      bgGradient={bgGradient}
      align="center"
      justify="flex-start"
      textAlign="center"
      overflow="hidden"
      w="100vw"
      m={0}
      p={0}
      mt="64px"
      key={isMounted ? "mounted" : "unmounted"}
    >
      {/* Hero Section */}
      <MotionBox
        w="100vw"
        maxW="100vw"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        position="relative"
        overflow="hidden"
        minH={{ base: "700px", md: "585px" }}
        m={0}
        p={0}
      >
        <MotionImage
          src="/hero-image.png"
          alt="Creova Hero - Decentralized Funding Platform"
          w="100vw"
          h="100%"
          position="absolute"
          top={0}
          left={0}
          objectFit="cover"
          objectPosition="center"
          initial={{ x: 0 }}
          animate={shouldAnimate ? { x: [-5, 5] } : { x: 0 }}
          transition={shouldAnimate ? { duration: 6, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" } : {}}
        />
        <MotionBox
          position="absolute"
          top={0}
          left={0}
          w="100vw"
          h="100%"
          bgGradient={useColorModeValue(
            "linear(to-b, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0))",
            "linear(to-b, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0))"
          )}
          display="flex"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          px={{ base: 4, md: 8 }}
          pt={{ base: "80px", md: "64px" }}
          pb={{ base: 6, md: 8 }}
        >
          <VStack spacing={{ base: 8, md: 8 }} w="100vw" maxW="1200px">
            <MotionBox initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, ease: "easeOut" }}>
              <Heading
                as="h1"
                size={{ base: "lg", md: "3xl" }}
                fontWeight="extrabold"
                color="white"
                lineHeight={1.3}
                textShadow={useColorModeValue("0 4px 12px rgba(0, 0, 0, 0.8)", "0 4px 12px rgba(0, 0, 0, 0.9)")}
                letterSpacing="0.5px"
                fontFamily="Poppins, sans-serif"
                px={{ base: 2, md: 0 }}
              >
                Funding Without Gatekeepers.
              </Heading>
            </MotionBox>
            <MotionBox initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}>
              <Text
                fontSize={{ base: "sm", md: "lg" }}
                color="white"
                fontWeight="semibold"
                maxW={{ base: "90%", md: "800px" }}
                lineHeight={1.7}
                textShadow={useColorModeValue("0 2px 6px rgba(0, 0, 0, 0.8)", "0 2px 6px rgba(0, 0, 0, 0.9)")}
                px={{ base: 2, md: 0 }}
              >
                Launch your project fast. Rally your community. Raise ETH from the crowd—or secure a Treasury Grant from our DAO.
              </Text>
            </MotionBox>
            <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1 }}>
              <HStack
                spacing={{ base: 4, md: 5 }}
                mt={{ base: 8, md: 8 }}
                flexDirection={{ base: "column", md: "row" }}
                w="100%"
                justify="center"
              >
                <MotionBox whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    as={NextLink}
                    href="/funding"
                    bg={buttonBg}
                    color={buttonText}
                    _hover={{ bg: "transparent", color: "white", borderColor: "white" }}
                    _focus={{ boxShadow: "0 0 0 3px teal.300" }}
                    borderWidth="2px"
                    borderColor="white"
                    size={{ base: "md", md: "lg" }}
                    px={{ base: 8, md: 8 }}
                    py={{ base: 6, md: 6 }}
                    fontSize={{ base: "sm", md: "lg" }}
                    boxShadow={`0 8px 24px ${shadowColor}`}
                    borderRadius="full"
                    transition="all 0.3s ease"
                    aria-label="Launch Your Project"
                    w={{ base: "80%", md: "auto" }}
                    mb={{ base: 4, md: 0 }}
                    whiteSpace="normal"
                    textAlign="center"
                  >
                    Launch Your Project
                  </Button>
                </MotionBox>
                <MotionBox whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    as={NextLink}
                    href="/explore"
                    bg={buttonBg}
                    color={buttonText}
                    _hover={{ bg: "transparent", color: "white", borderColor: "white" }}
                    _focus={{ boxShadow: "0 0 0 3px teal.300" }}
                    borderWidth="2px"
                    borderColor="white"
                    size={{ base: "md", md: "lg" }}
                    px={{ base: 8, md: 8 }}
                    py={{ base: 6, md: 6 }}
                    fontSize={{ base: "sm", md: "lg" }}
                    boxShadow={`0 8px 24px ${shadowColor}`}
                    borderRadius="full"
                    transition="all 0.3s ease"
                    aria-label="Discover Projects"
                    w={{ base: "80%", md: "auto" }}
                    whiteSpace="normal"
                    textAlign="center"
                  >
                    Discover Projects
                  </Button>
                </MotionBox>
              </HStack>
            </MotionBox>
          </VStack>
        </MotionBox>
      </MotionBox>

      {/* Two Ways to Fund Your Vision */}
      <Container maxW="container.xl" py={14} mt={22}>
        <Heading
          as="h2"
          size={{ base: "lg", md: "2xl" }}
          mb={10}
          fontWeight="bold"
          color={textColor}
          textShadow={`0 1px 3px ${shadowColor}`}
          lineHeight={1.3}
          fontFamily="Poppins, sans-serif"
        >
          Two Ways to Fund Your Vision
          <Box mt={3} width="60px" height="4px" bgGradient="linear(to-r, teal.400, teal.500)" borderRadius="full" mx="auto" />
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
          {[
            {
              icon: FaUsers,
              title: "Crowdfunding",
              text: "Raise ETH from supporters worldwide.",
            },
            {
              icon: FaCoins,
              title: "Treasury Grants",
              text: "Secure milestone-based funding from Creova’s community treasury.",
            },
          ].map((item, index) => (
            <MotionBox
              key={index}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 * index }}
              flex="1"
            >
              <VStack
                spacing={5}
                p={8}
                bg={cardBg}
                borderRadius="3xl"
                boxShadow={`0 12px 32px ${shadowColor}`}
                height="100%"
                minH="250px"
                justify="space-between"
                _hover={{ transform: "translateY(-6px)", boxShadow: `0 16px 40px ${shadowColor}` }}
              >
                <Box
                  bg="teal.500"
                  p={5}
                  borderRadius="full"
                  boxShadow={`0 4px 8px ${shadowColor}`}
                  transition="transform 0.3s ease-in-out"
                  _hover={{ transform: "scale(1.1)" }}
                >
                  <motion.div whileHover={{ rotate: 360, transition: { duration: 0.8 } }}>
                    <item.icon size="48px" color="white" aria-label={item.title} />
                  </motion.div>
                </Box>
                <VStack spacing={3} flex="1" justify="center">
                  <Heading as="h3" size="md" color={textColor} fontWeight="bold" fontFamily="Poppins, sans-serif">
                    {item.title}
                  </Heading>
                  <Text color={subTextColor} lineHeight={1.7} fontSize="md" px={2}>
                    {item.text}
                  </Text>
                </VStack>
              </VStack>
            </MotionBox>
          ))}
        </SimpleGrid>
      </Container>

      {/* How Creova Works and What Makes Us Different */}
      {[
        {
          title: "How Creova Works",
          items: [
            { icon: FaCheckCircle, title: "1. Pick Your Path", text: "Crowdfund with your community or pitch for a grant." },
            { icon: FaVoteYea, title: "2. Submit Your Vision", text: "Share your project with our DAO." },
            { icon: FaCoins, title: "3. Get Funded Fast", text: "Receive ETH directly via smart contracts." },
            { icon: FaArrowRight, title: "4. Build & Scale", text: "Meet milestones to unlock ongoing support." },
          ],
        },
        {
          title: "What Makes Us Different?",
          items: [
            { icon: FaBolt, title: "Instant Funding", text: "ETH hits your wallet via blockchain, no delays." },
            { icon: FaUsers, title: "Community-Led", text: "Our DAO decides, empowering you transparently." },
            { icon: FaDollarSign, title: "No Gatekeepers", text: "Direct funding with low fees, full control." },
            { icon: FaLock, title: "Blockchain-Backed", text: "Smart contracts lock in trust and transparency." },
          ],
        },
      ].map((section, idx) => (
        <Container key={idx} maxW="container.xl" py={14} mt={idx === 0 ? 0 : 0}>
          <Heading
            as="h2"
            size={{ base: "lg", md: "2xl" }}
            mb={10}
            fontWeight="bold"
            color={textColor}
            textShadow={`0 1px 3px ${shadowColor}`}
            lineHeight={1.3}
            fontFamily="Poppins, sans-serif"
          >
            {section.title}
            <Box mt={3} width="60px" height="4px" bgGradient="linear(to-r, teal.400, teal.500)" borderRadius="full" mx="auto" />
          </Heading>
          <SimpleGrid columns={{ base: 1, md: section.items.length }} spacing={8}>
            {section.items.map((item, index) => (
              <MotionBox
                key={index}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 * index }}
                flex="1"
              >
                <VStack
                  spacing={5}
                  p={8}
                  bg={cardBg}
                  borderRadius="3xl"
                  boxShadow={`0 12px 32px ${shadowColor}`}
                  height="100%"
                  minH="300px"
                  justify="space-between"
                  _hover={{ transform: "translateY(-6px)", boxShadow: `0 16px 40px ${shadowColor}` }}
                >
                  <Box
                    bg="teal.500"
                    p={5}
                    borderRadius="full"
                    boxShadow={`0 4px 8px ${shadowColor}`}
                    transition="transform 0.3s ease-in-out"
                    _hover={{ transform: "scale(1.1)" }}
                  >
                    <motion.div whileHover={{ rotate: 360, transition: { duration: 0.8 } }}>
                      <item.icon size="48px" color="white" aria-label={item.title} />
                    </motion.div>
                  </Box>
                  <VStack spacing={3} flex="1" justify="center">
                    <Heading as="h3" size="md" color={textColor} fontWeight="bold" fontFamily="Poppins, sans-serif">
                      {item.title}
                    </Heading>
                    <Text color={subTextColor} lineHeight={1.7} fontSize="md" px={2}>
                      {item.text}
                    </Text>
                  </VStack>
                </VStack>
              </MotionBox>
            ))}
          </SimpleGrid>
        </Container>
      ))}

      {/* Spotlight Section */}
      <Container maxW="container.md" py={14} mb={22}>
        <Heading
          as="h2"
          size={{ base: "lg", md: "2xl" }}
          mb={10}
          fontWeight="bold"
          color={textColor}
          textShadow={`0 1px 3px ${shadowColor}`}
          lineHeight={1.3}
          fontFamily="Poppins, sans-serif"
        >
          Spotlight Project
          <Box mt={3} width="60px" height="4px" bgGradient="linear(to-r, teal.400, teal.500)" borderRadius="full" mx="auto" />
        </Heading>
        {spotlightCampaign ? (
          <Flex
            direction={{ base: "column", md: "row" }}
            bgGradient={useColorModeValue("linear(to-r, teal.400, teal.100)", "linear(to-r, teal.600, teal.900)")}
            borderRadius="3xl"
            overflow="hidden"
            boxShadow={`0 16px 48px ${shadowColor}`}
            align="center"
            mx="auto"
            maxW="3xl"
          >
            <Box flex="1" alignSelf="stretch">
              <Image
                src={spotlightCampaign.heroMediaCID ? `https://ipfs.io/ipfs/${spotlightCampaign.heroMediaCID}` : "/greenfuture-impact.png"}
                alt={`${spotlightCampaign.name} Spotlight`}
                objectFit="cover"
                height="100%"
                width="100%"
              />
            </Box>
            <VStack flex="1" spacing={4} p={{ base: 6, md: 8 }} align="center" justify="center" textAlign="center">
              <Heading size="lg" color={textColor} fontFamily="Poppins, sans-serif">
                {spotlightCampaign.name}
              </Heading>
              <Text fontSize={{ base: "md", md: "lg" }} color={subTextColor} px={2}>
                {spotlightCampaign.description}
              </Text>
              <Button
                as={NextLink}
                href="/projects/1"
                colorScheme="teal"
                size="md"
                px={8}
                _hover={{ transform: "translateY(-2px)", boxShadow: `0 8px 24px ${shadowColor}` }}
                _focus={{ boxShadow: "0 0 0 3px teal.300" }}
                borderRadius="full"
                mt={4}
                aria-label="View Project"
              >
                View Project
              </Button>
            </VStack>
          </Flex>
        ) : (
          <Text color={subTextColor}>No spotlight project yet—yours could be next!</Text>
        )}
      </Container>

      {/* Testimonials Section */}
      <Container maxW="container.xl" py={14} mb={22}>
        <Heading
          as="h2"
          size={{ base: "lg", md: "2xl" }}
          mb={10}
          fontWeight="bold"
          color={textColor}
          textShadow={`0 1px 3px ${shadowColor}`}
          lineHeight={1.3}
          fontFamily="Poppins, sans-serif"
        >
          Voices shaping Web3 see funding like Creova’s as the future:
          <Box mt={3} width="60px" height="4px" bgGradient="linear(to-r, teal.400, teal.500)" borderRadius="full" mx="auto" />
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
          {[
            {
              quote: "“Decentralized systems can fund public goods without gatekeepers—blockchain lets us coordinate value creation at scale.”",
              name: "Vitalik Buterin",
              title: "Ethereum Co-Founder",
              badge: "/ethereum-logo.png",
            },
            {
              quote: "“The future of the web is decentralized infrastructure—where creators own their work and users control their data.”",
              name: "Juan Benet",
              title: "Founder, IPFS & Filecoin",
              badge: "/ipfs-logo.png",
            },
            {
              quote: "“Scaling Ethereum means scaling opportunity—making Web3 accessible to everyone, everywhere.”",
              name: "Mihailo Bjelic",
              title: "Polygon Co-Founder",
              badge: "/polygon-logo.png",
            },
          ].map((testimonial, idx) => (
            <MotionBox
              key={idx}
              initial={{ x: 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: idx * 0.3 }}
              p={8}
              bg={cardBg}
              borderRadius="xl"
              borderWidth="1px"
              borderColor="teal.200"
              boxShadow={`0 12px 32px ${shadowColor}`}
              _hover={{ transform: "translateY(-8px)", boxShadow: `0 20px 40px ${shadowColor}` }}
              minH="300px"
            >
              <VStack spacing={6} height="100%" justify="space-between">
                <Text fontSize="lg" color={subTextColor} fontWeight="medium" textAlign="center">
                  {testimonial.quote}
                </Text>
                <VStack spacing={2}>
                  <Box w="40px" h="2px" bg="teal.400" borderRadius="full" />
                  <HStack spacing={3}>
                    <motion.div whileHover={{ rotate: 360, transition: { duration: 0.8 } }}>
                      <Image
                        src={testimonial.badge}
                        alt={`${testimonial.name} badge`}
                        boxSize="60px"
                        borderRadius="full"
                        bgGradient="linear(to-r, teal.400, teal.600)"
                        p={2}
                      />
                    </motion.div>
                    <VStack spacing={0} align="start">
                      <Text fontWeight="bold" color="teal.500" fontFamily="Poppins, sans-serif">
                        {testimonial.name}
                      </Text>
                      <Text fontSize="sm" color={subTextColor}>
                        {testimonial.title}
                      </Text>
                    </VStack>
                  </HStack>
                </VStack>
              </VStack>
            </MotionBox>
          ))}
        </SimpleGrid>
      </Container>

      {/* Stats Section */}
      <Container maxW="container.xl" py={14} mb={22}>
        <Heading
          as="h2"
          size={{ base: "lg", md: "2xl" }}
          mb={10}
          fontWeight="bold"
          color={textColor}
          textShadow={`0 1px 3px ${shadowColor}`}
          lineHeight={1.3}
          fontFamily="Poppins, sans-serif"
        >
          Creova’s Impact So Far
          <Box mt={3} width="60px" height="4px" bgGradient="linear(to-r, teal.400, teal.500)" borderRadius="full" mx="auto" />
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
          <MotionBox
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            bg={cardBg}
            p={8}
            borderRadius="3xl"
            boxShadow={`0 12px 32px ${shadowColor}`}
          >
            <Heading size="xl" color={useColorModeValue("teal.500", "teal.300")} fontFamily="Poppins, sans-serif">
              <StatNumber endValue={totalFunding} suffix=" ETH" />
            </Heading>
            <Text color={subTextColor}>Total Funding Raised</Text>
          </MotionBox>
          <MotionBox
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            bg={cardBg}
            p={8}
            borderRadius="3xl"
            boxShadow={`0 12px 32px ${shadowColor}`}
          >
            <Heading size="xl" color={useColorModeValue("teal.500", "teal.300")} fontFamily="Poppins, sans-serif">
              <StatNumber endValue={totalProjects} />
            </Heading>
            <Text color={subTextColor}>Successful Projects Funded</Text>
          </MotionBox>
          <MotionBox
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            bg={cardBg}
            p={8}
            borderRadius="3xl"
            boxShadow={`0 12px 32px ${shadowColor}`}
          >
            <Heading size="xl" color={useColorModeValue("teal.500", "teal.300")} fontFamily="Poppins, sans-serif">
              <StatNumber endValue={totalMembers} />
            </Heading>
            <Text color={subTextColor}>Creova Members</Text>
          </MotionBox>
        </SimpleGrid>
      </Container>

      {/* CTA Section */}
      <Container maxW="container.xl" py={14}>
        <Flex
          direction={{ base: "column", md: "row" }}
          align="center"
          justify="space-between"
          bgGradient={useColorModeValue("linear(to-br, teal.400, teal.100)", "linear(to-br, teal.600, teal.900)")}
          borderRadius="2xl"
          p={10}
          boxShadow={`0 16px 48px ${shadowColor}`}
        >
          <Box textAlign={{ base: "center", md: "left" }}>
            <Heading as="h2" size="xl" mb={4} color={textColor} fontFamily="Poppins, sans-serif" lineHeight={1.3}>
              Let's Build Your Vision Now
            </Heading>
            <Text fontSize="lg" color={subTextColor}>
              Got an idea or question? Contact us today—we’re ready to back your vision.
            </Text>
          </Box>
          <Button
            colorScheme="teal"
            size="lg"
            px={10}
            as={Link}
            href="mailto:adam@creova.xyz"
            _hover={{ transform: "translateY(-4px)", boxShadow: `0 8px 24px ${shadowColor}` }}
            _focus={{ boxShadow: "0 0 0 3px teal.300" }}
            borderRadius="full"
            mt={{ base: 8, md: 0 }}
            aria-label="Contact Creova Team"
          >
            Contact Creova
          </Button>
        </Flex>
      </Container>

      <Footer />
    </Flex>
  );
}