pragma solidity >=0.4.21 <0.7.0;

interface ERC1888 /*is ERC1155*/ {

   event IssuanceSingle(     //MUST be triggered when the certificate was successfully created.
    address indexed _issuer, // msg.sender
    int256 indexed _topic,
    uint256 _id,
    uint256 _value
    );

    event ClaimSingle(            //MUST be emitted when certificates are claimed.
    address indexed _claimIssuer, //previous owner of the certificate (_from address in safeTransferAndClaimFrom)
    address indexed _claimSubject,//target owner of the certificate (_to address in safeTransferAndClaimFrom) 
    int256 indexed _topic,
    uint256 _id,
    uint256 _value,
    bytes32 _claimData            //_claimData CAN contain additional data with the format specified by certificate topic
    );
    //note: if _from == _to, one CAN create a self claim, where there SHOULD be no transfer, this results in _claimIssuer == _claimSubject

   event ClaimBatch(address indexed _claimIssuer, address indexed _claimSubject, int256[] indexed _topics, uint256[] _ids, uint256[] _values, bytes32[] _claimData);
   
   function issue(address _to, bytes calldata _validityData, int256 _topic, uint256 _value, bytes calldata _data) external returns (uint256);
   // function batchIssue(bytes[]   _data, uint256[]   _topics, uint256[]   _value, bytes32[]   _signatures) external returns(uint256[]);
   
   function safeTransferAndClaimFrom(address _from, address _to, uint256 _id, uint256 _value, bytes calldata _data, bytes32 _claimData) external;
   function safeBatchTransferAndClaimFrom(address _from, address _to, uint256[] calldata _ids, uint256[] calldata _values, bytes calldata _data, bytes32[] calldata _claimData) external;

   function getCertificate(uint256 _id) external view returns (address issuer, int256 topic, bytes memory validityCall, bytes memory data);
   function claimedBalanceOf(address _owner, uint256 _id) external view returns (uint256);
   function claimedBalanceOfBatch(address[] calldata _owners, uint256[] calldata _ids) external view returns (uint256[] memory);
}