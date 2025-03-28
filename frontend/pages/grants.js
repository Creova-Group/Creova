import { Box, Container, Heading, Text, VStack, Button, SimpleGrid, Flex, HStack, useColorModeValue } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { FaCoins, FaBook, FaHeart, FaGlobe, FaUsers, FaLeaf } from "react-icons/fa";
import Footer from "../components/Footer";
import { useEffect } from "react";
import NextLink from "next/link";

const MotionBox = motion(Box);

export default function Grants() {
  const router = useRouter();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const spacing = {
    sm: 4,
    md: 6,
    lg: 10,
    xl: 16,
    xxl: 26
  };

  const bgGradient = useColorModeValue("linear(to-br, #14B8A6, white)", "linear(to-br, #0D9488, #1A202C)");
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("grey.900", "white");
  const subTextColor = useColorModeValue("grey.700", "gray.300");
  const shadow = useColorModeValue("0 12px 32px rgba(0, 0, 0, 0.2)", "0 12px 32px rgba(255, 255, 255, 0.1)");
  const hoverShadow = useColorModeValue("0 16px 40px rgba(0, 0, 0, 0.25)", "0 16px 40px rgba(255, 255, 255, 0.1)");

  const buttonStyles = {
    base: {
      bg: cardBg,
      color: useColorModeValue("teal.600", "white"),
      borderWidth: "2px",
      borderColor: cardBg,
      borderRadius: "full",
      px: spacing.lg,
      py: spacing.md,
      fontSize: { base: "sm", md: "lg" },
      boxShadow: useColorModeValue("0 8px 24px rgba(0, 0, 0, 0.25)", "0 8px 24px rgba(255, 255, 255, 0.1)"),
      transition: "all 0.3s ease",
      _hover: {
        bg: "transparent",
        color: "white",
        borderColor: "white",
      },
    },
    cta: {
      bg: useColorModeValue("teal.500", "teal.600"),
      color: "white",
      _hover: {
        bg: useColorModeValue("teal.600", "teal.700"),
        transform: "translateY(-4px)",
        boxShadow: useColorModeValue("0 8px 24px rgba(0, 0, 0, 0.25)", "0 8px 24px rgba(255, 255, 255, 0.1)"),
      },
    },
  };

  return (
    <Flex
      direction="column"
      minH="100vh"
      bgGradient={bgGradient}
      align="center"
      justify="flex-start"
      textAlign="center"
      pt={spacing.xxl}
      overflow="hidden"
      color={textColor}
      fontFamily="Poppins, sans-serif"
    >
      {/* Hero Section with Subtitle */}
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
            textShadow={useColorModeValue("0 2px 8px rgba(0, 0, 0, 0.8)", "0 2px 8px rgba(255, 255, 255, 0.1)")}
            fontFamily="Poppins, sans-serif"
            px={{ base: 2, md: 0 }}
          >
            Empower Your Vision with Treasury Grants
          </Heading>
          <Text
            fontSize={{ base: "sm", md: "lg" }}
            color="white"
            mt={spacing.sm}
            maxW={{ base: "90%", md: "800px" }}
            mx="auto"
            lineHeight={1.7}
            textShadow={useColorModeValue("0 2px 4px rgba(0, 0, 0, 0.8)", "0 2px 4px rgba(255, 255, 255, 0.1)")}
            px={{ base: 2, md: 0 }}
          >
            Milestone-based grants for projects in education, sustainability, and public good.
          </Text>
          <Text
            fontSize={{ base: "sm", md: "lg" }}
            color="white"
            mt={6}
            maxW={{ base: "90%", md: "800px" }}
            mx="auto"
            lineHeight={1.7}
            textShadow={useColorModeValue("0 2px 4px rgba(0, 0, 0, 0.8)", "0 2px 4px rgba(255, 255, 255, 0.1)")}
            px={{ base: 2, md: 0 }}
          >
            Creova fuels bold ideas with direct Treasury funding—no crowdfunding delays. From clean energy to education, launch your impact with Web3 speed and transparency.
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
                href="/funding?type=grant"
                {...buttonStyles.base}
                size={{ base: "md", md: "lg" }}
                px={{ base: 8, md: 8 }}
                py={{ base: 6, md: 6 }}
                w={{ base: "80%", md: "auto" }}
                mb={{ base: 4, md: 0 }}
                whiteSpace="normal"
                textAlign="center"
              >
                Apply for a Creova Grant
              </Button>
            </MotionBox>
            <MotionBox whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                as={NextLink}
                href="/explore"
                {...buttonStyles.base}
                size={{ base: "md", md: "lg" }}
                px={{ base: 8, md: 8 }}
                py={{ base: 6, md: 6 }}
                w={{ base: "80%", md: "auto" }}
                whiteSpace="normal"
                textAlign="center"
              >
                Explore Impact Projects
              </Button>
            </MotionBox>
          </HStack>
        </VStack>
      </MotionBox>

      {/* What Are Treasury Grants */}
      <Container maxW="container.xl" py={spacing.xl}>
        <Heading as="h2" size={{ base: "lg", md: "2xl" }} mb={spacing.lg} fontWeight="bold">
          What Are Treasury Grants?
          <Box mt={spacing.sm} width="60px" height="4px" bgGradient="linear(to-r, teal.400, teal.500)" borderRadius="full" mx="auto" />
        </Heading>
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <VStack
            spacing={spacing.sm}
            p={spacing.md}
            bg={cardBg}
            borderRadius="3xl"
            boxShadow={shadow}
            minH="250px"
            _hover={{ transform: "translateY(-6px)", boxShadow: hoverShadow }}
            transition="all 0.3s ease"
          >
            <Box bg="teal.500" p={spacing.sm} borderRadius="full" boxShadow={useColorModeValue("0 4px 8px rgba(0, 0, 0, 0.2)", "0 4px 8px rgba(255, 255, 255, 0.1)")}>
              <motion.div whileHover={{ rotate: 360, transition: { duration: 0.8 } }}>
                <FaCoins size="48px" color="white" />
              </motion.div>
            </Box>
            <Text color={subTextColor} fontSize="md" lineHeight={1.7} maxW="800px">
              Treasury Grants provide funding straight from Creova’s Treasury—up to 10% of our balance each quarter—to drive high-impact projects. Crowdfunding depends on gathering small donations from the crowd; we offer direct, reliable support with no equity or repayment required.{" "}
              <Text as="span" fontWeight="bold">
                Transparency Note: Treasury Grants will kick off once our 1% fee pool builds the Treasury, with 10% of the balance available each quarter to fund your impact. We’re laying the groundwork—watch this space!
              </Text>
              <br />
              Example: Imagine a renewable energy hub—crowdfunding could take months collecting $50 here, $100 there. A Treasury Grant taps up to 10% of Creova’s quarterly balance—once our 1% fee pool grows the Treasury—to jumpstart your project fast.
            </Text>
          </VStack>
        </MotionBox>
      </Container>

      {/* Who Can Apply */}
      <Container maxW="container.xl" py={spacing.xl}>
        <Heading as="h2" size={{ base: "lg", md: "2xl" }} mb={spacing.lg} fontWeight="bold">
          Who Can Apply?
          <Box mt={spacing.sm} width="60px" height="4px" bgGradient="linear(to-r, teal.400, teal.500)" borderRadius="full" mx="auto" />
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={spacing.lg}>
          {[
            { icon: FaBook, title: "Education", text: "Open-source learning, blockchain research, tech training" },
            { icon: FaHeart, title: "Charity", text: "Charities, disaster relief, humanitarian efforts" },
            { icon: FaGlobe, title: "Public Good", text: "Web3 sustainability, decentralised governance" },
            { icon: FaUsers, title: "Global Reach", text: "Individuals, teams, and organisations worldwide with impactful ideas" },
          ].map((item, idx) => (
            <MotionBox
              key={idx}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 * idx }}
            >
              <VStack
                spacing={spacing.sm}
                p={spacing.lg}
                bg={cardBg}
                borderRadius="3xl"
                boxShadow={shadow}
                minH="300px"
                _hover={{ transform: "translateY(-6px)", boxShadow: hoverShadow }}
                transition="all 0.3s ease"
              >
                <Box bg="teal.500" p={spacing.sm} borderRadius="full" boxShadow={useColorModeValue("0 4px 8px rgba(0, 0, 0, 0.2)", "0 4px 8px rgba(255, 255, 255, 0.1)")}>
                  <motion.div whileHover={{ rotate: 360, transition: { duration: 0.8 } }}>
                    <item.icon size="48px" color="white" />
                  </motion.div>
                </Box>
                <Heading as="h3" size="md" color={textColor}>
                  {item.title}
                </Heading>
                <Text color={subTextColor} fontSize="md" lineHeight={1.7}>
                  {item.text}
                </Text>
              </VStack>
            </MotionBox>
          ))}
        </SimpleGrid>
      </Container>

      {/* Updated Grant Process with Copy */}
      <Container maxW="container.xl" py={spacing.xl}>
        <Heading as="h2" size={{ base: "lg", md: "2xl" }} mb={spacing.lg} fontWeight="bold">
          Grant Process
          <Box mt={spacing.sm} width="60px" height="4px" bgGradient="linear(to-r, teal.400, teal.500)" borderRadius="full" mx="auto" />
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={spacing.md} maxW="1200px" mx="auto">
          {[
            { step: "1", title: "Apply", text: "Submit your project proposal to our team." },
            { step: "2", title: "Admin Reviews", text: "We assess your plan—DAO voting coming soon!" },
            { step: "3", title: "Milestones Approved", text: "Set and agree on project milestones." },
            { step: "4", title: "Funds Disbursed", text: "Receive ETH as milestones are met." },
          ].map((item, idx) => (
            <MotionBox
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 * idx }}
            >
              <VStack
                bg={cardBg}
                borderRadius="2xl"
                p={spacing.md}
                spacing={spacing.sm}
                minH="250px"
                boxShadow={useColorModeValue("0 8px 24px rgba(0, 0, 0, 0.15)", "0 8px 24px rgba(255, 255, 255, 0.1)")}
                _hover={{ transform: "translateY(-4px)", boxShadow: hoverShadow }}
                transition="all 0.3s ease"
              >
                <Flex
                  bg="teal.500"
                  color="white"
                  w="40px"
                  h="40px"
                  borderRadius="full"
                  align="center"
                  justify="center"
                  fontWeight="bold"
                  fontSize="xl"
                  boxShadow={useColorModeValue("0 4px 8px rgba(0, 0, 0, 0.2)", "0 4px 8px rgba(255, 255, 255, 0.1)")}
                >
                  {item.step}
                </Flex>
                <Text fontWeight="bold" fontSize="md" color={textColor}>
                  {item.title}
                </Text>
                <Text color={subTextColor} fontSize="md" lineHeight={1.7} textAlign="center">
                  {item.text}
                </Text>
              </VStack>
            </MotionBox>
          ))}
        </SimpleGrid>
      </Container>

      {/* CTA Section */}
      <Container maxW="container.xl" py={spacing.xl}>
        <Flex
          direction={{ base: "column", md: "row" }}
          align="center"
          justify="space-between"
          bgGradient={useColorModeValue("linear(to-br, teal.400, teal.100)", "linear(to-br, #0D9488, #1A202C)")}
          borderRadius="2xl"
          p={spacing.lg}
          boxShadow={useColorModeValue("0 16px 48px rgba(0, 0, 0, 0.25)", "0 16px 48px rgba(255, 255, 255, 0.1)")}
        >
          <Box textAlign={{ base: "center", md: "left" }} maxW={{ md: "60%" }}>
            <Heading as="h2" size="xl" mb={spacing.sm} color={textColor}>
              Ready to Fund Your Impact?
            </Heading>
            <Text fontSize="lg" color={subTextColor}>
              Ditch the crowdfunding grind—apply for a Treasury Grant from our 10% quarterly pool, launching once the 1% fee pool builds the Treasury!
            </Text>
          </Box>
          <Button
            as={NextLink}
            href="/funding?type=grant"
            mt={{ base: spacing.lg, md: 0 }}
            {...buttonStyles.cta}
            size="lg"
            px={spacing.xl}
            asMotion={MotionBox}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Apply Now
          </Button>
        </Flex>
      </Container>

      <Footer />
    </Flex>
  );
}