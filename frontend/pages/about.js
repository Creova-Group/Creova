import { Box, Heading, Text, Container, VStack, Flex, Button, SimpleGrid, HStack, useColorModeValue } from "@chakra-ui/react";
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
            Funding High-Impact Projects, Community Empowered
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
            Creova drives <strong>high-impact projects</strong> with decentralised, transparent, and instant Web3 funding. From renewable energy to education, we empower creators to make a difference—without gatekeepers.
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
            { icon: FaCoins, title: "3. Instant Funding", text: "Blockchain delivers funds fast to drive real change." },
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
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={8}>
          {[
            { icon: FaCoins, title: "Success-Based Fees", text: "5% fee on crowdfunding fuels impactful growth." },
            { icon: FaRocket, title: "Premium Memberships", text: "Tools for creators to maximize impact.    COMING SOON" },
            { icon: FaHandshake, title: "Tokenised Revenue", text: "Share success with your community.    COMING SOON" },
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
            { icon: FaBolt, title: "Instant Funding", text: "Fast funds to ignite high-impact change." },
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
            <Heading as="h2" size="xl" mb={4} color={textColor} fontFamily="Poppins, sans-serif">
              Ready to Drive Impact?
            </Heading>
            <Text fontSize="lg" color={subTextColor}>
              Launch your high-impact project with Creova today.
            </Text>
          </Box>
          <Button
            as={NextLink}
            href="/funding"
            colorScheme="teal"
            size="lg"
            px={10}
            mt={{ base: 8, md: 0 }}
            borderRadius="full"
            _hover={{ transform: "translateY(-4px)", boxShadow: `0 8px 24px ${shadowColor}` }}
          >
            Launch Now
          </Button>
        </Flex>
      </Container>

      {/* Our Story Section */}
      <Container maxW="container.xl" py={14}>
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <VStack spacing={6} textAlign="center">
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
              maxW="800px"
              lineHeight={1.7}
            >
              Creova was born from a belief: that funding should be accessible, transparent, and owned by the people—not gated by VCs, banks, or traditional gatekeepers.
              <br /><br />
              We built Creova for creators, innovators, and changemakers who are building the future. Whether you’re launching a grassroots project or tackling global challenges, you shouldn’t need to chase investors to bring your ideas to life.
              <br /><br />
              Our mission is to unlock decentralised capital for ideas that matter—using Web3 technology to fund the next wave of impact-driven projects.
              <br /><br />
              No more middlemen. No more closed doors. Just open funding, powered by community, on-chain trust, and a fairer model for all.
            </Text>
          </VStack>
        </MotionBox>
      </Container>

      {/* Founder Note Section */}
      <Container maxW="container.xl" py={14} pb={20}>
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <VStack
            spacing={6}
            textAlign="left"
            bg={cardBg}
            p={8}
            borderRadius="3xl"
            boxShadow={`0 12px 32px ${shadowColor}`}
            maxW="800px"
            mx="auto"
          >
            <Text
              fontSize={{ base: "md", md: "lg" }}
              color={subTextColor}
              lineHeight={1.7}
            >
              I started Creova because I believe funding should be open to everyone—not just those who know the right people or speak the right language.
              <br /><br />
              Too often, bold ideas are left behind because they don’t fit into traditional boxes. I’ve seen creators, builders, and mission-driven founders with powerful visions struggle—not because their ideas weren’t good enough, but because the system wasn’t built for them.
              <br /><br />
              Creova is my response to that. A decentralised platform designed to support the dreamers, the doers, the underdogs.
              <br /><br />
              This isn’t just a funding tool—it’s a shift in how capital flows, who gets to decide, and what kind of world we build together.
              <br /><br />
              If you’re someone building something meaningful, something that matters—Creova was made for you.
            </Text>
            <Text
              fontSize="lg"
              fontWeight="bold"
              color={textColor}
              fontFamily="Poppins, sans-serif"
            >
              — Adam<br />Founder, Creova
            </Text>
          </VStack>
        </MotionBox>
      </Container>

      <Footer />
    </Flex>
  );
}