// SPDX-License-Identifier: GPL-3.0-or-later
import "./Issuer.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "./ERC1888/IERC1888.sol";
import "./Registry.sol";
pragma solidity ^0.8.4;
contract Report{


    
struct data{

uint256 id;

uint256 energy;
uint256 period;


}

 


data[] public obj;

function recperm(uint256 _id,uint256 _energy,uint256 _period) public{
    Issuer test=new Issuer();


obj.push(data(_id,_energy,_period));


test.initialize(2,0xE5f2A565Ee0Aa9836B4c80a07C8b32aAd7978e22);
    
    for(uint256 i=0;i<_energy;i++){
test.issue(msg.sender,2,"0x000000000000000000000000000000000000000000000000000000000000000c");}
    

}



}