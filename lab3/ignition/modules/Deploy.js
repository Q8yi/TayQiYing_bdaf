const hre = require("hardhat");

async function main() {
    const [owner, alice, bob] = await hre.ethers.getSigners();

    console.log("Deploying contract");

    const Factory = await hre.ethers.getContractFactory("FactoryContract");

    console.log("awaitin");

    const factory = await Factory.deploy();

    await factory.waitForDeployment();

    const deployedAddress = await factory.getAddress();

    console.log("deployed to:", deployedAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });