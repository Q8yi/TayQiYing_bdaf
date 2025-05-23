const hre = require("hardhat");

async function main() {
  const [ owner ] = await hre.ethers.getSigners();
  console.log("Deploying with account:", owner.address);

  const Lab3 = await hre.ethers.getContractFactory("Lab3");

  const lab3 = await Lab3.deploy(owner, "0x76C44B7Fa2f091d9465032dC5B8F111Dcf6ECf46");//0xC0b4f10e6b91B10d77CC80a34d457663f632431D

  await lab3.waitForDeployment();

  const lab3DeployedAddress = await lab3.getAddress();

  console.log("Lab3 deployed to:", lab3DeployedAddress);

  const Lab3Product = await hre.ethers.getContractAt("Lab3", lab3DeployedAddress);

  const proxyCall = await Lab3Product.callProxy(); //override mocking function
  console.log("proxy call", proxyCall.hash);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
