const hre = require("hardhat");

async function main() {
  const [owner, alice, bob] = await hre.ethers.getSigners();
  console.log("Deploying with account:", owner.address);

  const Lock = await hre.ethers.getContractFactory("TokenLock");
  const Token = await hre.ethers.getContractFactory("QyToken");

  const lock = await Lock.deploy(owner.getAddress());
  const token = await Token.deploy(lock.getAddress());

  await lock.waitForDeployment();
  await token.waitForDeployment();

  const deployedAddress = await lock.getAddress();
  const tokenDeployedAddress = await token.getAddress();

  console.log("deployed to:", deployedAddress);
  console.log("Token deployed to:", tokenDeployedAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
