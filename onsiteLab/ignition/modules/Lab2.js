// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  const Token = await hre.ethers.getContractAt("Token", "0x0CB70e82cDA48ac413d15dDb5782130F57ef8844");
  const No2Flashloan = await hre.ethers.getContractAt("No2Flashloan", "0x19839DfeCA322bb9Ea042bb2154fe3C77c93E857");
  const No2WhaleOnlyBadge = await hre.ethers.getContractAt("No2WhaleOnlyBadge ", "0xac9a1d6E3452D55dc42aBB8AE3ACEAd98C089FAc");

  console.log("transfering")
  // lab1 get give token to myself
  const transferring = await qytoken.getTokens(deployer, "2000000000000000000000");
  console.log("transferred", transferring.hash);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });