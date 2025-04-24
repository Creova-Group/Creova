import { 
    Box, Flex, Button, Link, Image, IconButton, useColorMode, useColorModeValue, 
    Menu, MenuButton, MenuList, MenuItem 
} from "@chakra-ui/react";
import { MoonIcon, SunIcon, ChevronDownIcon, HamburgerIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
const ClientOnlyConnectButton = dynamic(() => import("./ClientOnlyConnectButton"), { ssr: false });

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
        "gray.300",  // Light mode
        "gray.600"   // Dark mode
    );

    // Navbar Size Adjustments
    const navbarHeight = 64;
    const logoHeight = 40;

    return (
        <Box
            bgGradient={navBg}
            px={{ base: 4, md: 8 }} // Reduced padding on mobile
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

            {/* Desktop Navigation - Hidden on Mobile */}
            <Flex 
                gap={6} 
                align="center" 
                display={{ base: "none", md: "flex" }} // Hide on mobile
            >
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

                {/* Get Funded Dropdown */}
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
                        Get Funded
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
                            Submit a Project
                        </MenuItem>
                        <MenuItem 
                            onClick={() => router.push("/grants")} 
                            _hover={{ bg: hoverBg, color: "white" }}
                        >
                            Treasury Grants
                        </MenuItem>
                    </MenuList>
                </Menu>

                {/* Tools Dropdown */}
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
                        Tools
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
                            Project Dashboard
                        </MenuItem>
                        <MenuItem 
                            onClick={() => router.push("/transparency")} 
                            _hover={{ bg: hoverBg, color: "white" }}
                        >
                            Treasury Transparency
                        </MenuItem>
                    </MenuList>
                </Menu>

                {/* Connect Wallet Button */}
                <Box ml={2}>
                    <ClientOnlyConnectButton showBalance={false} chainStatus="icon" accountStatus="address" />
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
                    minWidth="200px" // Ensure enough width for content
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
                        Submit a Project
                    </MenuItem>
                    <MenuItem 
                        onClick={() => router.push("/grants")} 
                        _hover={{ bg: hoverBg, color: "white" }}
                    >
                        Treasury Grants
                    </MenuItem>
                    <MenuItem 
                        onClick={() => router.push("/dashboard")} 
                        _hover={{ bg: hoverBg, color: "white" }}
                    >
                        Project Dashboard
                    </MenuItem>
                    <MenuItem 
                        onClick={() => router.push("/transparency")} 
                        _hover={{ bg: hoverBg, color: "white" }}
                    >
                        Treasury Transparency
                    </MenuItem>
                    {/* Connect Wallet for Mobile */}
                    <MenuItem as="div" closeOnSelect={false}>
                        <Box px={4} py={2}>
                            <ClientOnlyConnectButton showBalance={false} chainStatus="icon" accountStatus="address" />
                        </Box>
                    </MenuItem>
                    {/* Dark Mode Toggle for Mobile */}
                    <MenuItem as="div" closeOnSelect={false}>
                        <Box px={4} py={2}>
                            <IconButton
                                aria-label="Toggle theme (Light/Dark Mode)"
                                icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
                                onClick={toggleColorMode}
                                color={buttonTextColor}
                                bg={toggleButtonBg}
                                _hover={{ bg: hoverBg, color: "white" }}
                            />
                        </Box>
                    </MenuItem>
                </MenuList>
            </Menu>
        </Box>
    );
};

export default Navbar;