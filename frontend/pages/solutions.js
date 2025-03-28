import { Box, Heading, Text, Container, VStack, SimpleGrid, Flex, Button, HStack, useColorModeValue } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FaCoins, FaUsers, FaHandshake, FaClock, FaDollarSign, FaLock, FaCheckCircle } from "react-icons/fa";
import NextLink from "next/link";
import Footer from "../components/Footer";

const MotionBox = motion(Box);

const solutions = [
  {
    icon: FaCoins,
    title: "Crowdfunding",
    text: "Launch high-impact projects with instant, community-driven funding—no intermediaries required.",
  },
  {
    icon: FaUsers,
    title: "Treasury Grants",
    text: "Secure strategic funding for high-impact initiatives through transparent, community-voted grants.",
  },
  {
    icon: FaHandshake,
    title: "Tokenised Revenue Sharing",
    text: "Share your project’s success with backers via tokenised future earnings, fostering community investment.   COMING SOON",
  },
];

export default function Solutions() {
  // Dynamic colors based on color mode, matching index.js
  const bgGradient = useColorModeValue("linear(to-br, #14B8A6, #ffffff)", "linear(to-br, #0D9488, #1A202C)");
  const textColor = useColorModeValue("gray.900", "white");
  const subTextColor = useColorModeValue("gray.700", "gray.300");
  const cardBg = useColorModeValue("white", "gray.800");
  const buttonBg = useColorModeValue("white", "gray.700");
  const buttonText = useColorModeValue("teal.600", "teal.200");
  const shadowColor = useColorModeValue("rgba(0, 0, 0, 0.2)", "rgba(255, 255, 255, 0.1)");

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
            size={{ base: "lg", md: "3xl" }} // Reduced size on mobile for consistency with Home and About pages
            fontWeight="extrabold"
            color="white"
            lineHeight={1.3}
            textShadow={useColorModeValue("0 2px 8px rgba(0, 0, 0, 0.5)", "0 4px 12px rgba(0, 0, 0, 0.9)")}
            fontFamily="Poppins, sans-serif"
            px={{ base: 2, md: 0 }}
          >
            Solutions for High-Impact Funding
          </Heading>
          <Text
            fontSize={{ base: "sm", md: "lg" }} // Reduced font size on mobile for consistency
            color="white"
            mt={6}
            maxW={{ base: "90%", md: "800px" }} // Consistent max width on mobile
            mx="auto"
            lineHeight={1.7}
            textShadow={useColorModeValue("0 2px 4px rgba(0, 0, 0, 0.8)", "0 2px 6px rgba(0, 0, 0, 0.9)")}
            px={{ base: 2, md: 0 }}
          >
            Creova offers innovative funding solutions to empower communities and creators, bringing <strong>high-impact projects</strong> to life with speed and transparency.
          </Text>
          <HStack
            spacing={{ base: 4, md: 5 }}
            mt={{ base: 8, md: 8 }} // Consistent margin-top for breathing room
            justify="center"
            flexDirection={{ base: "column", md: "row" }} // Stack buttons on mobile
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
                size={{ base: "md", md: "lg" }} // Adjusted size for mobile
                px={{ base: 8, md: 8 }} // Consistent padding
                py={{ base: 6, md: 6 }}
                fontSize={{ base: "sm", md: "lg" }} // Reduced font size on mobile for consistency
                boxShadow={`0 8px 24px ${shadowColor}`}
                borderRadius="full"
                transition="all 0.3s ease"
                w={{ base: "80%", md: "auto" }} // Consistent width on mobile
                mb={{ base: 4, md: 0 }} // Consistent margin-bottom for spacing
                whiteSpace="normal" // Prevent text overlap
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
                borderWidth="2px"
                borderColor="white"
                size={{ base: "md", md: "lg" }} // Adjusted size for mobile
                px={{ base: 8, md: 8 }} // Consistent padding
                py={{ base: 6, md: 6 }}
                fontSize={{ base: "sm", md: "lg" }} // Reduced font size on mobile for consistency
                boxShadow={`0 8px 24px ${shadowColor}`}
                borderRadius="full"
                transition="all 0.3s ease"
                w={{ base: "80%", md: "auto" }} // Consistent width on mobile
                whiteSpace="normal" // Prevent text overlap
                textAlign="center"
              >
                Discover Projects
              </Button>
            </MotionBox>
          </HStack>
        </VStack>
      </MotionBox>

      {/* Solutions Section */}
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
          Our Funding Solutions
          <Box mt={3} width="60px" height="4px" bgGradient="linear(to-r, teal.400, teal.500)" borderRadius="full" mx="auto" />
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
          {solutions.map((solution, idx) => (
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
                    <solution.icon size="48px" color="white" />
                  </motion.div>
                </Box>
                <Heading as="h3" size="md" color={textColor} fontFamily="Poppins, sans-serif">
                  {solution.title}
                </Heading>
                <Text color={subTextColor} lineHeight={1.7} fontSize="md">
                  {solution.text}
                </Text>
              </VStack>
            </MotionBox>
          ))}
        </SimpleGrid>
      </Container>

      {/* Traditional Funding vs Creova Section */}
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
          Traditional Funding vs. Creova
          <Box mt={3} width="60px" height="4px" bgGradient="linear(to-r, teal.400, teal.500)" borderRadius="full" mx="auto" />
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
          <MotionBox
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            bg={useColorModeValue("gray.100", "gray.700")}
            p={8}
            borderRadius="3xl"
            boxShadow={`0 12px 32px ${shadowColor}`}
            _hover={{ transform: "translateY(-6px)", boxShadow: `0 16px 40px ${shadowColor}` }}
          >
            <Heading as="h3" size="lg" mb={6} color={useColorModeValue("gray.800", "white")} fontFamily="Poppins, sans-serif">
              Traditional Funding
            </Heading>
            <VStack spacing={4} align="start" color={subTextColor}>
              <HStack spacing={3}>
                <FaClock size="20px" color={useColorModeValue("gray.500", "gray.400")} />
                <Text>Slow approvals delay progress</Text>
              </HStack>
              <HStack spacing={3}>
                <FaDollarSign size="20px" color={useColorModeValue("gray.500", "gray.400")} />
                <Text>High fees reduce project funds</Text>
              </HStack>
              <HStack spacing={3}>
                <FaLock size="20px" color={useColorModeValue("gray.500", "gray.400")} />
                <Text>Opaque processes limit trust</Text>
              </HStack>
            </VStack>
          </MotionBox>
          <MotionBox
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            bgGradient={useColorModeValue("linear(to-br, teal.400, teal.100)", "linear(to-br, teal.600, teal.900)")}
            p={8}
            borderRadius="3xl"
            boxShadow={`0 12px 32px ${shadowColor}`}
            _hover={{ transform: "translateY(-6px)", boxShadow: `0 16px 40px ${shadowColor}` }}
          >
            <Heading as="h3" size="lg" mb={6} color="white" fontFamily="Poppins, sans-serif">
              Creova Funding
            </Heading>
            <VStack spacing={4} align="start" color="white">
              <HStack spacing={3}>
                <FaCheckCircle size="20px" color="white" />
                <Text>Instant funding accelerates impact</Text>
              </HStack>
              <HStack spacing={3}>
                <FaCoins size="20px" color="white" />
                <Text>Low fees maximise project funds</Text>
              </HStack>
              <HStack spacing={3}>
                <FaUsers size="20px" color="white" />
                <Text>Community-driven transparency</Text>
              </HStack>
            </VStack>
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
            <Heading as="h2" size="xl" mb={4} color={textColor} fontFamily="Poppins, sans-serif">
              Ready to Fund Your Impact?
            </Heading>
            <Text fontSize="lg" color={subTextColor}>
              Start your high-impact journey with Creova today.
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
            Start Now
          </Button>
        </Flex>
      </Container>

      <Footer />
    </Flex>
  );
}