require("babel-register");
require("babel-polyfill");

const HDWalletProvider = require("@truffle/hdwallet-provider");
//aspect lamp jacket pet vehicle essence child salad uphold fold nurse judge
//near ethics bitter absorb treat alien ski other exile cluster lonely arrive (Chris R)
const MNEMONIC = 'near ethics bitter absorb treat alien ski other exile cluster lonely arrive';
//get test ether for ropsten from https://moonborrow.com/

module.exports = {
    networks: {
        development: {
            host: "127.0.0.1",
            port: 7545,
            network_id: "*",
            gas: 6721975
        },
        ropsten: {
            //https://ropsten.infura.io/v3/5f552c63b2834a588871339fd81f7943
            //https://ropsten.infura.io/v3/f1cfc83058034e8c85ca5528555181c7 (Chris R)
            provider: function() {
              return new HDWalletProvider(MNEMONIC, "https://ropsten.infura.io/v3/5f552c63b2834a588871339fd81f7943");
            },
            network_id: 3,
            gas: 8000000,
            gasPrice: 5000000000,
            networkCheckTimeout: 10000000,
            confirmations: 2,
            timeoutBlocks: 4000,
            skipDryRun: true
        },
        kovan: {
            networkCheckTimeout: 10000,
            provider: function() {
                return new HDWalletProvider(MNEMONIC, "wss://kovan.infura.io/ws/v3/f1cfc83058034e8c85ca5528555181c7");
            },
            network_id: 42,
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
