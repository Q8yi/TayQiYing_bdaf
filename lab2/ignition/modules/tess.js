const hre = require("hardhat");

async function main() {

    const ETHamt = hre.ethers.parseEther("0.00000000000001");

    console.log(ETHamt > 0);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });