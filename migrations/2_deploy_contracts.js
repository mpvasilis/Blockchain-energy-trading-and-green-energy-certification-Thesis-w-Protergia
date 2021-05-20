const energyBid = artifacts.require("Battery");
const batteryRegistry = artifacts.require("Battery");

module.exports = function (deployer) {
    //const battID = msg.sender;
    deployer.deploy(batteryRegistry, "chris", 123);
	deployer.deploy(energyBid, 20052020, 130, 1000000, 1618653420);
};
