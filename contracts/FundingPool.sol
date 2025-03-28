// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "./IAIOracle.sol";

contract FundingPool is Initializable, ReentrancyGuardUpgradeable, OwnableUpgradeable, AccessControlUpgradeable {
    enum Status { Pending, Approved, Rejected }
    enum FundingType { Crowdfunding, TreasuryGrant }

    bytes32 public constant VOTER_ROLE = keccak256("VOTER_ROLE");
    bytes32 public constant KYC_ADMIN_ROLE = keccak256("KYC_ADMIN_ROLE");

    struct Milestone {
        string description;
        uint256 amount;
        bool completed;
        uint256 completedAt;
        string proofCID;
        uint256 rejectedAt;
    }

    struct Campaign {
        string name;
        address creator;
        uint256 fundingGoal;
        uint256 deadline;
        uint256 amountRaised;
        uint256 crowdfundedAmount;
        Status status;
        FundingType fundingType;
        Milestone[] milestones;
        uint256 withdrawnAmount;
        uint256 crowdfundedWithdrawnAmount;
        string projectCID;
        string heroMediaCID;
        string description;
        uint256 createdAt;
        uint256 applicationExpiry;
    }

    uint256 public campaignIds;
    mapping(uint256 => Campaign) public campaigns;
    mapping(address => mapping(uint256 => uint256)) public userContributions;
    mapping(uint256 => address[]) public campaignContributors;

    address public daoTreasury;
    IAIOracle public aiOracle;
    uint256 constant QUARTER_DURATION = 90 days;
    uint256 constant RESUBMISSION_WINDOW = 7 days;
    uint256 constant APPLICATION_EXPIRY = 14 days;
    uint256 constant CROWDFUNDING_DURATION = 30 days;
    uint256 public constant KYC_WITHDRAWAL_THRESHOLD = 5 ether;

    uint256 public quarterlyTreasuryLimit;
    uint256 public currentQuarterStart;
    uint256 public quarterlyFundsUsed;

    uint256 constant MILESTONE_1_PERCENT = 30;
    uint256 constant MILESTONE_2_PERCENT = 30;
    uint256 constant MILESTONE_3_PERCENT = 40;

    mapping(address => bool) public isKYCVerified;
    mapping(address => mapping(uint256 => bool)) public emergencyWithdrawalOverrides;
    mapping(address => uint256) public failedTransferBalances;

    event CampaignCreated(uint256 indexed campaignId, address indexed creator, string name, uint256 fundingGoal, string projectCID, string heroMediaCID, string description, uint256 createdAt);
    event CampaignStatusUpdated(uint256 indexed campaignId, Status status);
    event MilestoneAdded(uint256 indexed campaignId, string description, uint256 amount);
    event FundsWithdrawn(uint256 indexed campaignId, address indexed creator, uint256 amount, uint256 treasuryFee, uint256 ownerFee, bool isCrowdfunded);
    event ProjectFunded(uint256 indexed campaignId, address indexed funder, uint256 amount, uint256 treasuryFee, uint256 ownerFee, uint256 timestamp, bool isTreasuryGrant);
    event MilestoneCompleted(uint256 indexed campaignId, uint256 milestoneId, uint256 completedAt);
    event MilestoneProofSubmitted(uint256 indexed campaignId, uint256 milestoneId, string proofCID);
    event MilestoneRejected(uint256 indexed campaignId, uint256 milestoneId, uint256 rejectedAt);
    event TreasuryGrantFunded(uint256 indexed campaignId, uint256 amount);
    event QuarterlyLimitUpdated(uint256 newLimit, uint256 timestamp);
    event TreasuryFundsRefunded(uint256 indexed campaignId, uint256 amount);
    event AutoRejectionOverridden(uint256 indexed campaignId, address admin);
    event OwnerWithdrawal(address indexed owner, uint256 amount);
    event TransferFailed(address indexed recipient, uint256 amount);
    event KYCStatusUpdated(address indexed user, bool verified);
    event EmergencyWithdrawalOverride(uint256 indexed campaignId, address indexed creator, bool allowed);
    event CampaignDeleted(uint256 indexed campaignId, address indexed creator, uint256 refundedAmount);

    function initialize(address _daoTreasury) public initializer {
        require(_daoTreasury != address(0), "DAO Treasury cannot be zero");

        __ReentrancyGuard_init();
        __Ownable_init(msg.sender);
        __AccessControl_init();

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(KYC_ADMIN_ROLE, msg.sender);

        daoTreasury = _daoTreasury;
        quarterlyTreasuryLimit = address(this).balance / 10;
        currentQuarterStart = block.timestamp;
        quarterlyFundsUsed = 0;
    }

    function updateKYCStatus(address _user, bool _verified) external onlyRole(KYC_ADMIN_ROLE) {
        require(_user != address(0), "Invalid address");
        isKYCVerified[_user] = _verified;
        emit KYCStatusUpdated(_user, _verified);
    }

    function setEmergencyWithdrawalOverride(uint256 _campaignId, address _creator, bool _allowed) external onlyRole(KYC_ADMIN_ROLE) {
        emergencyWithdrawalOverrides[_creator][_campaignId] = _allowed;
        emit EmergencyWithdrawalOverride(_campaignId, _creator, _allowed);
    }

    function _addStandardMilestones(uint256 _campaignId, uint256 _fundingGoal) internal {
        Campaign storage campaign = campaigns[_campaignId];
        uint256 milestone1Amount = (_fundingGoal * MILESTONE_1_PERCENT) / 100;
        uint256 milestone2Amount = (_fundingGoal * MILESTONE_2_PERCENT) / 100;
        uint256 milestone3Amount = (_fundingGoal * MILESTONE_3_PERCENT) / 100;

        campaign.milestones.push(Milestone({
            description: "Proof of Concept or MVP",
            amount: milestone1Amount,
            completed: false,
            completedAt: 0,
            proofCID: "",
            rejectedAt: 0
        }));
        emit MilestoneAdded(_campaignId, "Proof of Concept or MVP", milestone1Amount);

        campaign.milestones.push(Milestone({
            description: "Beta/Prototype Completed",
            amount: milestone2Amount,
            completed: false,
            completedAt: 0,
            proofCID: "",
            rejectedAt: 0
        }));
        emit MilestoneAdded(_campaignId, "Beta/Prototype Completed", milestone2Amount);

        campaign.milestones.push(Milestone({
            description: "Final Product Launched and Publicly Usable",
            amount: milestone3Amount,
            completed: false,
            completedAt: 0,
            proofCID: "",
            rejectedAt: 0
        }));
        emit MilestoneAdded(_campaignId, "Final Product Launched and Publicly Usable", milestone3Amount);
    }

    function _addCustomMilestones(uint256 _campaignId, string[] memory _descriptions, uint256[] memory _amounts) internal {
        Campaign storage campaign = campaigns[_campaignId];
        for (uint i = 0; i < _descriptions.length; i++) {
            campaign.milestones.push(Milestone({
                description: _descriptions[i],
                amount: _amounts[i],
                completed: false,
                completedAt: 0,
                proofCID: "",
                rejectedAt: 0
            }));
            emit MilestoneAdded(_campaignId, _descriptions[i], _amounts[i]);
        }
    }

    function createCampaign(
        string memory _name,
        uint256 _fundingGoal,
        FundingType _fundingType,
        string[] memory _milestoneDescriptions,
        uint256[] memory _milestoneAmounts,
        string memory _projectCID,
        string memory _heroMediaCID,
        string memory _description
    ) external returns (uint256) {
        if (_fundingType == FundingType.TreasuryGrant) {
            if (_fundingGoal > KYC_WITHDRAWAL_THRESHOLD) {
                require(isKYCVerified[msg.sender], "KYC verification required for Treasury Grants over 5 ETH");
            }
            require(_fundingGoal <= getAvailableTreasuryFunds(), "Insufficient treasury funds");
            require(_milestoneDescriptions.length == 0 && _milestoneAmounts.length == 0, "Treasury Grants use predefined milestones");
        } else {
            require(_milestoneDescriptions.length == _milestoneAmounts.length, "Milestones mismatch");
        }

        campaignIds++;
        Campaign storage campaign = campaigns[campaignIds];
        campaign.name = _name;
        campaign.creator = msg.sender;
        campaign.fundingGoal = _fundingGoal;
        
        if (_fundingType == FundingType.Crowdfunding && msg.sender == owner() && campaignIds == 1) {
         campaign.deadline = type(uint256).max; // No deadline for official Creova campaign
} else {
    campaign.deadline = block.timestamp + CROWDFUNDING_DURATION;
}
        
        campaign.status = Status.Pending;
        campaign.fundingType = _fundingType;
        campaign.projectCID = _projectCID;
        campaign.heroMediaCID = _heroMediaCID;
        campaign.description = _description;
        campaign.createdAt = block.timestamp;
        campaign.applicationExpiry = _fundingType == FundingType.TreasuryGrant ? block.timestamp + APPLICATION_EXPIRY : 0;

        if (_fundingType == FundingType.TreasuryGrant) {
            _addStandardMilestones(campaignIds, _fundingGoal);
        } else if (_milestoneDescriptions.length > 0) {
            _addCustomMilestones(campaignIds, _milestoneDescriptions, _milestoneAmounts);
        }

        emit CampaignCreated(campaignIds, msg.sender, _name, _fundingGoal, _projectCID, _heroMediaCID, _description, block.timestamp);
        return campaignIds;
    }

    function voteCampaign(uint256 _campaignId) external onlyRole(VOTER_ROLE) {
        Campaign storage campaign = campaigns[_campaignId];
        require(campaign.status == Status.Pending, "Campaign not pending");
        require(campaign.fundingType != FundingType.TreasuryGrant || campaign.milestones.length > 0, "Treasury Grants require milestones");

        campaign.status = Status.Approved;
        emit CampaignStatusUpdated(_campaignId, Status.Approved);

        if (campaign.fundingType == FundingType.TreasuryGrant) {
            _fundTreasuryGrant(_campaignId);
        }
    }

    function fundProject(uint256 _campaignId) external payable nonReentrant {
        Campaign storage campaign = campaigns[_campaignId];
        require(campaign.status == Status.Approved, "Campaign not approved");
        require(block.timestamp <= campaign.deadline, "Funding deadline passed");
        require(msg.value > 0, "Must send ETH");

        // Updated fee structure: 5% total (4% to owner/Creova, 1% to treasury)
        uint256 totalFee = (msg.value * 50) / 1000; // 5%
        if (totalFee == 0 && msg.value > 0) totalFee = 1;
        uint256 treasuryFee = (msg.value * 10) / 1000; // 1%
        uint256 ownerFee = (msg.value * 40) / 1000; // 4%
        uint256 amountToCampaign = msg.value - totalFee;

        (bool treasurySent,) = daoTreasury.call{value: treasuryFee}("");
        if (!treasurySent) {
            failedTransferBalances[daoTreasury] += treasuryFee;
            emit TransferFailed(daoTreasury, treasuryFee);
        }

        (bool ownerSent,) = owner().call{value: ownerFee}("");
        if (!ownerSent) {
            failedTransferBalances[owner()] += ownerFee;
            emit TransferFailed(owner(), ownerFee);
        }

        if (campaign.fundingType == FundingType.Crowdfunding) {
            campaign.amountRaised += amountToCampaign;
        } else {
            campaign.crowdfundedAmount += amountToCampaign;
        }

        userContributions[msg.sender][_campaignId] += amountToCampaign;
        if (userContributions[msg.sender][_campaignId] == amountToCampaign) {
            campaignContributors[_campaignId].push(msg.sender);
        }

        emit ProjectFunded(_campaignId, msg.sender, amountToCampaign, treasuryFee, ownerFee, block.timestamp, campaign.fundingType == FundingType.TreasuryGrant);
    }

    function withdrawFunds(uint256 _campaignId) external nonReentrant {
        Campaign storage campaign = campaigns[_campaignId];
        require(msg.sender == campaign.creator, "Not creator");
        require(campaign.status == Status.Approved, "Campaign not approved");

        uint256 amount;
        bool isCrowdfunded;

        if (campaign.fundingType == FundingType.Crowdfunding) {
            amount = campaign.amountRaised - campaign.withdrawnAmount;
            isCrowdfunded = false;
            require(amount > 0, "No funds to withdraw");
            if (campaign.amountRaised < campaign.fundingGoal && block.timestamp < campaign.deadline) {
                revert("Goal not met and deadline not passed");
            }
        } else {
            amount = campaign.crowdfundedAmount - campaign.crowdfundedWithdrawnAmount;
            isCrowdfunded = true;
            require(amount > 0, "No crowdfunded funds to withdraw");
            if (campaign.amountRaised < campaign.fundingGoal && block.timestamp < campaign.deadline) {
                revert("Treasury goal not met and deadline not passed");
            }
        }

        if (amount > KYC_WITHDRAWAL_THRESHOLD) {
            require(isKYCVerified[msg.sender] || emergencyWithdrawalOverrides[msg.sender][_campaignId], "KYC or admin override required for large withdrawals");
        }

        // Updated fee structure: 2.5% total (1.5% to owner/Creova, 1% to treasury)
        uint256 totalWithdrawalFee = (amount * 25) / 1000; // 2.5%
        if (totalWithdrawalFee == 0 && amount > 0) totalWithdrawalFee = 1;
        uint256 treasuryFee = (amount * 10) / 1000; // 1%
        uint256 ownerFee = (amount * 15) / 1000; // 1.5%
        uint256 netAmount = amount - totalWithdrawalFee;

        (bool treasurySent,) = daoTreasury.call{value: treasuryFee}("");
        if (!treasurySent) {
            failedTransferBalances[daoTreasury] += treasuryFee;
            emit TransferFailed(daoTreasury, treasuryFee);
        }

        (bool ownerSent,) = owner().call{value: ownerFee}("");
        if (!ownerSent) {
            failedTransferBalances[owner()] += ownerFee;
            emit TransferFailed(owner(), ownerFee);
        }

        if (campaign.fundingType == FundingType.Crowdfunding) {
            campaign.withdrawnAmount += amount;
        } else {
            campaign.crowdfundedWithdrawnAmount += amount;
        }

        (bool success,) = msg.sender.call{value: netAmount}("");
        require(success, "Withdraw failed");
        emit FundsWithdrawn(_campaignId, msg.sender, netAmount, treasuryFee, ownerFee, isCrowdfunded);
    }

    function submitMilestoneProof(uint256 _campaignId, uint256 _milestoneId, string memory _proofCID) external {
        Campaign storage campaign = campaigns[_campaignId];
        require(msg.sender == campaign.creator, "Not creator");
        require(campaign.fundingType == FundingType.TreasuryGrant, "Not a treasury grant");
        require(_milestoneId < campaign.milestones.length, "Invalid milestone");

        Milestone storage milestone = campaign.milestones[_milestoneId];
        require(!milestone.completed, "Milestone already completed");
        require(milestone.rejectedAt == 0 || block.timestamp >= milestone.rejectedAt + RESUBMISSION_WINDOW, "Resubmission too soon");

        if (address(aiOracle) != address(0)) {
            bool isValid = aiOracle.validateMilestone(_campaignId, _milestoneId, _proofCID);
            require(isValid, "AI validation failed");
        }

        milestone.proofCID = _proofCID;
        emit MilestoneProofSubmitted(_campaignId, _milestoneId, _proofCID);
    }

    function approveMilestone(uint256 _campaignId, uint256 _milestoneId) external onlyRole(VOTER_ROLE) {
        Campaign storage campaign = campaigns[_campaignId];
        require(campaign.fundingType == FundingType.TreasuryGrant, "Not a treasury grant");
        require(_milestoneId < campaign.milestones.length, "Invalid milestone");
        Milestone storage milestone = campaign.milestones[_milestoneId];
        require(!milestone.completed, "Milestone already completed");
        require(bytes(milestone.proofCID).length > 0, "No proof submitted");

        milestone.completed = true;
        milestone.completedAt = block.timestamp;
        emit MilestoneCompleted(_campaignId, _milestoneId, block.timestamp);
    }

    function rejectMilestone(uint256 _campaignId, uint256 _milestoneId) external onlyRole(VOTER_ROLE) {
        Campaign storage campaign = campaigns[_campaignId];
        require(campaign.fundingType == FundingType.TreasuryGrant, "Not a treasury grant");
        require(_milestoneId < campaign.milestones.length, "Invalid milestone");
        Milestone storage milestone = campaign.milestones[_milestoneId];
        require(!milestone.completed, "Milestone already completed");

        milestone.rejectedAt = block.timestamp;
        emit MilestoneRejected(_campaignId, _milestoneId, block.timestamp);
    }

    function withdrawMilestoneFunds(uint256 _campaignId, uint256 _milestoneId) external nonReentrant {
        Campaign storage campaign = campaigns[_campaignId];
        require(msg.sender == campaign.creator, "Not creator");
        require(campaign.fundingType == FundingType.TreasuryGrant, "Not a treasury grant");
        require(_milestoneId < campaign.milestones.length, "Invalid milestone");
        Milestone storage milestone = campaign.milestones[_milestoneId];
        require(milestone.completed, "Milestone not completed");

        uint256 amount = milestone.amount;
        require(amount > 0, "No funds to withdraw");

        if (amount > KYC_WITHDRAWAL_THRESHOLD) {
            require(isKYCVerified[msg.sender] || emergencyWithdrawalOverrides[msg.sender][_campaignId], "KYC or admin override required for large withdrawals");
        }

        milestone.amount = 0;
        campaign.withdrawnAmount += amount;
        (bool success,) = msg.sender.call{value: amount}("");
        require(success, "Withdraw failed");
        emit FundsWithdrawn(_campaignId, msg.sender, amount, 0, 0, false);
    }

    function setKYCVerified(address user, bool status) public onlyRole(KYC_ADMIN_ROLE) {
        isKYCVerified[user] = status;
        emit KYCStatusUpdated(user, status);
    }
    function approveCustomMilestones(uint256 _campaignId, string[] memory _descriptions, uint256[] memory _amounts) external onlyRole(VOTER_ROLE) {
        Campaign storage campaign = campaigns[_campaignId];
        require(campaign.fundingType == FundingType.TreasuryGrant, "Not a treasury grant");
        require(campaign.status == Status.Pending, "Campaign must be pending");
        require(_descriptions.length == _amounts.length, "Milestones mismatch");

        delete campaign.milestones;
        _addCustomMilestones(_campaignId, _descriptions, _amounts);
    }

    function autoRejectUnreviewedTreasuryGrants(uint256 _campaignId) external {
        Campaign storage campaign = campaigns[_campaignId];
        require(campaign.fundingType == FundingType.TreasuryGrant, "Not a treasury grant");
        require(campaign.status == Status.Pending, "Campaign not pending");
        require(block.timestamp >= campaign.applicationExpiry, "Application not expired");

        campaign.status = Status.Rejected;
        emit CampaignStatusUpdated(_campaignId, Status.Rejected);
    }

    function overrideAutoRejection(uint256 _campaignId) external onlyRole(VOTER_ROLE) {
        Campaign storage campaign = campaigns[_campaignId];
        require(campaign.fundingType == FundingType.TreasuryGrant, "Not a treasury grant");
        require(campaign.status == Status.Rejected, "Campaign not rejected");
        require(block.timestamp >= campaign.applicationExpiry, "Application not expired");

        campaign.status = Status.Pending;
        campaign.applicationExpiry = block.timestamp + APPLICATION_EXPIRY;
        emit AutoRejectionOverridden(_campaignId, msg.sender);
    }

    function refundUnspentFunds(uint256 _campaignId) external {
        Campaign storage campaign = campaigns[_campaignId];
        require(campaign.fundingType == FundingType.TreasuryGrant, "Not a treasury grant");

        uint256 unspentAmount = 0;
        bool shouldRefund = false;

        for (uint i = 0; i < campaign.milestones.length; i++) {
            Milestone storage milestone = campaign.milestones[i];
            if (milestone.rejectedAt > 0 && !milestone.completed && block.timestamp >= milestone.rejectedAt + RESUBMISSION_WINDOW) {
                unspentAmount += milestone.amount;
                milestone.amount = 0;
                shouldRefund = true;
            }
        }

        if (shouldRefund && unspentAmount > 0) {
            campaign.amountRaised -= unspentAmount;
            campaign.withdrawnAmount = campaign.amountRaised;
            quarterlyFundsUsed -= unspentAmount;
            (bool success,) = daoTreasury.call{value: unspentAmount}("");
            require(success, "Refund failed");
            emit TreasuryFundsRefunded(_campaignId, unspentAmount);
        }
    }

    function deleteCampaign(uint256 _campaignId) external onlyRole(DEFAULT_ADMIN_ROLE) nonReentrant {
        Campaign storage campaign = campaigns[_campaignId];
        require(campaign.creator != address(0), "Campaign does not exist");
        
        // Calculate refundable amounts
        uint256 refundableAmount = 0;
        
        // For Treasury Grants
        if (campaign.fundingType == FundingType.TreasuryGrant) {
            refundableAmount = campaign.amountRaised - campaign.withdrawnAmount;
            if (refundableAmount > 0) {
                quarterlyFundsUsed -= refundableAmount;
                (bool treasurySuccess,) = daoTreasury.call{value: refundableAmount}("");
                require(treasurySuccess, "Treasury refund failed");
            }
        }
        
        // For Crowdfunding
        if (campaign.crowdfundedAmount > campaign.crowdfundedWithdrawnAmount) {
            uint256 crowdfundedRefund = campaign.crowdfundedAmount - campaign.crowdfundedWithdrawnAmount;
            refundableAmount += crowdfundedRefund;
            
            // Refund contributors
            address[] memory contributors = campaignContributors[_campaignId];
            for (uint i = 0; i < contributors.length; i++) {
                address contributor = contributors[i];
                uint256 contribution = userContributions[contributor][_campaignId];
                if (contribution > 0) {
                    uint256 refundAmount = (contribution * crowdfundedRefund) / campaign.crowdfundedAmount;
                    userContributions[contributor][_campaignId] = 0;
                    (bool success,) = contributor.call{value: refundAmount}("");
                    if (!success) {
                        failedTransferBalances[contributor] += refundAmount;
                        emit TransferFailed(contributor, refundAmount);
                    }
                }
            }
        }

        // Clean up campaign data
        delete campaigns[_campaignId];
        delete campaignContributors[_campaignId];
        
        emit CampaignDeleted(_campaignId, campaign.creator, refundableAmount);
    }

    function _fundTreasuryGrant(uint256 _campaignId) internal {
        Campaign storage campaign = campaigns[_campaignId];
        if (block.timestamp >= currentQuarterStart + QUARTER_DURATION) {
            currentQuarterStart = block.timestamp;
            quarterlyFundsUsed = 0;
            quarterlyTreasuryLimit = address(this).balance / 10;
            emit QuarterlyLimitUpdated(quarterlyTreasuryLimit, block.timestamp);
        }

        require(quarterlyFundsUsed + campaign.fundingGoal <= quarterlyTreasuryLimit, "Exceeds quarterly limit");
        require(address(this).balance >= campaign.fundingGoal, "Insufficient treasury funds");

        campaign.amountRaised += campaign.fundingGoal;
        quarterlyFundsUsed += campaign.fundingGoal;
        emit TreasuryGrantFunded(_campaignId, campaign.fundingGoal);
    }

    function ownerWithdraw(uint256 _amount) external onlyOwner nonReentrant {
        require(_amount <= address(this).balance, "Insufficient funds");
        (bool success,) = owner().call{value: _amount}("");
        require(success, "Withdraw failed");
        emit OwnerWithdrawal(msg.sender, _amount);
    }

    function setAIOracle(address _aiOracle) external onlyOwner {
        require(_aiOracle != address(0), "Invalid AI Oracle address");
        aiOracle = IAIOracle(_aiOracle);
    }

    function withdrawFailedTransfers(address _recipient) external onlyOwner nonReentrant {
        uint256 amount = failedTransferBalances[_recipient];
        require(amount > 0, "No failed transfers to withdraw");
        failedTransferBalances[_recipient] = 0;
        (bool success,) = _recipient.call{value: amount}("");
        require(success, "Failed transfer withdrawal failed");
    }

    function updateTreasuryLimit() public onlyOwner {
        if (block.timestamp >= currentQuarterStart + QUARTER_DURATION) {
            currentQuarterStart = block.timestamp;
            quarterlyFundsUsed = 0;
        }
        quarterlyTreasuryLimit = address(this).balance / 10;
        emit QuarterlyLimitUpdated(quarterlyTreasuryLimit, block.timestamp);
    }

    function getAvailableTreasuryFunds() public view returns (uint256) {
        if (block.timestamp >= currentQuarterStart + QUARTER_DURATION) {
            return address(this).balance / 10;
        }
        return quarterlyTreasuryLimit > quarterlyFundsUsed ? quarterlyTreasuryLimit - quarterlyFundsUsed : 0;
    }

    receive() external payable {
        if (msg.sender == owner()) {
            updateTreasuryLimit();
        }
    }

    function getContributors(uint256 _campaignId) external view returns (address[] memory) {
        return campaignContributors[_campaignId];
    }

    function getUserContribution(uint256 _campaignId, address _contributor) external view returns (uint256) {
        return userContributions[_contributor][_campaignId];
    }

    function getCampaignMilestones(uint256 _campaignId) external view returns (Milestone[] memory) {
        return campaigns[_campaignId].milestones;
    }

    function getCrowdfundedAmount(uint256 _campaignId) external view returns (uint256) {
        return campaigns[_campaignId].crowdfundedAmount;
    }

    uint256[50] private __gap;
}