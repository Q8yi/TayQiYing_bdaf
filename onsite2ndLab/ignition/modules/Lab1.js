// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  const Token = await hre.ethers.getContractAt("Token", "0x54E73fD8A779A335CDcEc7194a382F1F97bD4BA7");
  const OnsiteW2Lab1Flags = await hre.ethers.getContractAt("OnsiteW2Lab1Flags", "0x4Ee5C4Ab799404Dc474B8509b07C5a2E38F314F6");

  console.log("transfering")
  // lab1 get give token to myself
  const acqFlag = await OnsiteW2Lab1Flags.acquireFlag();
  console.log("acquiring flag", acqFlag.hash);


}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });