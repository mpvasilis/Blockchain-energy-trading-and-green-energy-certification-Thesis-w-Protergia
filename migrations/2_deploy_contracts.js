const Battery = artifacts.require("./Battery.sol");
const EnergyBid = artifacts.require("./EnergyBid.sol");
const Owned = artifacts.require("./Owned.sol");

module.exports = (deployer) => {
	deployer.deploy(Battery,'0xdcB1e30Af1233B6A42C51D6C9EAdEedD01F894ea', 'chris', 123);
    deployer.deploy(EnergyBid, 20202020, 125, 1500, 12388888);
    deployer.deploy(Owned);
};