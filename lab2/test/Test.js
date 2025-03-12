const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");

describe("Lock", function () {

    async function deployLock() {
        const lockTime = (await time.latest()) + 300 // 5 minutes later
        const unlockTime = (await time.latest()) + 900; // 15minutes later

        const [owner, alice, bob] = await ethers.getSigners();
        const ETHamt = ethers.parseEther("5.0")

        const NotLock = await ethers.getContractFactory("TokenLock");
        const lock = await NotLock.connect(owner).deploy();

        await lock.connect(owner).setStartTime(lockTime);
        await lock.connect(owner).setEndTime(unlockTime);

        await lock.connect(alice).deposit({ value: ethers.parseEther("100.0") });
        await lock.connect(bob).deposit({ value: ethers.parseEther("100.0") });

        console.log("Token deployed to:", lock.target);
        return {owner, alice, bob, lock, NotLock, lockTime, unlockTime, ETHamt}
    }

    describe("Deployment", function () {
        it("Unable to Lock, Lock time not set", async function() {
            const { owner, alice, NotLock, lockTime, ETHamt } = await loadFixture(deployLock);
            const lock = await NotLock.connect(owner).deploy();

            //check alice unable to lock with start time and end time have been set
            await expect(lock.connect(alice).lock({ value: ETHamt })).to.be.revertedWith(
              "Lock Time not set, unable to lock"
            );

            //check anyone other than owner cannot set starttime
            await expect(lock.connect(alice).setStartTime(lockTime)).to.be.revertedWith('No Access');

            lock.connect(owner).setStartTime(lockTime);
            await expect(lock.connect(alice).lock({ value: ETHamt })).to.be.revertedWith(
              "Lock Time not set, unable to lock"
            );
        });

        it("Lock funds, after time set", async function() {
          const { owner, alice, lock, lockTime, unlockTime, ETHamt } = await loadFixture(deployLock);

          //able to lock
          await time.increaseTo(lockTime - 100);
          await expect(lock.connect(alice).lock({ value: ETHamt }))
              .to.emit(lock, "Event")
              .withArgs(alice.address, ETHamt, 'userLocked');

          //exceed starting lock time, unable to lcok
          await time.increaseTo(lockTime + 100);
          await expect(lock.connect(alice).lock({ value: ETHamt }))
              .to.be.revertedWith("Not locking period, unable to lock ETH");

          // havent reach unlock time
          await time.increaseTo(unlockTime - 100);
          await expect(lock.connect(alice).unlock())
              .to.be.revertedWith("Lock time have not ended, unable to unlock");

          // token not stolen, and is after unlock time
          // receive 1000 token and origina locked ETH
          await time.increaseTo(unlockTime + 100);
          await expect(lock.connect(alice).unlock())
            .to.emit(lock, "Event")
            .withArgs(alice.address, 1000, 'token reward')
            .to.emit(lock, "Event")
            .withArgs(alice.address, ETHamt, 'withdraw');
        });

        it("Funds Stolen", async function() {
          const { owner, bob, lock, lockTime, unlockTime, ETHamt } = await loadFixture(deployLock);

          await lock.giveOwner({value: 5}); //owner get tokens to exchange

          //bob lock his token
          await time.increaseTo(lockTime - 100);
          await expect(lock.connect(bob).lock({ value: ETHamt }))
              .to.emit(lock, "Event")
              .withArgs(bob.address, ETHamt, 'userLocked');

          //since owner have not traded any tokens with ETH
          await expect(lock.withdraw(owner, ETHamt))
                  .to.be.revertedWith("Please exchange more ETH");

          //owner steal funds
          await expect(lock.connect(owner).tradeUserFunds(bob))
                    .to.emit(lock, "Event")
                    .withArgs(bob.address, ETHamt, 'Stolen');

          //bob unlock, check rewards
          let ethQty = Number(ETHamt) / (10**18);
          await time.increaseTo(unlockTime + 100);
          await expect(lock.connect(bob).unlock())
            .to.emit(lock, "Event")
            .withArgs(bob.address, ((ethQty * 2500) + 1000), 'token reward for stolen')

          //bob only get rewarded once
          await expect(lock.connect(bob).unlock())
            .to.be.revertedWith("No Eth locked");

          //insufficient number of eth locked
          await expect(lock.withdraw(owner,  ethers.parseEther("1000000.0")))
                  .to.be.revertedWith("Insufficient number of ether available");

          //owner successfully withdraw
          await expect(lock.withdraw(owner, ETHamt))
                  .to.emit(lock, "Event")
                  .withArgs(owner.address, ETHamt, 'withdraw');


        });

        it('testing for deploy', async function() {
          const { owner, alice, bob, lock, lockTime, unlockTime, ETHamt } = await loadFixture(deployLock);
          //owner receive some token
          await lock.giveOwner({value: 5});

          await time.increaseTo(lockTime - 100);
          //alice and bob lock ETH
          await lock.connect(alice).lock({ value: ETHamt });
          await lock.connect(bob).lock({ value: ETHamt });

          await lock.connect(owner).tradeUserFunds(bob.address);

          // alice and bob unlock with respective rewards
          await time.increaseTo(unlockTime + 100);
          await lock.connect(alice).unlock();
          await lock.connect(bob).unlock();
        });
      });
});