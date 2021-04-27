const energyBid = artifacts.require("Battery");
const batteryRegistry = artifacts.require("Battery");

module.exports = function (deployer) {
    //const battID = msg.sender;
    deployer.deploy(batteryRegistry, "0xfB49f3d7c2629Bf556F233647eE74578FB77d208", "chris", 123);
	deployer.deploy(energyBid, "0xfB49f3d7c2629Bf556F233647eE74578FB77d208", 20052020, 130, 1000000, 1618653420);
};
