//const batteryRegistry = artifacts.require("EnergyTrading");
const EnergyTrading = artifacts.require("EnergyTrading");

module.exports = function (deployer) {
    deployer.deploy(EnergyTrading);
};