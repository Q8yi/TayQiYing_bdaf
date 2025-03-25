const hre = require("hardhat");

async function main() {
    const [owner, alice, bob] = await hre.ethers.getSigners();

    const factory = await hre.ethers.getContractAt("FactoryContract", "0x9889dd6E0ADB7eAcE29A253664c9a21130b08e7E");
    const qyToken = await hre.ethers.getContractAt("QyToken", "0xF3464794a18f7b4aC4D1A2068dDE700215112F18", owner);

    const byteCode = await factory.getContractByteCode();
    const bytecodeHash =  hre.ethers.solidityPackedKeccak256(["bytes"], [byteCode]);

    const salt = hre.ethers.id("salt1");

    const createdAddress = await factory.computeAddress(salt, bytecodeHash, owner);
    console.log("createdAddress:", createdAddress);

    const transferring = await qyToken.getTokens(createdAddress, 10);
    console.log("transferred", transferring.hash);

    //console.log(byteCode);
    const addressDeployed = await factory.deploys(salt, byteCode);
    console.log("transaction hash for addressDeployed:", addressDeployed.hash);

    const computedContract = await hre.ethers.getContractAt("WithdrawTK", createdAddress);

    const bal = await qyToken.balanceOf(createdAddress);
    console.log(bal >= 5);

    const withdrawToken = await computedContract.connect(owner).getTokens(qyToken, 5);
    console.log("transaction hash for withdrawal:", withdrawToken.hash);



}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });