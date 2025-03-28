import { 
    Box, Flex, Button, Link, Image, IconButton, useColorMode, useColorModeValue, 
    Menu, MenuButton, MenuList, MenuItem 
} from "@chakra-ui/react";
import { MoonIcon, SunIcon, ChevronDownIcon, HamburgerIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const GOLDEN_RATIO = 1.618; // Used for proportions

const Navbar = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    const router = useRouter();

    // Dynamic styles using useColorModeValue
    const navBg = useColorModeValue(
        "linear(to-r, #14B8A6, #FFFFFF)",  // Light mode
        "linear(to-br, #0D9488, #1A202C)"  // Dark mode
    );
    
    const buttonTextColor = useColorModeValue(
        "black",    // Light mode
        "white"     // Dark mode
    );
    
    const hoverBg = useColorModeValue(
        "teal.500",  // Light mode
        "teal.300"   // Dark mode
    );
    
    const menuBg = useColorModeValue(
        "white",     // Light mode
        "gray.800"   // Dark mode
    );
    
    const toggleButtonBg = useColorModeValue(
        "gray.300",  // Light mode (always light gray)
        "gray.600"   // Dark mode (darker gray for visibility)
    );

    // Navbar Size Adjustments
    const navbarHeight = 64; // Fixed navbar height
    const logoHeight = 40; // Explicitly set logo height for perfect centering

    return (
        <Box
            bgGradient={navBg}
            px={8}
            py={0}
            position="fixed"
            top="0"
            width="100%"
            height={`${navbarHeight}px`}
            zIndex="100"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            boxShadow="none"
            borderBottom="0px solid transparent"
        >
            {/* Logo - Perfectly Centered */}
            <Link href="/">
                <Flex align="center" height="100%">
                    <Image
                        src="/logo.png"
                        alt="Creova Logo"
                        height={`${logoHeight}px`}
                        objectFit="contain"
                    />
                </Flex>
            </Link>

            {/* Desktop Navigation - Centered */}
            <Flex gap={6} align="center" display={{ base: "none", md: "flex" }}>
                <Link href="/about">
                    <Button 
                        variant="ghost" 
                        fontSize="lg" 
                        fontWeight="bold" 
                        color={buttonTextColor} 
                        _hover={{ bg: hoverBg, color: "white" }}
                    >
                        About
                    </Button>
                </Link>
                <Link href="/solutions">
                    <Button 
                        variant="ghost" 
                        fontSize="lg" 
                        fontWeight="bold" 
                        color={buttonTextColor} 
                        _hover={{ bg: hoverBg, color: "white" }}
                    >
                        Our Solutions
                    </Button>
                </Link>
                <Link href="/explore">
                    <Button 
                        variant="ghost" 
                        fontSize="lg" 
                        fontWeight="bold" 
                        color={buttonTextColor} 
                        _hover={{ bg: hoverBg, color: "white" }}
                    >
                        Discover Projects
                    </Button>
                </Link>

                {/* Funding Dropdown */}
                <Menu>
                    <MenuButton 
                        as={Button} 
                        rightIcon={<ChevronDownIcon />} 
                        variant="ghost" 
                        fontSize="lg" 
                        fontWeight="bold" 
                        color={buttonTextColor} 
                        _hover={{ bg: hoverBg, color: "white" }}
                    >
                        Funding
                    </MenuButton>
                    <MenuList 
                        bg={menuBg} 
                        borderColor={hoverBg}
                        color={buttonTextColor}
                    >
                        <MenuItem 
                            onClick={() => router.push("/funding")} 
                            _hover={{ bg: hoverBg, color: "white" }}
                        >
                            Launch a Project
                        </MenuItem>
                        <MenuItem 
                            onClick={() => router.push("/grants")} 
                            _hover={{ bg: hoverBg, color: "white" }}
                        >
                            Creova Grants
                        </MenuItem>
                    </MenuList>
                </Menu>

                {/* Dashboard Dropdown */}
                <Menu>
                    <MenuButton 
                        as={Button} 
                        rightIcon={<ChevronDownIcon />} 
                        variant="ghost" 
                        fontSize="lg" 
                        fontWeight="bold" 
                        color={buttonTextColor} 
                        _hover={{ bg: hoverBg, color: "white" }}
                    >
                        Dashboard
                    </MenuButton>
                    <MenuList 
                        bg={menuBg} 
                        borderColor={hoverBg}
                        color={buttonTextColor}
                    >
                        <MenuItem 
                            onClick={() => router.push("/dashboard")} 
                            _hover={{ bg: hoverBg, color: "white" }}
                        >
                            Your Dashboard
                        </MenuItem>
                        <MenuItem 
                            onClick={() => router.push("/transparency")} 
                            _hover={{ bg: hoverBg, color: "white" }}
                        >
                            Transparency
                        </MenuItem>
                    </MenuList>
                </Menu>

                {/* Connect Wallet (Stays the same) */}
                <Box ml={2}>
                    <ConnectButton showBalance={false} chainStatus="none" accountStatus="address" />
                </Box>

                {/* Dark Mode Toggle */}
                <IconButton
                    aria-label="Toggle theme (Light/Dark Mode)"
                    icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
                    onClick={toggleColorMode}
                    color={buttonTextColor}
                    bg={toggleButtonBg}
                    _hover={{ bg: hoverBg, color: "white" }}
                />
            </Flex>

            {/* Mobile Menu (Hamburger Icon) */}
            <Menu>
                <MenuButton 
                    as={IconButton} 
                    icon={<HamburgerIcon />} 
                    variant="outline" 
                    display={{ base: "flex", md: "none" }} 
                    color={buttonTextColor}
                />
                <MenuList 
                    bg={menuBg} 
                    borderColor={hoverBg}
                    color={buttonTextColor}
                >
                    <MenuItem 
                        onClick={() => router.push("/about")} 
                        _hover={{ bg: hoverBg, color: "white" }}
                    >
                        About
                    </MenuItem>
                    <MenuItem 
                        onClick={() => router.push("/solutions")} 
                        _hover={{ bg: hoverBg, color: "white" }}
                    >
                        Our Solutions
                    </MenuItem>
                    <MenuItem 
                        onClick={() => router.push("/explore")} 
                        _hover={{ bg: hoverBg, color: "white" }}
                    >
                        Discover Projects
                    </MenuItem>
                    <MenuItem 
                        onClick={() => router.push("/funding")} 
                        _hover={{ bg: hoverBg, color: "white" }}
                    >
                        Launch a Project
                    </MenuItem>
                    <MenuItem 
                        onClick={() => router.push("/grants")} 
                        _hover={{ bg: hoverBg, color: "white" }}
                    >
                        Creova Grants
                    </MenuItem>
                    <MenuItem 
                        onClick={() => router.push("/dashboard")} 
                        _hover={{ bg: hoverBg, color: "white" }}
                    >
                        Your Dashboard
                    </MenuItem>
                    <MenuItem 
                        onClick={() => router.push("/transparency")} 
                        _hover={{ bg: hoverBg, color: "white" }}
                    >
                        Transparency
                    </MenuItem>
                    {/* Connect Wallet for Mobile */}
                    <MenuItem>
                     <Box w="100%">
                     <ConnectButton showBalance={false} chainStatus="none" accountStatus="address" />
                     </Box>
                </MenuItem>
                </MenuList>
            </Menu>
        </Box>
    );
};

export default Navbar;