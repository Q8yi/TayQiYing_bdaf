# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Deploy.js
```

About the contracts
```shell
QyToken inherits from ERC20
- initialised with a total supply of 100,000,000

TokenLock.sol
- represents different functions to lock and unlock ETH
- including different payable functions for withdrawal, deposits and transfers (with .call )

ignition/modules
- npx hardhat run in the following order:
1) Deploy.js
2) Lock.js
Please wait 10 minutes after running Lock.js
3) AliceUnlock.js
4) BobUnlock.js

```
