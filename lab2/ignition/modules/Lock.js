const hre = require("hardhat");

async function main() {
    const [owner, alice, bob] = await hre.ethers.getSigners();
    console.log(owner);

    const lock = await hre.ethers.getContractAt("TokenLock", "0x8B5DE1766C9Ed7f742BcAEdfDCda7E423E3E8107", owner);

    const t = await hre.ethers.provider.getBlock("latest");
    const timeStamp = t.timestamp;
    console.log(timeStamp);

    const lockTime = timeStamp + 300 // 5 minutes later
    const unlockTime =  timeStamp + 600; // 10 minutes later
    console.log(lockTime);

    const locked = await lock.connect(owner).setStartTime(lockTime);
    const unlocked = await lock.connect(owner).setEndTime(unlockTime);

    console.log("setStartTime Trx hash:", locked.hash);
    console.log("setEndTime Trx hash:", unlocked.hash);

    const ETHamt = hre.ethers.parseEther("0.00000000000001");

    //owner receive some token
    //await lock.connect(owner).giveOwner({value: 5});
    //alice and bob lock ETH
    console.log("processing deposit");
    const aliceDepo = await lock.connect(alice).deposit({ value: ETHamt });
    const bobDepo = await lock.connect(bob).deposit({ value: ETHamt });
    console.log("aliceLocked Trx hash:", aliceDepo.hash);
    console.log("bobLocked Trx hash:", bobDepo.hash);

    console.log("processing lock");
    const aliceLocked = await lock.connect(alice).lock({ value: ETHamt });
    const bobLocked = await lock.connect(bob).lock({ value: ETHamt });

    console.log("aliceLocked Trx hash:", aliceLocked.hash);
    console.log("bobLocked Trx hash:", bobLocked.hash);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });