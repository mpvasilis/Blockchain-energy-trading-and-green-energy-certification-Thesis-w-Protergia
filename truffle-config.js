require("babel-register");
require("babel-polyfill");

const HDWalletProvider = require("@truffle/hdwallet-provider");

const MNEMONIC = 'aspect lamp jacket pet vehicle essence child salad uphold fold nurse judge';

module.exports = {
    networks: {
        development: {
            host: "127.0.0.1",
            port: 8545,
            network_id: "*", 
        },
        ropsten: {
            provider: function() {
              return new HDWalletProvider(MNEMONIC, "https://ropsten.infura.io/v3/5f552c63b2834a588871339fd81f7943")
            },
            network_id: 3,
            gas: 4000000
          }
    },
    contracts_directory: "./src/contracts/",
    contracts_build_directory: "./src/abis/",
    compilers: {
        solc: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
};
