// pages/legal/treasury-and-governance-policy.js
import { Box, Text, Link } from "@chakra-ui/react";

export default function TreasuryAndGovernancePolicy() {
  return (
    <Box pt={20} mt={24} py={10} pX={8} maxW="container.xl" mx="auto">
      <Text fontSize="3xl" fontWeight="bold" mb={6} color="gray.900">
        Treasury & Governance Policy for Public Goods Funding
      </Text>
      <Text fontSize="sm" mb={4}>
        Last Updated: 17 March 2025
      </Text>

      <Box as="section" mb={6}>
        <Text fontSize="xl" fontWeight="semibold" mb={2}>
          1. Introduction
        </Text>
        <Text fontSize="md">
          Creova ("we," "us," or "our") operates a decentralised Web3 funding platform, managed by [Creova Group Ltd], a [company] registered in [England/Wales/Scotland/Northern Ireland, 16336209
          ]. The Platform supports public goods projects through non-commercial crowdfunding and treasury grants via the FundingPool smart contract deployed on the Ethereum blockchain at [insert contract address]. This Treasury & Governance Policy ("Policy") outlines how the Creova treasury is managed, how funds are allocated, and the governance mechanisms ensuring fairness, transparency, and sustainability. By participating in the treasury system, you agree to abide by this Policy.
        </Text>
      </Box>

      <Box as="section" mb={6}>
        <Text fontSize="xl" fontWeight="semibold" mb={2}>
          2. Treasury Structure
        </Text>
        <Text fontSize="md">
          The Creova treasury is an Ethereum-based, smart contract-controlled fund holding Ether (ETH) for allocation to approved public goods projects.
        </Text>
        <Text fontSize="md" mt={2}>
          Treasury funds are replenished through:
        </Text>
        <Text fontSize="md" as="ul" pl={6} listStyleType="disc">
          <Text as="li">Funding Fees: 2.5% of each crowdfunding or treasury grant contribution, automatically directed to the treasury wallet (daoTreasury).</Text>
          <Text as="li">Withdrawal Fees: 1.25% of all withdrawals (crowdfunding or treasury grants), routed to the treasury.</Text>
          <Text as="li">Unspent Treasury Grants: Funds from rejected or incomplete milestones returned to the treasury via the smart contract’s refundUnspentFunds function.</Text>
        </Text>
        <Text fontSize="md" mt={2}>
          The treasury operates under predefined governance rules encoded in the smart contract, ensuring automated and auditable fund management.
        </Text>
      </Box>

      <Box as="section" mb={6}>
        <Text fontSize="xl" fontWeight="semibold" mb={2}>
          3. Treasury Fund Allocation
        </Text>
        <Text fontSize="md" as="ul" pl={6} listStyleType="disc">
          <Text as="li">Quarterly Limits: Treasury funds are allocated quarterly, with a maximum of 10% of the smart contract’s balance per 90-day period (QUARTER_DURATION). This limit is recalculated at the start of each quarter or when the owner updates it via updateTreasuryLimit.</Text>
          <Text as="li">Purpose: Funds are distributed exclusively to treasury grants for public goods projects, defined as initiatives delivering significant social, environmental, technological, or economic benefits (per our Terms & Conditions).</Text>
          <Text as="li">Milestone-Based Disbursement: Treasury grants are released in tranches tied to predefined milestones (e.g., 30% Proof of Concept, 30% Beta, 40% Final Product), as specified in the smart contract. Funds are only disbursed upon voter or admin approval of milestone proofs.</Text>
        </Text>
      </Box>

      <Box as="section" mb={6}>
        <Text fontSize="xl" fontWeight="semibold" mb={2}>
          4. Treasury Grant Approval Process
        </Text>
        <Text fontSize="md" as="ul" pl={6} listStyleType="disc">
          <Text as="li">Project Submission: Creators submit treasury grant applications via the Platform, providing project details (e.g., name, funding goal, IPFS CIDs) through the createCampaign function with FundingType.TreasuryGrant.</Text>
          <Text as="li">Initial Review: Applications are assessed for eligibility by Creova administrators or users with the VOTER_ROLE (as defined in the smart contract).</Text>
          <Text as="li">Voting & Approval:</Text>
          <Text as="ul" pl={6} listStyleType="circle">
            <Text as="li">Admin Approval: Grants below 5 ETH may be approved by Creova administrators with the DEFAULT_ADMIN_ROLE or KYC_ADMIN_ROLE.</Text>
            <Text as="li">Community Voting: Grants exceeding 5 ETH require approval by a majority of VOTER_ROLE holders via the voteCampaign function.</Text>
          </Text>
          <Text as="li">Milestone Verification: Funds are released incrementally as creators submit proofs (via submitMilestoneProof) and voters approve them (via approveMilestone).</Text>
          <Text as="li">Auto-Rejection: Unreviewed applications expire after 14 days (APPLICATION_EXPIRY) and are rejected via autoRejectUnreviewedTreasuryGrants, unless overridden by voters (overrideAutoRejection).</Text>
        </Text>
      </Box>

      <Box as="section" mb={6}>
        <Text fontSize="xl" fontWeight="semibold" mb={2}>
          5. Treasury Governance & Oversight
        </Text>
        <Text fontSize="md" as="ul" pl={6} listStyleType="disc">
          <Text as="li">Transparency: All treasury transactions (e.g., allocations, refunds) are publicly recorded on the Ethereum blockchain and verifiable via the smart contract’s event logs (e.g., TreasuryGrantFunded, TreasuryFundsRefunded).</Text>
          <Text as="li">Governance Model:</Text>
          <Text as="ul" pl={6} listStyleType="circle">
            <Text as="li">The treasury operates under smart contract logic, ensuring automated, tamper-proof fund allocation and disbursement.</Text>
            <Text as="li">Users with the VOTER_ROLE, assigned by the contract owner, participate in grant approvals and milestone verifications.</Text>
            <Text as="li">The contract owner (initially the deployer) retains authority to update quarterly limits and assign roles.</Text>
          </Text>
          <Text as="li">Treasury Review Committee: A designated group of Creova administrators and/or VOTER_ROLE holders may periodically review treasury disbursements to ensure alignment with public goods criteria and this Policy. Committee decisions are advisory and executed via smart contract functions.</Text>
        </Text>
      </Box>

      <Box as="section" mb={6}>
        <Text fontSize="xl" fontWeight="semibold" mb={2}>
          6. Treasury Fund Misuse & Recourse
        </Text>
        <Text fontSize="md">
          If a project misuses treasury funds or fails to meet milestones, the following measures apply:
        </Text>
        <Text fontSize="md" as="ul" pl={6} listStyleType="disc">
          <Text as="li">Halt Disbursements: Unapproved or rejected milestones (rejectMilestone) prevent further fund releases until resolved.</Text>
          <Text as="li">Documentation Requests: Creators may be required to submit additional proof (via submitMilestoneProof) within 7 days (RESUBMISSION_WINDOW) of rejection.</Text>
          <Text as="li">Fund Recovery: Unspent funds from rejected milestones are returned to the treasury after the resubmission window via refundUnspentFunds.</Text>
          <Text as="li">Sanctions: Repeat offenders may be banned from future treasury grants, enforced by denying VOTER_ROLE approvals or admin intervention.</Text>
        </Text>
      </Box>

      <Box as="section" mb={6}>
        <Text fontSize="xl" fontWeight="semibold" mb={2}>
          7. Emergency Fund Controls
        </Text>
        <Text fontSize="md">
          In exceptional circumstances (e.g., suspected fraud, regulatory action, smart contract vulnerabilities), the treasury may:
        </Text>
        <Text fontSize="md" as="ul" pl={6} listStyleType="disc">
          <Text as="li">Pause Disbursements: The contract owner may halt operations if a pausable mechanism is added (currently not implemented—future update recommended).</Text>
          <Text as="li">Require Verification: Additional KYC or milestone checks may be imposed via setEmergencyWithdrawalOverride for withdrawals exceeding 5 ETH.</Text>
          <Text as="li">Reassess Grants: Existing approvals may be reviewed and revoked by VOTER_ROLE holders or administrators if misuse is evident.</Text>
        </Text>
        <Text fontSize="md" mt={2}>
          These measures aim to protect treasury integrity, subject to smart contract capabilities.
        </Text>
      </Box>

      <Box as="section" mb={6}>
        <Text fontSize="xl" fontWeight="semibold" mb={2}>
          8. Amendments to This Policy
        </Text>
        <Text fontSize="md">
          Creova reserves the right to amend this Policy to reflect changes in governance practices, regulatory requirements, or treasury management needs.
        </Text>
        <Text fontSize="md" mt={2}>
          Significant amendments will be announced on our website ([www.creova.xyz]) or via email/X at least 14 days before taking effect. Minor updates (e.g., clarifications) may take effect immediately.
        </Text>
        <Text fontSize="md" mt={2}>
          Continued participation in the treasury system after amendments constitutes acceptance.
        </Text>
      </Box>

      <Box as="section" mb={6}>
        <Text fontSize="xl" fontWeight="semibold" mb={2}>
          9. Contact Information
        </Text>
        <Text fontSize="md">
          For treasury-related inquiries, contact us at:
        </Text>
        <Text fontSize="md" as="ul" pl={6} listStyleType="disc">
          <Text as="li">
            Email:{" "}
            <Link href="mailto:treasury@creova.xyz" _hover={{ color: "teal.500" }}>
              adam@creova.xyz
            </Link>
          </Text>
          <Text as="li">
            Website: www.creova.xyz
          </Text>
        </Text>
        <Text fontSize="md" mt={2}>
          By participating in the Creova treasury system, whether as a funder, creator, or voter, you acknowledge and agree to abide by this Treasury & Governance Policy.
        </Text>
      </Box>

      <Link href="/legal" fontSize="md" _hover={{ color: "teal.500" }}>
        Back to Legal
      </Link>
    </Box>
  );
}