const Battery = artifacts.require('Battery')

contract('Battery', accounts => {
    it("battery added", async() => {
        const batteryInstance = await Battery.deployed();
        const res = await batteryInstance.addNewBattery("Chris", 21052021);
        assert.equal(res.receipt.status, true, "battery registry failed");
    });
})