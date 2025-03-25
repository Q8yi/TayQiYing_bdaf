require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

const { PRIVATE_KEY, ALICE_KEY, BOB_KEY } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.28",
    settings: {
      evmVersion: "cancun",
    },
  },
  sourcify: {
    enabled: true,
    apiUrl: 'https://sourcify.dev/server',
    browserUrl: 'https://repo.sourcify.dev',
  },
  networks:{
    zircuit: {
      url: `https://zircuit-mainnet.drpc.org`,
      accounts: [`0x${PRIVATE_KEY}`, `0x${ALICE_KEY}`, `0x${BOB_KEY}`]
    }
  }
};
