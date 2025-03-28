import { Box, Flex, Text, Link, Stack } from "@chakra-ui/react";
import Footer from "../components/Footer";

export default function Legal() {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
    <Box flex="1" pt={20} mt={24} py={10} px={8} maxW="container.xl" mx="auto">
      <Flex justify="center" align="center" direction="column">
        <Box bg="white" boxShadow="2xl" borderRadius="lg" p={8} w="full" maxW="3xl" transform="scale(1)" transition="all 0.3s ease-in-out" _hover={{ transform: "scale(1.02)", boxShadow: "dark-lg" }}>
          <Text fontSize="3xl" fontWeight="bold" mb={6} color="gray.900" textAlign="center">
            Legal and Compliance
          </Text>
          <Stack spacing={4} textAlign="center">
            <Link
              href="/legal/terms-and-conditions"
              fontSize="lg"
              _hover={{ color: "teal.500" }}
            >
              Terms and Conditions
            </Link>
            <Link
              href="/legal/privacy-policy"
              fontSize="lg"
              _hover={{ color: "teal.500" }}
            >
              Privacy Policy
            </Link>
            <Link
              href="/legal/risk-disclaimer"
              fontSize="lg"
              _hover={{ color: "teal.500" }}
            >
              Risk Disclaimer
            </Link>
            <Link
              href="/legal/treasury-and-governance-policy"
              fontSize="lg"
              _hover={{ color: "teal.500" }}
            >
              Treasury and Governance Policy
            </Link>
          </Stack>
        </Box>
      </Flex>
    </Box>
      <Box as="footer" mt="auto" width="100%">
        <Footer />
      </Box>
    </Box>
  );
}