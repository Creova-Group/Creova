// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

interface IAIOracle {
    function validateMilestone(uint256 campaignId, uint256 milestoneId, string memory proofCID) external view returns (bool);
}