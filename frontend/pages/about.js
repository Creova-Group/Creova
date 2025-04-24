import { Box, Heading, Text, Container, VStack, Flex, Button, SimpleGrid, HStack, useColorModeValue, Image } from "@chakra-ui/react";
import { useRouter } from "next/router";
import NextLink from "next/link";
import { motion } from "framer-motion";
import { FaRocket, FaCoins, FaHandshake, FaKey, FaDollarSign, FaLock, FaUsers, FaBolt, FaBalanceScale } from "react-icons/fa";
import Footer from "../components/Footer";
import { useEffect } from "react";

const MotionBox = motion(Box);

export default function About() {
  const router = useRouter();

  // Dynamic colors based on color mode, matching index.js
  const bgGradient = useColorModeValue("linear(to-br, #14B8A6, #ffffff)", "linear(to-br, #0D9488, #1A202C)");
  const textColor = useColorModeValue("gray.900", "white");
  const subTextColor = useColorModeValue("gray.700", "gray.300");
  const cardBg = useColorModeValue("white", "gray.800");
  const buttonBg = useColorModeValue("white", "gray.700");
  const buttonText = useColorModeValue("teal.600", "teal.200");
  const shadowColor = useColorModeValue("rgba(0, 0, 0, 0.2)", "rgba(255, 255, 255, 0.1)");
  const founderCardGradient = useColorModeValue("linear(to-br, teal.50, white)", "linear(to-br, teal.900, gray.800)");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Flex
      direction="column"
      minH="100vh"
      bgGradient={bgGradient}
      align="center"
      justify="flex-start"
      textAlign="center"
      pt="64px"
      overflow="hidden"
    >
      {/* Hero Section */}
      <MotionBox
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        maxW="container.lg"
        px={{ base: 4, md: 8 }}
        py={20}
      >
        <VStack spacing={{ base: 8, md: 8 }} w="100%">
          <Heading
            as="h1"
            size={{ base: "lg", md: "3xl" }}
            fontWeight="extrabold"
            color="white"
            lineHeight={1.3}
            textShadow={useColorModeValue("0 2px 8px rgba(0, 0, 0, 0.8)", "0 4px 12px rgba(0, 0, 0, 0.9)")}
            fontFamily="Poppins, sans-serif"
            px={{ base: 2, md: 0 }}
          >
            Empowering Community-Led Public Goods Projects
          </Heading>
          <Text
            fontSize={{ base: "sm", md: "lg" }}
            color="white"
            mt={6}
            maxW={{ base: "90%", md: "800px" }}
            mx="auto"
            lineHeight={1.7}
            textShadow={useColorModeValue("0 2px 4px rgba(0, 0, 0, 0.8)", "0 2px 6px rgba(0, 0, 0, 0.9)")}
            px={{ base: 2, md: 0 }}
          >
            Creova supports <strong>public goods projects</strong> with decentralised, transparent, community-driven funding. From climate action to open-source tools, we empower builders to make a difference without middlemen.
          </Text>
          <HStack
            spacing={{ base: 4, md: 5 }}
            mt={{ base: 8, md: 8 }}
            justify="center"
            flexDirection={{ base: "column", md: "row" }}
            w="100%"
          >
            <MotionBox whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                as={NextLink}
                href="/funding"
                bg={buttonBg}
                color={buttonText}
                _hover={{ bg: "transparent", color: "white", borderColor: "white" }}
                borderWidth="2px"
                borderColor="white"
                size={{ base: "md", md: "lg" }}
                px={{ base: 8, md: 8 }}
                py={{ base: 6, md: 6 }}
                fontSize={{ base: "sm", md: "lg" }}
                boxShadow={`0 8px 24px ${shadowColor}`}
                borderRadius="full"
                transition="all 0.3s ease"
                w={{ base: "80%", md: "auto" }}
                mb={{ base: 4, md: 0 }}
                whiteSpace="normal"
                textAlign="center"
              >
                Launch Your Impact
              </Button>
            </MotionBox>
            <MotionBox whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                as={NextLink}
                href="/explore"
                bg={buttonBg}
                color={buttonText}
                _hover={{ bg: "transparent", color: "white", borderColor: "white" }}
                borderWidth="2px"
                borderColor="white"
                size={{ base: "md", md: "lg" }}
                px={{ base: 8, md: 8 }}
                py={{ base: 6, md: 6 }}
                fontSize={{ base: "sm", md: "lg" }}
                boxShadow={`0 8px 24px ${shadowColor}`}
                borderRadius="full"
                transition="all 0.3s ease"
                w={{ base: "80%", md: "auto" }}
                whiteSpace="normal"
                textAlign="center"
              >
                Explore All Projects
              </Button>
            </MotionBox>
          </HStack>
        </VStack>
      </MotionBox>

      {/* How Creova Works */}
      <Container maxW="container.xl" py={14}>
        <Heading
          as="h2"
          size={{ base: "lg", md: "2xl" }}
          mb={10}
          fontWeight="bold"
          color={textColor}
          fontFamily="Poppins, sans-serif"
          textShadow={`0 1px 3px ${shadowColor}`}
        >
          How Creova Powers High-Impact Projects
          <Box mt={3} width="60px" height="4px" bgGradient="linear(to-r, teal.400, teal.500)" borderRadius="full" mx="auto" />
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
          {[
            { icon: FaKey, title: "1. Choose Your Funding Path", text: "Crowdfunding or Treasury Grants for high-impact initiatives." },
            { icon: FaBalanceScale, title: "2. Transparent Approval", text: "Community votes ensure only impactful projects succeed." },
            { icon: FaCoins, title: "3. Transparent Distribution", text: "Smart contracts enable milestone-based funding that’s verifiable and secure." },
          ].map((item, idx) => (
            <MotionBox
              key={idx}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 * idx }}
            >
              <VStack
                spacing={5}
                p={8}
                bg={cardBg}
                borderRadius="3xl"
                boxShadow={`0 12px 32px ${shadowColor}`}
                minH="300px"
                _hover={{ transform: "translateY(-6px)", boxShadow: `0 16px 40px ${shadowColor}` }}
                transition="all 0.3s ease"
              >
                <Box
                  bg="teal.500"
                  p={5}
                  borderRadius="full"
                  boxShadow={`0 4px 8px ${shadowColor}`}
                >
                  <motion.div whileHover={{ rotate: 360, transition: { duration: 0.8 } }}>
                    <item.icon size="48px" color="white" />
                  </motion.div>
                </Box>
                <Heading as="h3" size="md" color={textColor} fontFamily="Poppins, sans-serif">
                  {item.title}
                </Heading>
                <Text color={subTextColor} lineHeight={1.7} fontSize="md">
                  {item.text}
                </Text>
              </VStack>
            </MotionBox>
          ))}
        </SimpleGrid>
      </Container>

      {/* Sustainability at Creova */}
      <Container maxW="container.xl" py={14}>
        <Heading
          as="h2"
          size={{ base: "lg", md: "2xl" }}
          mb={10}
          fontWeight="bold"
          color={textColor}
          fontFamily="Poppins, sans-serif"
          textShadow={`0 1px 3px ${shadowColor}`}
        >
          How Creova Sustains Itself
          <Box mt={3} width="60px" height="4px" bgGradient="linear(to-r, teal.400, teal.500)" borderRadius="full" mx="auto" />
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} justifyItems="center">
          {[
            { icon: FaCoins, title: "Success-Based Fees", text: "5% fee on crowdfunding fuels impactful growth." },
            { icon: FaRocket, title: "Premium Memberships", text: "Tools for creators to maximize impact.    COMING SOON" },
            { icon: FaBalanceScale, title: "Controlled Grants", text: "10% of treasury supports selected high-impact projects." },
          ].map((item, idx) => (
            <MotionBox
              key={idx}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 * idx }}
            >
              <VStack
                spacing={5}
                p={8}
                bg={cardBg}
                borderRadius="3xl"
                boxShadow={`0 12px 32px ${shadowColor}`}
                minH="300px"
                _hover={{ transform: "translateY(-6px)", boxShadow: `0 16px 40px ${shadowColor}` }}
                transition="all 0.3s ease"
              >
                <Box
                  bg="teal.500"
                  p={5}
                  borderRadius="full"
                  boxShadow={`0 4px 8px ${shadowColor}`}
                >
                  <motion.div whileHover={{ rotate: 360, transition: { duration: 0.8 } }}>
                    <item.icon size="48px" color="white" />
                  </motion.div>
                </Box>
                <Heading as="h3" size="md" color={textColor} fontFamily="Poppins, sans-serif">
                  {item.title}
                </Heading>
                <Text color={subTextColor} lineHeight={1.7} fontSize="md">
                  {item.text}
                </Text>
              </VStack>
            </MotionBox>
          ))}
        </SimpleGrid>
      </Container>

      {/* Why Choose Creova */}
      <Container maxW="container.xl" py={14}>
        <Heading
          as="h2"
          size={{ base: "lg", md: "2xl" }}
          mb={10}
          fontWeight="bold"
          color={textColor}
          fontFamily="Poppins, sans-serif"
          textShadow={`0 1px 3px ${shadowColor}`}
        >
          Why Creova for High-Impact Projects?
          <Box mt={3} width="60px" height="4px" bgGradient="linear(to-r, teal.400, teal.500)" borderRadius="full" mx="auto" />
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={8}>
          {[
            { icon: FaLock, title: "Decentralised & Secure", text: "Smart contracts protect impactful missions." },
            { icon: FaBolt, title: "Transparent Funding", text: "All funding is transparent, milestone-based, and publicly verifiable on-chain." },
            { icon: FaUsers, title: "Community Driven", text: "DAO votes prioritise real-world impact." },
            { icon: FaDollarSign, title: "No Hidden Fees", text: "Transparent costs for maximum impact." },
          ].map((item, idx) => (
            <MotionBox
              key={idx}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 * idx }}
            >
              <VStack
                spacing={5}
                p={8}
                bg={cardBg}
                borderRadius="3xl"
                boxShadow={`0 12px 32px ${shadowColor}`}
                minH="300px"
                _hover={{ transform: "translateY(-6px)", boxShadow: `0 16px 40px ${shadowColor}` }}
                transition="all 0.3s ease"
              >
                <Box
                  bg="teal.500"
                  p={5}
                  borderRadius="full"
                  boxShadow={`0 4px 8px ${shadowColor}`}
                >
                  <motion.div whileHover={{ rotate: 360, transition: { duration: 0.8 } }}>
                    <item.icon size="48px" color="white" />
                  </motion.div>
                </Box>
                <Heading as="h3" size="md" color={textColor} fontFamily="Poppins, sans-serif">
                  {item.title}
                </Heading>
                <Text color={subTextColor} lineHeight={1.7} fontSize="md">
                  {item.text}
                </Text>
              </VStack>
            </MotionBox>
          ))}
        </SimpleGrid>
      </Container>

      {/* Our Story Section */}
      <Container maxW="container.xl" py={14}>
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <VStack
            spacing={6}
            textAlign="center"
            bg={cardBg}
            p={8}
            borderRadius="3xl"
            boxShadow={`0 12px 32px ${shadowColor}`}
            maxW="800px"
            mx="auto"
          >
            <Heading
              as="h2"
              size={{ base: "lg", md: "2xl" }}
              fontWeight="bold"
              color={textColor}
              fontFamily="Poppins, sans-serif"
              textShadow={`0 1px 3px ${shadowColor}`}
            >
              Our Story
              <Box mt={3} width="60px" height="4px" bgGradient="linear(to-r, teal.400, teal.500)" borderRadius="full" mx="auto" />
            </Heading>
            <Text
              fontSize={{ base: "md", md: "lg" }}
              color={subTextColor}
              lineHeight={1.7}
            >
              Creova was born from a belief: that open-source public goods and mission-driven projects deserve equitable, transparent support, free from commercial or financial barriers.
              <br /><br />
              We built Creova for creators, innovators, and changemakers who are building the future. Whether you’re launching a grassroots project or tackling global challenges, you shouldn’t need to chase investors to bring your ideas to life.
              <br /><br />
              Our mission is to unlock decentralised, community-led funding for ideas that serve the public good, using Ethereum technology to advance meaningful, lasting impact.
              <br /><br />
              No more middlemen. No more closed doors. Just open funding, powered by community, on-chain trust, and a fairer model for all.
            </Text>
          </VStack>
        </MotionBox>
      </Container>

      {/* Divider */}
      <Box
        width="60px"
        height="2px"
        bgGradient="linear(to-r, teal.400, teal.500)"
        borderRadius="full"
        mx="auto"
        my={6}
      />

      {/* Founder Note Section */}
      <Container maxW="container.xl" py={14}>
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Heading
            as="h2"
            size={{ base: "lg", md: "2xl" }}
            fontWeight="bold"
            color={textColor}
            fontFamily="Poppins, sans-serif"
            textAlign="center"
            mb={10}
            textShadow={`0 1px 3px ${shadowColor}`}
          >
            A Note from Our Founder
            <Box mt={3} width="60px" height="4px" bgGradient="linear(to-r, teal.400, teal.500)" borderRadius="full" mx="auto" />
          </Heading>
          <VStack
            spacing={4}
            textAlign="center"
            bgGradient={founderCardGradient}
            p={{ base: 6, md: 8 }}
            borderRadius="2xl"
            boxShadow={`0 8px 24px ${shadowColor}`}
            maxW="container.lg" // Wider across the page
            mx="auto"
          >
            <Text
              fontSize={{ base: "md", md: "lg" }}
              color={subTextColor}
              lineHeight={1.8}
              fontFamily="Inter, sans-serif"
              textAlign="center"
              maxW="800px"
              mx="auto"
              px={{ base: 4, md: 6 }}
            >
              "I started Creova because I believe funding should be open to everyone—not just those with connections. Too often, bold ideas are sidelined by a system not built for them. Creova changes that.
              <br /><br />
              It’s a platform for dreamers and doers. It is transparent, community-powered, and grounded in open collaboration. This isn’t about tokens or hype. It’s about building lasting impact with integrity.
              <br /><br />
              If you’re building something meaningful, Creova is for you."
            </Text>
            <HStack spacing={3} align="center">
              <Text
                fontSize={{ base: "md", md: "lg" }}
                fontWeight="bold"
                color={textColor}
                fontFamily="Inter, sans-serif" 
              >
                — Adam, Founder
              </Text>
              <Image
                src="/logo.png"
                alt="Creova Logo"
                boxSize={{ base: "128px", md: "160px" }} 
                objectFit="contain"
              />
            </HStack>
          </VStack>
        </MotionBox>
      </Container>

      {/* CTA Section  */}
      <Container maxW="container.xl" py={14} pb={20}>
        <Flex
          direction={{ base: "column", md: "row" }}
          align="center"
          justify="space-between"
          bgGradient={useColorModeValue("linear(to-br, teal.400, teal.100)", "linear(to-br, teal.600, teal.900)")}
          borderRadius="2xl"
          p={{ base: 8, md: 10 }}
          boxShadow={`0 16px 48px ${shadowColor}`}
        >
          <Box textAlign={{ base: "center", md: "left" }}>
            <Heading as="h2" size={{ base: "lg", md: "xl" }} mb={4} color={textColor} fontFamily="Poppins, sans-serif">
              Ready to Support Community Innovation?
            </Heading>
            <Text fontSize={{ base: "md", md: "lg" }} color={subTextColor}>
              Join Creova to support open, community-driven projects through decentralised funding.
            </Text>
          </Box>
          <Button
            as={NextLink}
            href="/funding"
            colorScheme="teal"
            size={{ base: "md", md: "lg" }}
            px={{ base: 8, md: 10 }}
            mt={{ base: 6, md: 0 }}
            borderRadius="full"
            _hover={{ transform: "translateY(-4px)", boxShadow: `0 8px 24px ${shadowColor}` }}
          >
            Launch Now
          </Button>
        </Flex>
      </Container>

      <Footer />
    </Flex>
  );
}