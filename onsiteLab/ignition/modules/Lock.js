// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const hre = require("hardhat");

async function main() {
  const [deployer, alice, bob] = await ethers.getSigners();

  const OnSiteChecker = await hre.ethers.getContractAt("OnSiteChecker", "0x53040a293297fA879329f418E6A28E816832A867");
  const No1SuperSafe = await hre.ethers.getContractAt("No1SuperSafe", "0x7b10eFb166EFBD0edDB8800f73fc631148eA1722");
  const token = await hre.ethers.getContractAt("Token", "0x0CB70e82cDA48ac413d15dDb5782130F57ef8844");
  const whaleBadge = await hre.ethers.getContractAt("No2WhaleOnlyBadge", "0xac9a1d6E3452D55dc42aBB8AE3ACEAd98C089FAc");
  const flashLoan = await hre.ethers.getContractAt("No2Flashloan", "0x19839DfeCA322bb9Ea042bb2154fe3C77c93E857")
  // lab1 get No1SuperSafe token
  await No1SuperSafe.connect(deployer).deposit("0x0CB70e82cDA48ac413d15dDb5782130F57ef8844", 1_000e18 + 1);

  console.log(OnSiteChecker.connect(deployer).updateScores());

  //lab2
  await whaleBadge.connect(deployer).obtainProofOfWhale(1);

  console.log(OnSiteChecker.connect(deployer).updateScores());

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });