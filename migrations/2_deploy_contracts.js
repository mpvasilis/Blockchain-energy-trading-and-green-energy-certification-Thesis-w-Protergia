//const batteryRegistry = artifacts.require("EnergyTrading");
const EnergyTrading = artifacts.require("EnergyTrading");
const PPA = artifacts.require("PPA");

module.exports = function (deployer) {
    /*deployer.deploy(energyBid).then(
        deployedContract => {
            deployer.deploy(PPA);
        }
    )*/
    //deployer.deploy(batteryRegistry);
    deployer.deploy(EnergyTrading);
    deployer.deploy(PPA);
};