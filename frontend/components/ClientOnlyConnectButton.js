import dynamic from "next/dynamic";

const ClientOnlyConnectButton = dynamic(
  () => import("@rainbow-me/rainbowkit").then((mod) => mod.ConnectButton),
  { ssr: false }
);

export default ClientOnlyConnectButton;