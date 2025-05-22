// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  //deploy lab1 contract
  const hre = require("hardhat");

  const [ owner ] = await hre.ethers.getSigners();
  console.log("Deploying with account:", owner.address);
  //do lab1
  const Token = await hre.ethers.getContractAt("Token", "0x54E73fD8A779A335CDcEc7194a382F1F97bD4BA7");
  const OnsiteW2Lab1Flags = await hre.ethers.getContractAt("OnsiteW2Lab1Flags", "0x4Ee5C4Ab799404Dc474B8509b07C5a2E38F314F6");

  //1 divide by 2 = 0 (means according to contract 0ETH is transferred bacl) , as it is unit
  // so PASS event is emitted, since the original balance and after transfer balance are equal
  const usingContract = await OnsiteW2Lab1Flags.acquireFlag({value : 1});
  console.log(usingContract);
  console.log("acquiring flag with contract", usingContract.hash);

  //const acqFlag = await OnsiteW2Lab1Flags.acquireFlag({value : 1});
  //console.log("acquiring flag", acqFlag.hash);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });