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




const defaultNetwork = "skale";// or skaleW
 

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
      accounts: [process.env.ADMIN_PKEY_FANCY],
    },
    skale: {
      url: "https://testnet-proxy.skalenodes.com/v1/fancy-rasalhague",
      accounts: [process.env.ADMIN_PKEY_FANCY],
    },
    skaleW: {
      url: "https://testnet-proxy.skalenodes.com/v1/whispering-turais",
      accounts: [process.env.ADMIN_PKEY_WHISPER],
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
