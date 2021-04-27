const energyBid = artifacts.require('./Battery.sol')

contract('energyBid', function() {
    const batteryId = "0xfB49f3d7c2629Bf556F233647eE74578FB77d208";
    const nameOfbatteryowner = "chris";
    const datebatteryadded = 12345;
    const dayofenergybid = 5757575;
    const priceOfenergy = 123455;
    const energyOffer = 1000000;
    const unixTimestamp = 12234567;

    beforeEach(async function () {
        //deploy batteryRegistry contract
        addBattery = await addNewBattery.new(batteryId, nameOfbatteryowner, datebatteryadded);
        batteryAddress = addBattery.address;
        batteryContract = await addNewBattery.at(batteryAddress);

        //deploy energybid contract
        addEnergyOffer = await energyOffer.new(batteryId, dayofenergybid, priceOfenergy, energyOffer, unixTimestamp);
        energyBidAddress = addEnergyOffer.address;
        energyBidContract = await energyOffer.at(energyBidAddress);
    });
})