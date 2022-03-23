require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
 var HDWalletProvider = require("@truffle/hdwallet-provider");

 const MNEMONIC = 'science daring strong special fun castle unknown oppose absurd tackle unable image';
const privateKey1='a4546a0b830d530078299a5a4301c73b770c53ffb199a64422dc076778de807c'


module.exports = {
  networks: {
    hardhat: {
    },
    optimistic: {
      url: "https://optimism-kovan.infura.io/v3/6fd11602474b42b887160ec398d36f3d",
      accounts: [privateKey1]
    }
  },

  solidity: "0.8.4",



};
