const hre = require("hardhat");

async function deploy(contractName, owner) {
    const Token = await hre.ethers.getContractFactory(contractName);

    const token = await Token.connect(owner).deploy();

    await token.waitForDeployment();

    const tokenDeployedAddress = await token.getAddress();

    console.log("Token deployed to:", tokenDeployedAddress);

    return tokenDeployedAddress
}

async function main() {
  const [ owner ] = await hre.ethers.getSigners();
  console.log("Deploying with account:", owner.address);

  const Token = await hre.ethers.getContractFactory("QyToken");

  const token = await Token.connect(owner).deploy();

  await token.waitForDeployment();

  const tokenDeployedAddress = await token.getAddress();

  console.log("Token deployed to:", tokenDeployedAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
