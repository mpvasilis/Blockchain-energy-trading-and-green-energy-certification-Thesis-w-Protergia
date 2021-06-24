const PPA = artifacts.require('src/contracts/PPA.sol')
const PPAToken = artifacts.require("src/contracts/PPA.sol");
const { default: Web3 } = require("web3");
const { assert } = require("chai");

contract("PPA", async(accounts)=>{
    let token, ppa;

    it("Should add a new PPA", async() => {

    })

    before(async () => {
		token = await PPAToken.new();
		ppa = await PPA.new();
		await token.transfer(ppa.address, tokensAvailable);
	});
})

