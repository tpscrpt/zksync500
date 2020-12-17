// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

struct ShortData {
  uint256 amount;
  address to;
  address token;
  address creator;
  string description;
}

contract Short {
  address public owner;

  uint256 public shortCounter;

  mapping(bytes32 => uint256) public shortIds;
  mapping(uint256 => ShortData) shorts;

  modifier onlyCreator(bytes32 _short) {
    require(shorts[shortIds[_short]].creator == msg.sender, "ONLY_CREATOR_CAN_UPDATE");
    _;
  }

  modifier newShort(bytes32 _short) {
    require(shortIds[_short] == 0, "SHORT_ALREADY_EXISTS");
    _;
  }

  function create(
    bytes32 _short,
    uint256 _amount,
    address _to,
    address _token,
    string calldata _description
  ) external newShort(_short) {
    shortCounter ++;
    shortIds[_short] = shortCounter;
    shorts[shortCounter] = ShortData(_amount, _to, _token, msg.sender, _description);
  }

  function update(
    bytes32 _short,
    uint256 _amount,
    address _to,
    address _token,
    string calldata _description
  ) external onlyCreator(_short) {
    shorts[shortIds[_short]] = ShortData(_amount, _to, _token, msg.sender, _description);
  }

  function changeCreator(
    bytes32 _short,
    address _newCreator
  ) external onlyCreator(_short) {
    shorts[shortIds[_short]].creator = _newCreator;
  }

  function convert(bytes32 _short) external view returns (uint256 amount, address to, address token, string memory description) {
    return (
      shorts[shortIds[_short]].amount,
      shorts[shortIds[_short]].to,
      shorts[shortIds[_short]].token,
      shorts[shortIds[_short]].description
    );
  }
}