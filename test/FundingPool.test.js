const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FundingPool", function () {
    let FundingPool, fundingPool, owner, contributor, anotherUser, daoTreasury;

    before(async function () {
        [owner, contributor, anotherUser] = await ethers.getSigners();
        daoTreasury = owner.address;
        FundingPool = await ethers.getContractFactory("FundingPool");
    });

    beforeEach(async function () {
        fundingPool = await FundingPool.deploy(daoTreasury);
        await fundingPool.waitForDeployment();
        await fundingPool.setVerifiedCreator(owner.address, true);
    });

    describe("Deployment", function () {
        it("sets the DAO treasury correctly", async function () {
            expect(await fundingPool.daoTreasury()).to.equal(daoTreasury);
        });
    });

    describe("Campaign Creation", function () {
        it("creates a campaign with correct details", async function () {
            await fundingPool.createCampaign(ethers.parseEther("1.0"), 7 * 24 * 60 * 60);
            const campaign = await fundingPool.getCampaign(1);
            expect(campaign.creator).to.equal(owner.address);
            expect(campaign.fundingGoal).to.equal(ethers.parseEther("1.0"));
        });

        it("reverts if creator is not verified", async function () {
            await fundingPool.setVerifiedCreator(owner.address, false);
            await expect(
                fundingPool.createCampaign(ethers.parseEther("1.0"), 7 * 24 * 60 * 60)
            ).to.be.revertedWithCustomError(fundingPool, "NotVerifiedCreator"); // ✅ Corrected matcher
        });
    });
});