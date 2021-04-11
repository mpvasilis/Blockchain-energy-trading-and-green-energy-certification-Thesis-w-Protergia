const Battery = artifacts.require("Battery");

module.exports = function (deployer) {
  deployer.deploy(Battery);
};