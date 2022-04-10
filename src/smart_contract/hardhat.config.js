require("@nomiclabs/hardhat-waffle");
require('dotenv').config()

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// Change this when deploying to different networks
const defaultNetwork = "skaleTestnet";

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork,
  networks: {
    localhost: {
      url: "http://localhost:8545",
      /*
        notice no mnemonic here? it will just use account 0 of the hardhat node to deploy
        (you can put in a mnemonic here to set the deployer locally)
      */
    },
    skaleMainnet: {
      url: "https://testnet-proxy.skalenodes.com/v1/fancy-rasalhague",
      accounts: [process.env.ADMIN_PKEY_TESTNET]
    },
    skaleTestnet: {
      url: "https://testnet-proxy.skalenodes.com/v1/fancy-rasalhague",
      accounts: [process.env.MM_PKEY_TESTNET]
    },
    skaleTestnet2: {
      url: "https://testnet-proxy.skalenodes.com/v1/whispering-turais",
      accounts: [process.env.ADMIN_PKEY_WHISPER]
    },
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
      accounts: [process.env.MM_PKEY_TESTNET]
    },
  },
  solidity: {
    compilers: [

      { version: "0.6.12" },
      { version: "0.5.17" },
      {
        version: "0.7.0",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
        
      },
      { version: "0.8.4" },
      { version: "0.8.10" },
      { version: "0.8.0" }
    ],
  }
};
