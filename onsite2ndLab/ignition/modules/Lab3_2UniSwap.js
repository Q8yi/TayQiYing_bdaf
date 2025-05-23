const hre = require("hardhat");

async function main() {
  const [ owner ] = await hre.ethers.getSigners();
  console.log("Deploying with account:", owner.address);

  const qytoken = await hre.ethers.getContractAt("QyToken", "0x0070C693e98Ba77341485eCa075ea8020a942e1e");
  const qytoken1 = await hre.ethers.getContractAt("QyToken1", "0x8f8352c09147EFd9dD129156f98e0453b85ff4A9");

  //const Swap = await hre.ethers.getContractFactory("UniSwap");

  //const swap = await Swap.connect(owner).deploy("0x0070C693e98Ba77341485eCa075ea8020a942e1e", "0x8f8352c09147EFd9dD129156f98e0453b85ff4A9");

  //await swap.waitForDeployment();

  //const swapDeployedAddress = await swap.getAddress();

  //console.log("swap deployed to:", swapDeployedAddress);

  //const givetoken = await qytoken.getTokens("0x6e889e263b6073F0317A2260904858Cae9Cb05F5", 10000);
  //const givetoken2 = await qytoken1.getTokens("0x6e889e263b6073F0317A2260904858Cae9Cb05F5", 10000);

  //console.log("transfer token to swap:", givetoken.hash);
  //console.log("transfer token1 to swap:", givetoken2.hash);

  const swapObj = await hre.ethers.getContractAt("UniSwap", "0x6e889e263b6073F0317A2260904858Cae9Cb05F5");

  const approval = await qytoken.connect(owner).approve(swapObj, "1000");
  console.log("approval", approval.hash);

  const swapping = await swapObj.swap(100, "0x0070C693e98Ba77341485eCa075ea8020a942e1e");
  console.log("swapping token to token1 hash", swapping.hash);



}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
