import { ChakraProvider, Box } from "@chakra-ui/react";
import { WagmiConfig } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { wagmiConfig } from "../lib/wagmiConfig";
import { RainbowKitProvider, lightTheme } from "@rainbow-me/rainbowkit";
import Navbar from "../components/Navbar";
import Head from "next/head";
import "@rainbow-me/rainbowkit/styles.css";
import customChakraTheme from "../styles/theme";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ethers } from "ethers";
import ScreenSaver from "../components/ScreenSaver";
import Chatbot from "../components/Chatbot";

if (typeof window !== "undefined") {
  window.ethers = ethers;
}

const queryClient = new QueryClient();

const customRainbowKitTheme = lightTheme({
  accentColor: "#14B8A6",
  accentColorForeground: "#FFFFFF",
  borderRadius: "medium",
  fontStack: "system",
});

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={customChakraTheme}>
      <Head>
        <link rel="icon" href="/favicon.ico?v=2" type="image/x-icon" />
        <title>Creova - Decentralised Creator Funding</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Creova empowers creators and innovators with decentralised, transparent, instant funding solutions powered by blockchain technology."
        />
      </Head>
      <WagmiConfig config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider theme={customRainbowKitTheme} coolMode>
            <Navbar />
            <Box position="relative" minHeight="100vh" overflowX="hidden">
              <Component {...pageProps} />
              <ScreenSaver timeout={30000} />
              <Chatbot />
            </Box>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiConfig>
    </ChakraProvider>
  );
}

export default MyApp;