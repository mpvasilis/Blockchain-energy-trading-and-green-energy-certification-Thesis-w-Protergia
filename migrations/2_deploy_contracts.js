const Battery = artifacts.require("Battery");

module.exports = function (deployer) {
    var batteryId = 0x8c17bc83f96ccCaF34Edd84868C75bfb53CABd03;
    var date = 12345;
    var nameOfBatteryOwner = "chris"
  deployer.deploy(batteryId, nameOfBatteryOwner, date);
};

/*let batteryRegistry = artifacts.require("./Battery.sol");
let energyBid = artifacts.require("./Battery.sol");

module.exports = (deployer) => {
	deployer.deploy(batteryRegistry('0x5c094FAec7524cB442386d657828c16EdB63443f', "chris", 123));
    deployer.deploy(energyBid(20052020, 130, 1000000, 1618653420));
};*/