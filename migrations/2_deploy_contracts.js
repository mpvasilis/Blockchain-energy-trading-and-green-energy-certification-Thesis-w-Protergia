const energyBid = artifacts.require("./Battery.sol");
const PPA = artifacts.require("./PPA.sol");

module.exports = function (deployer) {
    //const battID = msg.sender;
    await deployer.deploy(PPA);
	await deployer.deploy(energyBid);
};
