const hre = require("hardhat");

async function main() {
    const [owner, alice, bob] = await hre.ethers.getSigners();

    const lock = await hre.ethers.getContractAt("TokenLock", "0x8B5DE1766C9Ed7f742BcAEdfDCda7E423E3E8107", owner);

    console.log("trading user funds");
    const ownerTraded = await lock.connect(owner).tradeUserFunds(bob.address);
    console.log("ownerTraded Trx hash:", ownerTraded.hash);

    // bob unlock with respective rewards
    console.log("unlocking");
    const bobUnlocked = await lock.connect(bob).unlock();
    console.log("bobUnlocked Trx hash:", bobUnlocked.hash);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });