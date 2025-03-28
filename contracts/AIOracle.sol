// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./IAIOracle.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AIOracle is IAIOracle, Ownable {
    mapping(uint256 => mapping(uint256 => bool)) public validationResults; // Stores AI validation outcomes

    // ✅ Fix: Pass msg.sender to Ownable constructor
    constructor() Ownable(msg.sender) {}

    function validateMilestone(uint256 campaignId, uint256 milestoneId, string memory proofCID) external view override returns (bool) {
        // Simulated AI logic: Automatically approves if proofCID is non-empty
        return bytes(proofCID).length > 0;
    }

    function setValidationResult(uint256 campaignId, uint256 milestoneId, bool isValid) external onlyOwner {
        validationResults[campaignId][milestoneId] = isValid;
    }
}