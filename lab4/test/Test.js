const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("Vault", function () {
  async function deployVault() {
    // Contracts are deployed using the first signer/account by default
    const [owner, user1, user2] = await ethers.getSigners();

    //get contract and deploy
    const Token = await ethers.getContractFactory("QyToken");
    const Vault = await ethers.getContractFactory("Vault");
    const token = await Token.deploy();
    await token.waitForDeployment();

    const deployedTokenAddress = await token.getAddress();
    //give tokens to users
    await token.getTokens(user1, 1000000);
    await token.getTokens(user2, 1000000);

    console.log("deployed to:", deployedTokenAddress);
    const vault = await Vault.connect(owner).deploy(deployedTokenAddress);
    await vault.waitForDeployment();
    const deployedVaultAddress = await vault.getAddress();
    console.log("vault deployed to:", deployedVaultAddress);

    //approve contract to make transactions on behalf
    await token.connect(user1).approve(deployedVaultAddress, 1000000);
    await token.connect(user2).approve(deployedVaultAddress, 1000000);
    await token.connect(owner).approve(deployedVaultAddress, 1000000);

    return { deployedTokenAddress, vault, owner, user1, user2};
  }

  describe("Donate", function () {
    it("it should donate accurately", async function () {
      const { vault, user1, user2 } = await loadFixture(deployVault);

      await expect(vault.connect(user1).deposit(5))
      .to.emit(vault, "Event")
      .withArgs(user1.address, "sharesPrice", 5, 5)

      await expect(vault.connect(user2).deposit(5))
      .to.emit(vault, "Event")
      .withArgs(user2.address, "sharesPrice", 10, 10)
    });
  });
  describe("Withdrawal", function () {
    it("Should withdraw accurately", async function () {
      const { vault, user1, user2, } = await loadFixture(deployVault);
      await vault.connect(user1).deposit(5);
      await vault.connect(user2).deposit(5);
      // attempt to withdraw more than what the user have
      await expect(vault.connect(user1).withdraw(10))
            .to.be.revertedWith('Not enough shares');
      // withdraw
      await expect(vault.connect(user1).withdraw(1)) //withdraw 1 shares
      .to.emit(vault, "Event")
      .withArgs(user1.address, "sharesPrice", 9, 9)
    });
  });

  describe("Takefee", function () {
    it("Should allow only owner to take fee", async function () {
      const { vault, owner, user1, user2} = await loadFixture(deployVault);

      await vault.connect(user1).deposit(5);
      await vault.connect(user2).deposit(5);

      await expect(vault.connect(user1).takeFeeAsOwner(10)).to.be.revertedWith("you are not the owner");
      await expect(vault.connect(owner).takeFeeAsOwner(11)).to.be.revertedWith("not enough amt");

      await expect(vault.connect(owner).takeFeeAsOwner(5))
        .to.emit(vault, "Event")
        .withArgs(owner, "sharesPrice", 5, 10) // owner withdraw 5, vault left 5 USDC, but has 10 shares
    });
  });
  describe("securityRisk", function () {
    it("owner stole all the vault funds", async function () {
      const { vault, owner, user1, user2} = await loadFixture(deployVault);

      await vault.connect(user1).deposit(500);
      await vault.connect(user2).deposit(500);

      await expect(vault.connect(owner).takeFeeAsOwner(1000))
        .to.emit(vault, "Event")
        .withArgs(owner, "sharesPrice", 0, 1000)
    });
  });
});
