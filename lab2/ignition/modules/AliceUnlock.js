const hre = require("hardhat");

async function main() {
    const [owner, alice, bob] = await hre.ethers.getSigners();

    const lock = await hre.ethers.getContractAt("TokenLock", "0x8B5DE1766C9Ed7f742BcAEdfDCda7E423E3E8107", owner);

    // alice unlock with respective rewards
    console.log("unlocking");
    const aliceUnlocked = await lock.connect(alice).unlock();

    console.log("aliceUnlocked Trx hash:", aliceUnlocked.hash);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });