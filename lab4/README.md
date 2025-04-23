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

About the contracts
```shell
QyToken inherits from ERC20
- initialised with a total supply of 100,000,000
- Simulate ERC20 token used in the vault

Vault.sol
- represents the vault that has deposit, withdraw, takeFeeAsOwner are the main functions
- donate function, do not increment totalShares, only increasing contract ERC20 balance
- _updateSharePrice is a helper function to calcualte shareprice after each main function calls
```

Execution Order
```shell
/test
- npx hardhat test in the following order:
1) Test.js
    a) all test except "securityRisk" are testing the basic functions that vault have, ensuring accuracy
    b) while securityRisk test the security risk of takeFeeAsOwner()
        - it shows how owner can withdraw all the funds in the vault with ease, lower the reliability and affecting shareprice of vault
2) TestOverview.js -> simulate scenario written under https://github.com/bdaf-course/bdaf-coursepage.git/lab04 Overview
3) TestAttack.js -> simulate inflation attack

```


