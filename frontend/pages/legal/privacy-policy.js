// pages/legal/privacy-policy.js
import { Box, Text, Link } from "@chakra-ui/react";

export default function PrivacyPolicy() {
  return (
    <Box pt={20} mt={24} py={10} pX={8} maxW="container.xl" mx="auto">      <Text fontSize="3xl" fontWeight="bold" mb={6} color="gray.900">
        Creova Privacy Policy
      </Text>
      <Text fontSize="sm" mb={4}>
        Last Updated: 17 March 2025
      </Text>

      <Box as="section" mb={6}>
        <Text fontSize="xl" fontWeight="semibold" mb={2}>
          1. Introduction
        </Text>
        <Text fontSize="md">
          Creova ("we," "us," or "our") is a decentralised Web3 funding platform
          operated by [Creova Group Ltd], a [company]
          registered in [England/Wales/Scotland/Northern Ireland, Registration
          Number if applicable]. We are committed to protecting your privacy
          and handling your personal data responsibly in accordance with the UK
          General Data Protection Regulation (UK GDPR) and the Data Protection
          Act 2018.
        </Text>
        <Text fontSize="md" mt={2}>
          This Privacy Policy explains how we collect, use, store, and protect
          your personal data when you use our platform ("Platform") to fund,
          create, or manage high-impact projects through crowdfunding and
          treasury grants. It applies to all users, including funders, project
          creators, and treasury grant applicants. By accessing or using the
          Platform, you consent to the data practices described herein. If you
          do not agree, please do not use the Platform.
        </Text>
      </Box>

      <Box as="section" mb={6}>
        <Text fontSize="xl" fontWeight="semibold" mb={2}>
          2. Data We Collect
        </Text>
        <Text fontSize="md">
          We collect and process the following categories of personal data:
        </Text>
        <Text fontSize="md" fontWeight="semibold" mt={2}>
          2.1 On-Chain Data (Publicly Available)
        </Text>
        <Text fontSize="md">
          Wallet Addresses: Ethereum addresses used for transactions.
        </Text>
        <Text fontSize="md">
          Transaction Histories: Contributions, withdrawals, and funding
          details recorded on the Ethereum blockchain.
        </Text>
        <Text fontSize="md">
          Project Data: Information stored in smart contracts, such as IPFS
          content identifiers (CIDs) for project descriptions, hero media, and
          milestone proofs.
        </Text>
        <Text fontSize="md">
          Note: On-chain data is publicly accessible and immutable due to the
          nature of blockchain technology.
        </Text>
        <Text fontSize="md" fontWeight="semibold" mt={2}>
          2.2 Off-Chain Data (Private)
        </Text>
        <Text fontSize="md">
          Identity Verification Data: For treasury grant applicants and users
          withdrawing over 5 ETH (or equivalent in GBP), we collect via our
          third-party KYC provider (e.g., Sumsub):
        </Text>
        <Text fontSize="md" as="ul" pl={6} listStyleType="disc">
          <Text as="li">Full name</Text>
          <Text as="li">Date of birth</Text>
          <Text as="li">
            Government-issued identification (e.g., passport, driving licence)
          </Text>
          <Text as="li">Proof of address (e.g., utility bill)</Text>
        </Text>
        <Text fontSize="md">
          Contact Information: Email addresses provided when you contact us for
          support or inquiries.
        </Text>
        <Text fontSize="md">
          Technical Data: IP addresses, browser type, and device information
          collected to enhance security and prevent fraud.
        </Text>
      </Box>

      <Box as="section" mb={6}>
        <Text fontSize="xl" fontWeight="semibold" mb={2}>
          3. How We Use Your Data
        </Text>
        <Text fontSize="md">
          We process your personal data for the following purposes, based on
          lawful grounds under UK GDPR:
        </Text>
        <Text fontSize="md" as="ul" pl={6} listStyleType="disc">
          <Text as="li">
            Platform Operation (Performance of a Contract): To facilitate
            crowdfunding, treasury grants, and smart contract interactions as
            outlined in our Terms & Conditions.
          </Text>
          <Text as="li">
            KYC & Compliance (Legal Obligation): To verify identities for
            compliance with UK anti-money laundering (AML) and counter-terrorism
            financing (CTF) regulations.
          </Text>
          <Text as="li">
            Security & Fraud Prevention (Legitimate Interests): To monitor
            transactions and protect the Platform from unauthorised or
            fraudulent activities.
          </Text>
          <Text as="li">
            Legal & Regulatory Compliance (Legal Obligation): To meet
            requirements under UK financial regulations, tax laws, and UK GDPR.
          </Text>
          <Text as="li">
            User Support & Communication (Legitimate Interests): To respond to
            inquiries, provide updates, and improve user experience.
          </Text>
        </Text>
      </Box>

      <Box as="section" mb={6}>
        <Text fontSize="xl" fontWeight="semibold" mb={2}>
          4. Data Sharing & Third Parties
        </Text>
        <Text fontSize="md">
          We do not sell your personal data. We may share it with:
        </Text>
        <Text fontSize="md" as="ul" pl={6} listStyleType="disc">
          <Text as="li">
            KYC Provider: Third-party services (e.g., Sumsub) for identity
            verification. These providers are contractually bound to protect
            your data under UK GDPR-compliant agreements.
          </Text>
          <Text as="li">
            Law Enforcement & Regulators: When required by UK law or regulatory
            authorities (e.g., HMRC, Financial Conduct Authority).
          </Text>
          <Text as="li">
            Blockchain Network: On-chain data (e.g., wallet addresses,
            transaction details) is inherently shared with the Ethereum network
            and publicly accessible.
          </Text>
          <Text as="li">
            Service Providers: Limited technical providers (e.g., hosting
            services) under strict data protection agreements.
          </Text>
        </Text>
        <Text fontSize="md" mt={2}>
          If data is transferred outside the UK (e.g., to Sumsub’s servers), we
          ensure adequate safeguards (e.g., UK International Data Transfer
          Agreement or adequacy decisions).
        </Text>
      </Box>

      <Box as="section" mb={6}>
        <Text fontSize="xl" fontWeight="semibold" mb={2}>
          5. Data Retention
        </Text>
        <Text fontSize="md" as="ul" pl={6} listStyleType="disc">
          <Text as="li">
            On-Chain Data: Permanent and immutable due to blockchain technology;
            we cannot delete it.
          </Text>
          <Text as="li">
            Off-Chain KYC Data: Retained securely for 5 years post-transaction
            to comply with UK AML regulations, then securely deleted unless
            further retention is legally required.
          </Text>
          <Text as="li">
            Contact Information: Kept for 12 months after resolution of support
            inquiries, then deleted unless needed for ongoing disputes.
          </Text>
          <Text as="li">
            Technical Data: Retained for 6 months for security purposes, then
            anonymised or deleted.
          </Text>
        </Text>
      </Box>

      <Box as="section" mb={6}>
        <Text fontSize="xl" fontWeight="semibold" mb={2}>
          6. Your Data Rights
        </Text>
        <Text fontSize="md">
          Under UK GDPR, you have the following rights:
        </Text>
        <Text fontSize="md" as="ul" pl={6} listStyleType="disc">
          <Text as="li">
            Right to Access: Request a copy of your personal data we hold.
          </Text>
          <Text as="li">
            Right to Rectification: Request corrections to inaccurate or
            incomplete data.
          </Text>
          <Text as="li">
            Right to Erasure ("Right to be Forgotten"): Request deletion of
            off-chain personal data, subject to legal retention obligations
            (e.g., AML). On-chain data cannot be erased due to blockchain
            immutability.
          </Text>
          <Text as="li">
            Right to Restrict Processing: Limit how we use your data in certain
            circumstances.
          </Text>
          <Text as="li">
            Right to Object: Object to processing based on legitimate interests
            (e.g., fraud prevention), which we will review.
          </Text>
          <Text as="li">
            Right to Data Portability: Receive your off-chain data in a
            structured, machine-readable format.
          </Text>
        </Text>
        <Text fontSize="md" mt={2}>
          To exercise these rights, email us at{" "}
          <Link href="mailto:privacy@creova.xyz" _hover={{ color: "teal.500" }}>
            privacy@creova.xyz
          </Link>
          . We will respond within 1 month, extendable to 3 months for complex
          requests. If unsatisfied, you may complain to the Information
          Commissioner’s Office (ICO) at{" "}
          <Link href="http://www.ico.org.uk" _hover={{ color: "teal.500" }}>
            www.ico.org.uk
          </Link>
          .
        </Text>
      </Box>

      <Box as="section" mb={6}>
        <Text fontSize="xl" fontWeight="semibold" mb={2}>
          7. Security Measures
        </Text>
        <Text fontSize="md" as="ul" pl={6} listStyleType="disc">
          <Text as="li">
            Encryption: Off-chain data (e.g., KYC records) is encrypted in
            transit and at rest.
          </Text>
          <Text as="li">
            Access Controls: Only authorised personnel with a strict
            need-to-know basis can access private data.
          </Text>
          <Text as="li">
            Smart Contract Audits: Regular security reviews of our blockchain
            infrastructure to mitigate vulnerabilities.
          </Text>
          <Text as="li">
            Monitoring: Continuous monitoring for suspicious activity.
          </Text>
        </Text>
        <Text fontSize="md" mt={2}>
          Despite these efforts, no system is 100% secure, especially on public
          blockchains. You accept these inherent risks by using the Platform.
        </Text>
      </Box>

      <Box as="section" mb={6}>
        <Text fontSize="xl" fontWeight="semibold" mb={2}>
          8. Cookies & Tracking
        </Text>
        <Text fontSize="md" as="ul" pl={6} listStyleType="disc">
          <Text as="li">
            We may use cookies and similar technologies on our website to:
          </Text>
          <Text as="li">
            Enhance user experience (e.g., remembering preferences).
          </Text>
          <Text as="li">Improve security (e.g., detecting fraud).</Text>
        </Text>
        <Text fontSize="md" mt={2}>
          You consent to cookies by using the Platform. You can manage
          preferences via your browser settings, though disabling cookies may
          limit functionality.
        </Text>
      </Box>

      <Box as="section" mb={6}>
        <Text fontSize="xl" fontWeight="semibold" mb={2}>
          9. Changes to This Policy
        </Text>
        <Text fontSize="md">
          We may update this Privacy Policy as needed. Significant changes will
          be announced on our website ([insert website]) or via email/X at least
          14 days before taking effect. Continued use of the Platform after
          changes indicates your acceptance.
        </Text>
      </Box>

      <Box as="section" mb={6}>
        <Text fontSize="xl" fontWeight="semibold" mb={2}>
          10. Contact Us
        </Text>
        <Text fontSize="md">
          For privacy-related inquiries or to exercise your rights, contact our
          Data Protection Officer at:
        </Text>
        <Text fontSize="md" as="ul" pl={6} listStyleType="disc">
          <Text as="li">
            Email:{" "}
            <Link
              href="mailto:adam@creova.xyz"
              _hover={{ color: "teal.500" }}
            >
              adam@creova.xyz
            </Link>
          </Text>
          <Text as="li">
            Post: [Creova Group Ltd], [3 Childwick Green, Childwickbury], [AL36JJ]
          </Text>
        </Text>
      </Box>

      <Link href="/legal" fontSize="md" _hover={{ color: "teal.500" }}>
        Back to Legal
      </Link>
    </Box>
  );
}