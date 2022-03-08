// //const batteryRegistry = artifacts.require("EnergyTrading");
// const EnergyTrading = artifacts.require("EnergyTrading");
// const PPA = artifacts.require("PPA");

// module.exports = async function (deployer, network, accounts) {
//     await deployer.deploy(EnergyTrading,{from: accounts[0]});
//     await deployer.deploy(PPA);
// };

var Registry = artifacts.require("Registry");
var Issuer = artifacts.require("Issuer");
// var PrivateIssuer = artifacts.require("PrivateIssuer");

module.exports =  function (deployer) {
     deployer.deploy(Issuer);
     deployer.deploy(Registry);
    //  deployer.deploy(PrivateIssuer);

};
