pragma solidity >=0.4.21 <0.9.0;

// SPDX-License-Identifier: MIT

interface iRegistry {

    //@notice See {https://www.quicknode.com/guides/solidity/how-to-call-another-smart-contract-from-your-solidity-code}
    function issue(address _to, bytes calldata _validityData, uint256 _topic, uint256 _value, bytes calldata _issuanceData) external returns (uint256);
    function mint(uint256 _id, address _to, uint256 _quantity) external;
    function getCertificate(uint256 _id) external view returns (address issuer, uint256 topic, bytes memory validityCall, bytes memory data);
}