// pages/legal/terms-and-conditions.js
import { Box, Text, Link } from "@chakra-ui/react";

export default function TermsAndConditions() {
  return (
    <Box pt={20} mt={24} py={10} pX={8} maxW="container.xl" mx="auto">      <Text fontSize="3xl" fontWeight="bold" mb={6} color="gray.900">
        Terms and Conditions
      </Text>
      <Text fontSize="sm" mb={4}>
        Last updated: March 17, 2025
      </Text>

      <Box as="section" mb={6}>
        <Text fontSize="xl" fontWeight="semibold" mb={2}>
          1. Introduction
        </Text>
        <Text fontSize="md">
          Welcome to Creova ("we," "us," or "our"), a decentralised Web3 funding
          platform operated by [Creova Group Ltd], a [company]
          registered in [England/Wales/Scotland/Northern Ireland, Registration
          Number if applicable]. Creova enables users to create, fund, and
          manage High Impact Projects via crowdfunding and treasury grants
          through smart contracts deployed on the Ethereum blockchain at
          [0xF98a7F677cE887ABED858b594a0A728d84f98b38]. By accessing or using the Creova platform
          ("Platform"), you agree to these Terms & Conditions ("Terms"). If you
          do not agree, you must cease using the Platform immediately.
        </Text>
        <Text fontSize="md" mt={2}>
          High Impact Projects: Projects that deliver significant social,
          environmental, technological, or economic benefits, as determined by
          Creova in its sole discretion. Examples include renewable energy
          initiatives, open-source software for public good, or
          community-driven infrastructure.
        </Text>
      </Box>

      <Box as="section" mb={6}>
        <Text fontSize="xl" fontWeight="semibold" mb={2}>
          2. Acceptance of Terms
        </Text>
        <Text fontSize="md">
          By interacting with the Platform—whether by accessing our website,
          funding a project, creating a campaign, or engaging with our smart
          contracts—you confirm that you have read, understood, and agree to be
          bound by these Terms, as well as our Privacy Policy. These Terms form
          a legally binding agreement between you and us.
        </Text>
      </Box>

      <Box as="section" mb={6}>
        <Text fontSize="xl" fontWeight="semibold" mb={2}>
          3. Eligibility
        </Text>
        <Text fontSize="md">
          To use the Platform, you must:
        </Text>
        <Text fontSize="md" as="ul" pl={6} listStyleType="disc">
          <Text as="li">Be at least 18 years old.</Text>
          <Text as="li">
            Not reside in or be a citizen of any jurisdiction where blockchain
            funding or cryptocurrency transactions are prohibited, including
            those listed under UK sanctions regimes (e.g., Office of Financial
            Sanctions Implementation (OFSI) sanctions list).
          </Text>
          <Text as="li">
            Complete Know Your Customer (KYC) verification if applying for a
            treasury grant or withdrawing funds exceeding 5 ETH (or equivalent
            in GBP at the prevailing exchange rate).
          </Text>
        </Text>
        <Text fontSize="md" mt={2}>
          We reserve the right to refuse service to anyone who does not meet
          these criteria or violates these Terms.
        </Text>
      </Box>

      <Box as="section" mb={6}>
        <Text fontSize="xl" fontWeight="semibold" mb={2}>
          4. Nature of Services
        </Text>
        <Text fontSize="md">
          Crowdfunding: Users ("Funders") may contribute ETH to High Impact
          Projects created by other users ("Creators"). Creova does not
          guarantee project completion or success.
        </Text>
        <Text fontSize="md" mt={2}>
          Treasury Grants: Eligible Creators may apply for funding from the
          Creova treasury for High Impact Projects, subject to approval by
          designated voters or administrators.
        </Text>
        <Text fontSize="md" mt={2}>
          Smart Contracts: All transactions are executed via the FundingPool
          smart contract. Once submitted, transactions are immutable and
          irreversible by Creova.
        </Text>
        <Text fontSize="md" mt={2}>
          Project Approval: Creova reserves the right to reject or remove any
          project that does not align with our mission of supporting High
          Impact Projects or that violates these Terms, applicable laws, or
          community standards, at our sole discretion.
        </Text>
      </Box>

      <Box as="section" mb={6}>
        <Text fontSize="xl" fontWeight="semibold" mb={2}>
          5. User Responsibilities
        </Text>
        <Text fontSize="md">
          Creators: You must:
        </Text>
        <Text fontSize="md" as="ul" pl={6} listStyleType="disc">
          <Text as="li">
            Provide accurate, truthful, and non-misleading campaign details
            (e.g., name, funding goal, project description, IPFS CIDs).
          </Text>
          <Text as="li">
            Design projects that qualify as High Impact Projects.
          </Text>
          <Text as="li">
            Use funds solely for the purposes outlined in your campaign.
          </Text>
          <Text as="li">
            Comply with all applicable laws, including UK tax, anti-money
            laundering (AML), and consumer protection regulations.
          </Text>
          <Text as="li">
            Submit milestone proofs for treasury grants as required by the
            smart contract.
          </Text>
        </Text>
        <Text fontSize="md" mt={2}>
          Funders: You are responsible for conducting due diligence before
          contributing to any project. Contributions are at your own risk.
        </Text>
        <Text fontSize="md" mt={2}>
          KYC Compliance: Users withdrawing over 5 ETH or applying for treasury
          grants exceeding this amount must complete KYC verification via our
          third-party provider (e.g., Sumsub). Failure to comply may result in
          funds being locked until verification is completed.
        </Text>
      </Box>

      <Box as="section" mb={6}>
        <Text fontSize="xl" fontWeight="semibold" mb={2}>
          6. Fees & Payments
        </Text>
        <Text fontSize="md">
          Funding Fees: A 5% fee is deducted from each contribution:
        </Text>
        <Text fontSize="md" as="ul" pl={6} listStyleType="disc">
          <Text as="li">2.5% to the Creova treasury (DAO-controlled wallet).</Text>
          <Text as="li">2.5% to Creova for platform maintenance.</Text>
        </Text>
        <Text fontSize="md" mt={2}>
          Withdrawal Fees: A 2.5% fee is applied to all withdrawals:
        </Text>
        <Text fontSize="md" as="ul" pl={6} listStyleType="disc">
          <Text as="li">1.25% to the treasury.</Text>
          <Text as="li">1.25% to Creova.</Text>
        </Text>
        <Text fontSize="md" mt={2}>
          Gas Fees: Users bear all Ethereum network gas costs associated with
          transactions.
        </Text>
        <Text fontSize="md" mt={2}>
          Fees are calculated and deducted automatically by the smart contract
          and are non-refundable unless Creova fails to provide core services
          due to our negligence.
        </Text>
      </Box>

      <Box as="section" mb={6}>
        <Text fontSize="xl" fontWeight="semibold" mb={2}>
          7. Refunds
        </Text>
        <Text fontSize="md">
          Crowdfunding: No refunds are available for contributions to
          crowdfunding campaigns, even if the funding goal is not met. Funds
          remain with the Creator after the 30-day deadline, subject to smart
          contract withdrawal rules.
        </Text>
        <Text fontSize="md" mt={2}>
          Treasury Grants: Unspent funds from rejected milestones (after a
          7-day resubmission window) are returned to the Creova treasury, not
          individual Funders.
        </Text>
        <Text fontSize="md" mt={2}>
          Creova is not obligated to refund contributions lost due to user
          error, blockchain issues, or Creator misconduct.
        </Text>
      </Box>

      <Box as="section" mb={6}>
        <Text fontSize="xl" fontWeight="semibold" mb={2}>
          8. Treasury Governance
        </Text>
        <Text fontSize="md">
          Treasury funds are allocated quarterly, with a limit of 10% of the
          contract balance per quarter, adjustable by the contract owner.
        </Text>
        <Text fontSize="md" mt={2}>
          Treasury grant campaigns are subject to approval by users with the
          VOTER_ROLE (as defined in the smart contract) or Creova
          administrators.
        </Text>
        <Text fontSize="md" mt={2}>
          We may reject or auto-reject unreviewed treasury grant applications
          after 14 days, per the smart contract logic.
        </Text>
      </Box>

      <Box as="section" mb={6}>
        <Text fontSize="xl" fontWeight="semibold" mb={2}>
          9. Risk Disclaimer
        </Text>
        <Text fontSize="md">
          Volatility: Cryptocurrency (ETH) values are highly volatile, and
          funding projects carries financial risk.
        </Text>
        <Text fontSize="md" mt={2}>
          Project Risks: Creova does not vet or endorse projects. Creators may
          fail to deliver, mismanage funds, or act fraudulently, and we are not
          liable for such outcomes.
        </Text>
        <Text fontSize="md" mt={2}>
          Technical Risks: Smart contracts may contain bugs or be exploited.
          While designed with security in mind, we do not guarantee their
          functionality or security.
        </Text>
        <Text fontSize="md" mt={2}>
          You acknowledge these risks and agree to use the Platform at your own
          discretion.
        </Text>
      </Box>

      <Box as="section" mb={6}>
        <Text fontSize="xl" fontWeight="semibold" mb={2}>
          10. Governing Law & Dispute Resolution
        </Text>
        <Text fontSize="md">
          These Terms are governed by the laws of England and Wales.
        </Text>
        <Text fontSize="md" mt={2}>
          Disputes shall be resolved exclusively in the courts of England and
          Wales, unless mandatory consumer protection laws dictate otherwise.
        </Text>
        <Text fontSize="md" mt={2}>
          We may offer arbitration as an alternative at our discretion.
        </Text>
      </Box>

      <Box as="section" mb={6}>
        <Text fontSize="xl" fontWeight="semibold" mb={2}>
          11. Contact Information
        </Text>
        <Text fontSize="md">
          For questions or support, email us at{" "}
          <Link href="mailto:adaml@creova.xyz" _hover={{ color: "teal.500" }}>
            adaml@creova.xyz
          </Link>{" "}
          or visit{" "}
          <Link href="http://www.creova.xyz" _hover={{ color: "teal.500" }}>
            www.creova.xyz
          </Link>.
        </Text>
      </Box>

      <Link href="/legal" fontSize="md" _hover={{ color: "teal.500" }}>
        Back to Legal
      </Link>
    </Box>
  );
}