# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.js
```

```shell
this folder represent different attacks on provided contracts in response to
https://github.com/bdaf-course/bdaf-coursepage/blob/main/slides/OnsiteLab.md

To get scores
npx hardhat run ignition\modules\getScores.js --network zircuit_garfield_testnet

Lab 1
1) Deploying token for attack
npx hardhat run ignition\modules\Deploy.js --network zircuit_garfield_testnet
- verify (npx hardhat verify --network zircuit_garfield_testnet <token address>)

2) then call npx hardhat run ignition\modules\Lab1.js --network zircuit_garfield_testnet
- to run the attacks

Lab 2

1) Deploying contract to override executeOperation function in IFlashLoanReceiver
npx hardhat run ignition\modules\Lab2.js --network zircuit_garfield_testnet

Lab 3

1) Deploying contract to override mocking function in IMock
npx hardhat run ignition\modules\Lab3.js --network zircuit_garfield_testnet


```