const hre = require("hardhat");

async function main() {
  const [ owner ] = await hre.ethers.getSigners();
  console.log("Deploying with account:", owner.address);

  const Lab2 = await hre.ethers.getContractFactory("Lab2");

  const lab2 = await Lab2.deploy("0x19839DfeCA322bb9Ea042bb2154fe3C77c93E857", "0xac9a1d6E3452D55dc42aBB8AE3ACEAd98C089FAc", "0x0CB70e82cDA48ac413d15dDb5782130F57ef8844");

  await lab2.waitForDeployment();

  const lab2DeployedAddress = await lab2.getAddress();

  console.log("Lab2 deployed to:", lab2DeployedAddress);

  const Lab2_output = await hre.ethers.getContractAt("Lab2", lab2DeployedAddress);
  const loaning = await Lab2_output.callLoan();
  console.log("loaning", loaning.hash);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
