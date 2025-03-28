const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Lock", function () {
    let Lock, lock, owner, otherAccount;
    let unlockTime;

    before(async function () {
        [owner, otherAccount] = await ethers.getSigners();
    });

    beforeEach(async function () {
        unlockTime = (await ethers.provider.getBlock("latest")).timestamp + 60; // ✅ Ensure unlock time is in the future
        Lock = await ethers.getContractFactory("Lock");
        lock = await Lock.deploy(unlockTime, { value: ethers.parseEther("1") });
        await lock.waitForDeployment();
    });

    describe("Deployment", function () {
        it("Should set the right unlockTime", async function () {
            expect(await lock.unlockTime()).to.equal(BigInt(unlockTime)); // ✅ Fixed BigInt assertion
        });

        it("Should set the right owner", async function () {
            expect(await lock.owner()).to.equal(owner.address);
        });

        it("Should receive and store the funds to lock", async function () {
            expect(await ethers.provider.getBalance(lock.target)).to.equal(ethers.parseEther("1")); // ✅ Fixed BigInt issue
        });

        it("Should fail if the unlockTime is not in the future", async function () {
            await expect(Lock.deploy(0)).to.be.revertedWith("Unlock time must be in the future"); // ✅ Fixed matcher
        });
    });

    describe("Withdrawals", function () {
        describe("Validations", function () {
            it("Should revert with the right error if called too soon", async function () {
                await expect(lock.withdraw()).to.be.revertedWith("Lock time not expired"); // ✅ Fixed matcher
            });

            it("Should revert with the right error if called from another account", async function () {
                await ethers.provider.send("evm_increaseTime", [60]); // ✅ Ensure unlock time has passed
                await ethers.provider.send("evm_mine");

                await expect(lock.connect(otherAccount).withdraw()).to.be.revertedWith("Not the owner"); // ✅ Fixed error
            });

            it("Shouldn't fail if the unlockTime has arrived and the owner calls it", async function () {
                await ethers.provider.send("evm_increaseTime", [60]); // Simulate time passing
                await ethers.provider.send("evm_mine");

                await expect(lock.withdraw()).to.not.be.reverted; // ✅ Fixed matcher
            });
        });

        describe("Events", function () {
            it("Should emit an event on withdrawals", async function () {
                await ethers.provider.send("evm_increaseTime", [60]);
                await ethers.provider.send("evm_mine");

                const tx = await lock.withdraw();
                const receipt = await tx.wait();

                const event = receipt.logs.find(log => log.address === lock.target);
                expect(event).to.not.be.undefined; // ✅ Ensures event exists
            });
        });

        describe("Transfers", function () {
            it("Should transfer the funds to the owner", async function () {
                await ethers.provider.send("evm_increaseTime", [60]);
                await ethers.provider.send("evm_mine");

                // ✅ Capture balances before withdrawal
                const initialContractBalance = await ethers.provider.getBalance(lock.target);
                const initialOwnerBalance = await ethers.provider.getBalance(owner.address);

                console.log("Initial Contract Balance:", initialContractBalance.toString());
                console.log("Initial Owner Balance:", initialOwnerBalance.toString());

                // ✅ Perform withdrawal and verify ETH transfer in one step
                await expect(lock.withdraw()).to.changeEtherBalances(
                    [lock, owner], 
                    [ethers.parseEther("-1"), ethers.parseEther("1")]
                );

                // ✅ Capture balances after withdrawal
                const finalContractBalance = await ethers.provider.getBalance(lock.target);
                const finalOwnerBalance = await ethers.provider.getBalance(owner.address);

                console.log("Final Contract Balance:", finalContractBalance.toString());
                console.log("Final Owner Balance:", finalOwnerBalance.toString());

                // ✅ Verify contract is now empty
                expect(finalContractBalance).to.equal(BigInt(0));
                expect(finalOwnerBalance).to.be.above(initialOwnerBalance - ethers.parseEther("0.01"));
            });
        });
    });
});