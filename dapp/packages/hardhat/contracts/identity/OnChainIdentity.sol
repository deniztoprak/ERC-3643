// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.17;

import "@onchain-id/solidity/contracts/Identity.sol";

contract OnChainIdentity is Identity {
    constructor(address initialManagementKey, bool _isLibrary) Identity(initialManagementKey, _isLibrary) {}
}
