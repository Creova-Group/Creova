'use client';

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, optimism, arbitrum, sepolia } from 'wagmi/chains';

const walletConnectProjectId = "991616039e117c2b075fb08360b401f8";

export const wagmiConfig = getDefaultConfig({
  appName: "Creova",
  projectId: walletConnectProjectId,
  chains: [mainnet, polygon, optimism, arbitrum, sepolia],
  ssr: true,
});