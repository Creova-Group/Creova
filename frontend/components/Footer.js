import { Box, Flex, Text, Link, Stack, Icon, Image, useColorModeValue } from "@chakra-ui/react";
import { FaTwitter, FaDiscord, FaGithub, FaLinkedin, FaFacebook, FaTelegram, FaInstagram } from "react-icons/fa";

export default function Footer() {
  // Dynamic styles using useColorModeValue
  const bgGradient = useColorModeValue(
    "linear(to-br, teal.400, teal.100)",  // Light mode
    "linear(to-br, #0D9488, #1A202C)"     // Dark mode
  );

  const textColor = useColorModeValue(
    "gray.900",  // Light mode
    "white"      // Dark mode
  );

  const borderColor = useColorModeValue(
    "gray.200",  // Light mode
    "gray.700"   // Dark mode
  );

  const hoverColor = useColorModeValue(
    "teal.500",  // Light mode
    "teal.300"   // Dark mode
  );

  return (
    <Box
      bgGradient={bgGradient}
      color={textColor}
      py={10}
      width="100%"
      boxShadow="none"
      mt="auto"
    >
      <Flex
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        align="center"
        maxW="container.xl"
        mx="auto"
        px={8}
      >
        {/* Branding and Tagline with Logo */}
        <Box textAlign={{ base: "center", md: "left" }} mb={{ base: 6, md: 0 }}>
          <Image
            src="/logo.png"
            alt="Creova Logo"
            height="40px"
            mb={2}
            fallback={<Text fontSize="2xl" fontWeight="bold" color={textColor}>Creova</Text>}
          />
          <Text fontSize="md">
            Transparent Funding, Transformative Impact
          </Text>
        </Box>

        {/* Social Media Icons with enhanced hover effects */}
        <Stack direction="row" spacing={6}>
          <Link href="https://twitter.com/yourusername" isExternal>
            <Icon 
              as={FaTwitter} 
              boxSize={6} 
              _hover={{ color: hoverColor, transform: "translateY(-3px)" }} 
              transition="0.2s ease" 
            />
          </Link>
          <Link href="https://discord.com/invite/yourserver" isExternal>
            <Icon 
              as={FaDiscord} 
              boxSize={6} 
              _hover={{ color: hoverColor, transform: "translateY(-3px)" }} 
              transition="0.2s ease" 
            />
          </Link>
          <Link href="https://github.com/yourrepo" isExternal>
            <Icon 
              as={FaGithub} 
              boxSize={6} 
              _hover={{ color: hoverColor, transform: "translateY(-3px)" }} 
              transition="0.2s ease" 
            />
          </Link>
          <Link href="https://linkedin.com/company/yourcompany" isExternal>
            <Icon 
              as={FaLinkedin} 
              boxSize={6} 
              _hover={{ color: hoverColor, transform: "translateY(-3px)" }} 
              transition="0.2s ease" 
            />
          </Link>
          <Link href="https://facebook.com/yourpage" isExternal>
            <Icon 
              as={FaFacebook} 
              boxSize={6} 
              _hover={{ color: hoverColor, transform: "translateY(-3px)" }} 
              transition="0.2s ease" 
            />
          </Link>
          <Link href="https://t.me/yourchannel" isExternal>
            <Icon 
              as={FaTelegram} 
              boxSize={6} 
              _hover={{ color: hoverColor, transform: "translateY(-3px)" }} 
              transition="0.2s ease" 
            />
          </Link>
          <Link href="https://instagram.com/youraccount" isExternal>
            <Icon 
              as={FaInstagram} 
              boxSize={6} 
              _hover={{ color: hoverColor, transform: "translateY(-3px)" }} 
              transition="0.2s ease" 
            />
          </Link>
        </Stack>
      </Flex>

      {/* Legal Information Row */}
      <Flex
        justify="space-between"
        align="center"
        maxW="container.xl"
        mx="auto"
        px={8}
        pt={6}
        mt={8}
        borderTop="1px solid"
        borderColor={borderColor}
        direction={{ base: "column", md: "row" }}
      >
        <Text fontSize="sm">
          ©️ {new Date().getFullYear()} Creova Group Ltd. All rights reserved.
        </Text>
        <Stack direction="row" spacing={4} mt={{ base: 4, md: 0 }}>
          <Link 
            href="/legal" 
            fontSize="sm" 
            _hover={{ color: hoverColor }}
          >
            Legal and Compliance
          </Link>
        </Stack>
      </Flex>
    </Box>
  );
}