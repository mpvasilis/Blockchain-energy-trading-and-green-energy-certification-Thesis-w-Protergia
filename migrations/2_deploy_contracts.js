//const batteryRegistry = artifacts.require("EnergyTrading");
const EnergyTrading = artifacts.require("EnergyTrading");
const PPA = artifacts.require("PPA");

module.exports = async function (deployer) {
    await deployer.deploy(EnergyTrading);
    await deployer.deploy(PPA);
};