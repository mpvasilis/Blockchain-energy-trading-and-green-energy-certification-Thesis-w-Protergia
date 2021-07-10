//const energyBid = artifacts.require("src/contracts/Battery.sol");
const PPA = artifacts.require("src/contracts/PPA.sol");

module.exports = function (deployer) {
    /*deployer.deploy(energyBid).then(
        deployedContract => {
            deployer.deploy(PPA);
        }
    )*/
    deployer.deploy(PPA);
	//deployer.deploy(energyBid);
};
