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
    zircuit_garfield_testnet: {
      url: `https://garfield-testnet.zircuit.com/`,
      accounts: [`${PRIVATE_KEY}`],
      //url: `https://zircuit1-testnet.p2pify.com`,
      //accounts: [ZIRCUIT_PRIVATE_KEY]
    }
  }
};