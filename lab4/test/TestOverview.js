const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("VaultForOverview", function () {
  async function deployVault() {
    // Contracts are deployed using the first signer/account by default
    const [owner, alice, bob, carol, entity] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("QyToken");
    const Vault = await ethers.getContractFactory("Vault");
    const token = await Token.deploy();
    await token.waitForDeployment();

    const deployedTokenAddress = await token.getAddress();
    await token.getTokens(alice, 100);
    await token.getTokens(bob, 100);
    await token.getTokens(carol, 100);
    await token.getTokens(entity, 100);

    console.log("deployed to:", deployedTokenAddress);
    const vault = await Vault.connect(owner).deploy(deployedTokenAddress);
    await vault.waitForDeployment();
    const deployedVaultAddress = await vault.getAddress();
    console.log("vault deployed to:", deployedVaultAddress);

    //approve contract to make transactions on behalf
    await token.connect(alice).approve(deployedVaultAddress, 500);
    await token.connect(bob).approve(deployedVaultAddress, 500);
    await token.connect(carol).approve(deployedVaultAddress, 500);
    await token.connect(entity).approve(deployedVaultAddress, 500);
    await token.connect(owner).approve(deployedVaultAddress, 500);

    return { deployedTokenAddress, vault, owner, alice, bob, carol, entity };
  }

  describe("Overview", function () {
    it("it should pass all", async function () {
      const { vault, alice, bob, carol, entity } = await loadFixture(deployVault);

      await expect(vault.connect(alice).deposit(100))
      .to.emit(vault, "Event")
      .withArgs(alice.address, "sharesPrice", 100, 100)

      await expect(vault.connect(bob).deposit(100))
      .to.emit(vault, "Event")
      .withArgs(bob.address, "sharesPrice", 200, 200)

      await expect(vault.connect(entity).donates(100))
      .to.emit(vault, "Event")
      .withArgs(entity.address, "sharesPrice", 300 , 200)

      await expect(vault.connect(alice).withdraw(100))
      .to.emit(vault, "Event")
      .withArgs(alice.address, "sharesPrice", 150 , 100)

      await expect(vault.connect(bob).withdraw(50))
      .to.emit(vault, "Event")
      .withArgs(bob.address, "sharesPrice", 75 , 50)

      await expect(vault.connect(carol).deposit(75))
      .to.emit(vault, "Event")
      .withArgs(carol.address, "sharesPrice", 150 , 100)
    });
  });
});
