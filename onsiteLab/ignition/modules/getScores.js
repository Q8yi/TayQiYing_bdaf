// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  const OnSiteChecker = await hre.ethers.getContractAt("OnSiteChecker", "0xE29131e292C3c6Eb85068d3d8E5fDEAb23E3981d"); //0x53040a293297fA879329f418E6A28E816832A867
  // update and check scores
  const checkScore = await OnSiteChecker.connect(deployer).updateScores();
  console.log("checking score hash", checkScore.hash);

  const scoring = await OnSiteChecker.scores(deployer);
  console.log("new score", scoring);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });