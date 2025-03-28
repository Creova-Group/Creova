// pages/legal/risk-disclaimer.js
import { Box, Text, Link } from "@chakra-ui/react";

export default function RiskDisclaimer() {
  return (
    <Box pt={20} mt={24} py={10} pX={8} maxW="container.xl" mx="auto">      <Text fontSize="3xl" fontWeight="bold" mb={6} color="gray.900">
        Creova Risk Disclaimer
      </Text>
      <Text fontSize="sm" mb={4}>
        Last Updated: 17 March 2025
      </Text>

      <Box as="section" mb={6}>
        <Text fontSize="xl" fontWeight="semibold" mb={2}>
          1. Introduction
        </Text>
        <Text fontSize="md">
          This Risk Disclaimer (“Disclaimer”) is issued by Creova (“we,” “us,” or “our”), a decentralised Web3 funding platform operated by [Creova Group Ltd], a [company] registered in [England/Wales/Scotland/Northern Ireland, Registration Number if applicable]. The Disclaimer outlines the inherent risks of using our platform (“Platform”) for crowdfunding, treasury grants, and cryptocurrency transactions via smart contracts deployed on the Ethereum blockchain at [insert contract address]. By accessing or using the Platform, you acknowledge and accept these risks in full.
        </Text>
      </Box>

      <Box as="section" mb={6}>
        <Text fontSize="xl" fontWeight="semibold" mb={2}>
          2. No Financial or Investment Advice
        </Text>
        <Text fontSize="md" as="ul" pl={6} listStyleType="disc">
          <Text as="li">Creova is a technology platform, not a financial institution, investment adviser, or brokerage service.</Text>
          <Text as="li">We do not provide financial, investment, tax, or legal advice. Users must conduct their own due diligence before funding or launching projects.</Text>
          <Text as="li">Nothing on the Platform constitutes an endorsement, recommendation, or guarantee of success for any project, creator, or investment opportunity.</Text>
        </Text>
      </Box>

      <Box as="section" mb={6}>
        <Text fontSize="xl" fontWeight="semibold" mb={2}>
          3. Cryptocurrency & Blockchain Risks
        </Text>
        <Text fontSize="md">
          Using Creova involves inherent risks tied to cryptocurrency and blockchain technology, including:
        </Text>
        <Text fontSize="md" as="ul" pl={6} listStyleType="disc">
          <Text as="li">Volatility: The value of Ether (ETH) and other digital assets can fluctuate significantly, potentially leading to substantial financial losses.</Text>
          <Text as="li">Smart Contract Risks: Although our smart contracts are designed with security in mind and undergo audits, they may contain undiscovered bugs or vulnerabilities that could be exploited, resulting in loss of funds.</Text>
          <Text as="li">Irreversibility: Transactions on the Ethereum blockchain are final and cannot be reversed or modified by Creova once executed.</Text>
          <Text as="li">Gas Fees: Ethereum network transaction fees (“gas”) vary based on network congestion and are borne entirely by users. These fees can be unpredictable and may increase operational costs.</Text>
          <Text as="li">Security Breaches: Users are solely responsible for securing their private keys, wallet credentials, and devices. Creova is not liable for losses due to hacking, phishing, or compromised wallets.</Text>
          <Text as="li">Network Downtime: Ethereum network outages or forks may disrupt access to the Platform or funds, over which Creova has no control.</Text>
        </Text>
      </Box>

      <Box as="section" mb={6}>
        <Text fontSize="xl" fontWeight="semibold" mb={2}>
          4. Project & Funding Risks
        </Text>
        <Text fontSize="md">
          Participation in crowdfunding or treasury grants on Creova carries the following risks:
        </Text>
        <Text fontSize="md" as="ul" pl={6} listStyleType="disc">
          <Text as="li">No Guaranteed Outcomes: Contributions to projects do not guarantee financial returns, rewards, or successful completion. Funding is at your own risk.</Text>
          <Text as="li">Creator Responsibility: Project creators are solely accountable for delivering on their stated goals. Creova does not oversee, manage, or guarantee project execution.</Text>
          <Text as="li">Misuse of Funds: Creators may mismanage or misuse funds raised. Funders must independently assess the credibility of creators and projects before contributing.</Text>
          <Text as="li">Crowdfunding Specifics: Funds contributed to crowdfunding campaigns remain with creators after the 30-day deadline, even if the funding goal is not met, with no refund available.</Text>
          <Text as="li">Treasury Grant Specifics: Treasury funds are subject to milestone approvals by voters or administrators. Delays, rejections, or failure to meet milestones may result in unspent funds being returned to the treasury, not funders.</Text>
          <Text as="li">Treasury Fund Misuse: In cases of suspected fraud or mismanagement, Creova reserves the right to investigate and take appropriate action, including legal recourse if necessary.</Text>
        </Text>
      </Box>

      <Box as="section" mb={6}>
        <Text fontSize="xl" fontWeight="semibold" mb={2}>
          5. Regulatory & Compliance Risks
        </Text>
        <Text fontSize="md" as="ul" pl={6} listStyleType="disc">
          <Text as="li">Legal Uncertainty: Cryptocurrency and blockchain regulations vary by jurisdiction and may evolve. Users are responsible for ensuring compliance with their local laws, including tax obligations.</Text>
          <Text as="li">KYC & AML Requirements: Users applying for treasury grants or withdrawing over 5 ETH (or equivalent in GBP at the prevailing rate) must complete Know Your Customer (KYC) verification. Failure to complete KYC verification may result in funds being temporarily frozen or permanently inaccessible if verification is declined.</Text>
          <Text as="li">Sanctions & Restrictions: Users from jurisdictions subject to UK sanctions (e.g., Office of Financial Sanctions Implementation (OFSI) list) are prohibited from using Creova. Violation may result in frozen funds or legal action.</Text>
        </Text>
      </Box>

      <Box as="section" mb={6}>
        <Text fontSize="xl" fontWeight="semibold" mb={2}>
          6. Third-Party Service Risks
        </Text>
        <Text fontSize="md" as="ul" pl={6} listStyleType="disc">
          <Text as="li">KYC Provider: Identity verification is managed by third-party providers (e.g., Sumsub). Creova is not responsible for delays, errors, or data breaches occurring within their systems. Users acknowledge that KYC verification results are final and Creova has no authority to override decisions made by its KYC provider.</Text>
          <Text as="li">IPFS Storage: Project data stored on the InterPlanetary File System (IPFS) relies on third-party nodes. Creova does not guarantee the availability, integrity, or permanence of this data.</Text>
          <Text as="li">Ethereum Network: The Platform depends on the Ethereum blockchain, operated by third parties. Creova is not liable for network-related disruptions.</Text>
        </Text>
      </Box>

      <Box as="section" mb={6}>
        <Text fontSize="xl" fontWeight="semibold" mb={2}>
          7. Limitation of Liability
        </Text>
        <Text fontSize="md" as="ul" pl={6} listStyleType="disc">
          <Text as="li">The Platform is provided “as is” and “as available,” without warranties of any kind, express or implied, to the fullest extent permitted by UK law.</Text>
          <Text as="li">Creova shall not be liable for losses arising from:</Text>
          <Text as="li">Fluctuations in cryptocurrency value.</Text>
          <Text as="li">Smart contract failures, bugs, or exploits.</Text>
          <Text as="li">Creator misconduct, mismanagement, or project failures.</Text>
          <Text as="li">Regulatory changes or enforcement actions affecting blockchain transactions.</Text>
          <Text as="li">Network outages, gas fee spikes, or third-party service failures.</Text>
          <Text as="li">Our total liability shall not exceed the total fees paid to Creova by the user within the preceding 12 months, unless otherwise required by applicable UK consumer protection laws.</Text>
        </Text>
      </Box>

      <Box as="section" mb={6}>
        <Text fontSize="xl" fontWeight="semibold" mb={2}>
          8. User Responsibility
        </Text>
        <Text fontSize="md">
          By using Creova, you agree that:
        </Text>
        <Text fontSize="md" as="ul" pl={6} listStyleType="disc">
          <Text as="li">You fully understand the risks associated with decentralised crowdfunding, treasury grants, and blockchain transactions.</Text>
          <Text as="li">You accept sole responsibility for your funding decisions and participation in the Platform.</Text>
          <Text as="li">You will not hold Creova, its operators, or affiliates liable for any losses incurred from using the Platform.</Text>
        </Text>
      </Box>

      <Box as="section" mb={6}>
        <Text fontSize="xl" fontWeight="semibold" mb={2}>
          9. Changes to This Disclaimer
        </Text>
        <Text fontSize="md">
          We may update this Disclaimer as needed. Significant changes will be announced on our website ([insert website]) or via email/X at least 14 days before taking effect. Continued use of the Platform after changes constitutes acceptance.
        </Text>
      </Box>

      <Box as="section" mb={6}>
        <Text fontSize="xl" fontWeight="semibold" mb={2}>
          10. Contact Information
        </Text>
        <Text fontSize="md">
          For questions about this Disclaimer, contact us at:
        </Text>
        <Text fontSize="md" as="ul" pl={6} listStyleType="disc">
          <Text as="li">
            📧 Email:{" "}
            <Link href="mailto:adam@creova.xyz" _hover={{ color: "teal.500" }}>
              adam@creova.xyz
            </Link>
          </Text>
          <Text as="li">
            🌐 Website: www.creova.xyz
          </Text>
        </Text>
        <Text fontSize="md" mt={2}>
          By accessing or using Creova, you acknowledge and accept the risks outlined in this Disclaimer in their entirety.
        </Text>
      </Box>

      <Link href="/legal" fontSize="md" _hover={{ color: "teal.500" }}>
        Back to Legal
      </Link>
    </Box>
  );
}