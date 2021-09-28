// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;


//    ________          _             __    __           __       
//   / ____/ /_  ____ _(_)___  ____  / /_  / /___  _____/ /______ 
//  / /   / __ \/ __ `/ / __ \/ __ \/ __ \/ / __ \/ ___/ //_/ __ \
// / /___/ / / / /_/ / / / / / /_/ / /_/ / / /_/ / /__/ ,< / /_/ /
// \____/_/ /_/\__,_/_/_/ /_/\____/_.___/_/\____/\___/_/|_|\____/ 
//
// ERC1888 interface
//
// Vasilis Balafas (me@vasilis.pw)
// Christos Roumeliotis (christosroumeliotis@ieee.org)
// Tasos Garinis (tasosgarinis@gmail.com)

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

interface ERC1888 is IERC1155 {

    struct Certificate {
        uint256 topic;
        address issuer;
        bytes validityData;
        bytes data;
    }

   event IssuanceSingle(address indexed _issuer, uint256 indexed _topic, uint256 _id, uint256 _value);
   event IssuanceBatch(address indexed _issuer, uint256 indexed _topic, uint256[] _ids, uint256[] _values);
   
   event ClaimSingle(address indexed _claimIssuer, address indexed _claimSubject, uint256 indexed _topic, uint256 _id, uint256 _value, bytes _claimData);
   event ClaimBatch(address indexed _claimIssuer, address indexed _claimSubject, uint256[] indexed _topics, uint256[] _ids, uint256[] _values, bytes[] _claimData);
   
   function issue(address _to, bytes calldata _validityData, uint256 _topic, uint256 _value, bytes calldata _issuanceData) external returns (uint256);
   function batchIssue(address _to, bytes memory _issuanceData, uint256 _topic, uint256[] memory _values, bytes[] memory _validityCalls) external returns(uint256[] memory);
   
   function safeTransferAndClaimFrom(address _from, address _to, uint256 _id, uint256 _value, bytes calldata _data, bytes calldata _claimData) external;
   function safeBatchTransferAndClaimFrom(address _from, address _to, uint256[] calldata _ids, uint256[] calldata _values, bytes calldata _data, bytes[] calldata _claimData) external;

   function getCertificate(uint256 _id) external view returns (address issuer, uint256 topic, bytes memory validityCall, bytes memory data);
   function claimedBalanceOf(address _owner, uint256 _id) external view returns (uint256);
   function claimedBalanceOfBatch(address[] calldata _owners, uint256[] calldata _ids) external view returns (uint256[] memory);
}