// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import "./DistributorWalletUpgradeable.sol";

contract DistributorWalletFactoryUpgradeable is Ownable {
    mapping(address => address) public distributorToWallet;
    mapping(address => address) public wrappedSongToDistributor;

    event DistributorWalletCreated(address indexed distributor, address wallet);
    event WrappedSongReleased(address indexed wrappedSong, address indexed distributor);

    constructor(address initialOwner) Ownable(initialOwner) {
        // Initialization code
    }

    /**
     * @dev Creates a new distributor wallet for the given distributor address.
     * @param distributor The address of the distributor.
     * @return The address of the newly created distributor wallet.
     */
    function createDistributorWallet(address distributor) external onlyOwner returns (address) {
        require(distributorToWallet[distributor] == address(0), "Distributor wallet already exists");
        
        // Deploy the implementation contract
        DistributorWalletUpgradeable implementation = new DistributorWalletUpgradeable();
        
        // Deploy the proxy contract
        ERC1967Proxy proxy = new ERC1967Proxy(
            address(implementation),
            abi.encodeWithSelector(implementation.initialize.selector)
        );
        
        address walletAddress = address(proxy);
        
        distributorToWallet[distributor] = walletAddress;
        
        emit DistributorWalletCreated(distributor, walletAddress);
        
        return walletAddress;
    }

    /**
     * @dev Returns the distributor wallet address for the given distributor.
     * @param distributor The address of the distributor.
     * @return The address of the distributor wallet.
     */
    function getDistributorWallet(address distributor) external view returns (address) {
        return distributorToWallet[distributor];
    }

    /**
     * @dev Returns the distributor address for the given wrapped song.
     * @param wrappedSong The address of the wrapped song.
     * @return The address of the distributor.
     */
    function getWrappedSongDistributor(address wrappedSong) external view returns (address) {
        return wrappedSongToDistributor[wrappedSong];
    }
}