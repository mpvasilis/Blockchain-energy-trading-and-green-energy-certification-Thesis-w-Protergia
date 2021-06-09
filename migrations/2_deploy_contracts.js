const energyBid = artifacts.require("./Battery.sol");
//const batteryRegistry = artifacts.require("Battery");

module.exports = function (deployer) {
    //const battID = msg.sender;
    //deployer.deploy(batteryRegistry);
	deployer.deploy(energyBid);
};
