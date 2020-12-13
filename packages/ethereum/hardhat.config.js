require("@nomiclabs/hardhat-waffle");
require("hardhat-typechain");
require("dotenv/config");

const { PRIVATE_KEY, INFURA_PROJECT_ID } = process.env;

if (!PRIVATE_KEY) throw "Missing PRIVATE_KEY";

module.exports = {
  solidity: "0.7.3",
  networks: {
    hardhat: {},
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${INFURA_PROJECT_ID}`,
      accounts: [PRIVATE_KEY],
    },
    ropsten: {
      url: `https://ropsten.infura.io/v3/${INFURA_PROJECT_ID}`,
      accounts: [PRIVATE_KEY],
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
      accounts: [PRIVATE_KEY],
    },
  },
};
