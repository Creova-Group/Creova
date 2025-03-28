import { WagmiConfig, createConfig, configureChains, useAccount } from "wagmi";
import { mainnet, polygon, arbitrum, optimism } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { RainbowKitProvider, getDefaultWallets, ConnectButton } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";

// ✅ Configure Supported Chains
const { chains, publicClient } = configureChains(
  [mainnet, polygon, arbitrum, optimism],
  [publicProvider()]
);

// ✅ RainbowKit & Wagmi Config
const { connectors } = getDefaultWallets({
  appName: "Creova",
  projectId: "YOUR_PROJECT_ID",
  chains
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
});

// ✅ WalletConnect Component
export default function WalletConnect() {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <ConnectButton showBalance={false} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}