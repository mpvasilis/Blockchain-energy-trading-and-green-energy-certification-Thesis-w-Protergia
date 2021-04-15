const Battery = artifacts.require("Battery");

module.exports = function (deployer) {
    var batteryId = "who";
    var batteryData = 12345;
  deployer.deploy(batteryId, batteryData, {value: 100, from: accounts[0]})
};