//const { assert } = require("node:console");

const Battery = artifacts.require('./Battery.sol')

contract('Battery', accounts => {
    let batteryId = "who";
    let batteryData = 12345;
    it("add a new battery", () =>{
        const battery = Battery.deployed(batteryId, batteryData)
        .then(function(instance) {
            instance.battery('batt1', 123);
    }).then(() => {
        assert.equal(instance.battery('batt1', 123), true);
    })
})  
})