import fs from 'fs';
import { artifacts, ethers, network, upgrades } from "hardhat";
import path from 'path';

const abisDirectory = path.join(__dirname, '..', '..', 'app', 'src', 'contracts');
const localAbisDirectory = path.join(__dirname, '..', 'abis');
const networkName = network.name;

// Adjust the path to save each network's contract addresses with the network name
const addressesFile = path.join(abisDirectory, `protocolContractAddresses-${networkName}.json`);
const addressesFile2 = path.join(localAbisDirectory, `protocolContractAddresses-${networkName}.json`);

// Object to hold contract addresses
let contractAddresses: any = {};

// USDC stablecoin address on mainnet
const USDC_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

async function main() {
  const [deployer] = await ethers.getSigners();
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account address:", deployer.address);
  console.log("Account balance:", balance.toString());

  // Ensure the ABIs directories exist
  if (!fs.existsSync(abisDirectory)) {
    fs.mkdirSync(abisDirectory, { recursive: true });
  }
  if (!fs.existsSync(localAbisDirectory)) {
    fs.mkdirSync(localAbisDirectory, { recursive: true });
  }

  /* ////////////////////////////////////////////
  ////////  WhitelistingManager contract  ////////
  //////////////////////////////////////////// */

  console.log("Deploying WhitelistingManager...");
  const WhitelistingManager = await ethers.getContractFactory("WhitelistingManagerUpgradeable");
  const whitelistingManager = await upgrades.deployProxy(WhitelistingManager, [deployer.address], { initializer: 'initialize' });
  await whitelistingManager.waitForDeployment();
  console.log("WhitelistingManager deployed to:", await whitelistingManager.getAddress());
  await saveAbi("WhitelistingManager", await whitelistingManager.getAddress());

  /* ////////////////////////////////////////////
  ////////  DistributorWalletFactory contract  ////////
  //////////////////////////////////////////// */

  console.log("Deploying DistributorWalletFactory...");
  const DistributorWalletFactory = await ethers.getContractFactory("DistributorWalletFactoryUpgradeable");
  const distributorWalletFactory = await DistributorWalletFactory.deploy(deployer.address);
  await distributorWalletFactory.waitForDeployment();
  console.log("DistributorWalletFactory deployed to:", await distributorWalletFactory.getAddress());
  await saveAbi("DistributorWalletFactory", await distributorWalletFactory.getAddress());

  /* ////////////////////////////////////////////
  ////////  ProtocolModule contract  ////////
  //////////////////////////////////////////// */

  console.log("Deploying ProtocolModule...");
  const ProtocolModule = await ethers.getContractFactory("ProtocolModuleUpgradeable");
  const protocolModule = await upgrades.deployProxy(
    ProtocolModule,
    [
      await distributorWalletFactory.getAddress(),
      await whitelistingManager.getAddress()
    ],
    { initializer: 'initialize' }
  );
  await protocolModule.waitForDeployment();
  console.log("ProtocolModule deployed to:", await protocolModule.getAddress());
  await saveAbi("ProtocolModule", await protocolModule.getAddress());

  /* ////////////////////////////////////////////
  ////////  WSTokenManagement contract  ////////
  //////////////////////////////////////////// */

  console.log("Deploying WSTokenManagement...");
  const WSTokenManagement = await ethers.getContractFactory("UpgradableWSTokenManagementUpgradeable");
  const wsTokenManagement = await upgrades.deployProxy(WSTokenManagement, [
    deployer.address, // initial owner
    deployer.address // minter
  ], { initializer: 'initialize' });
  await wsTokenManagement.waitForDeployment();
  console.log("WSTokenManagement deployed to:", await wsTokenManagement.getAddress());
  await saveAbi("WSTokenManagement", await wsTokenManagement.getAddress());

  /* ////////////////////////////////////////////
  ////////  WrappedSongSmartAccount contract  ////////
  //////////////////////////////////////////// */

  console.log("Deploying WrappedSongSmartAccount...");
  const WrappedSongSmartAccount = await ethers.getContractFactory("UpgradableWrappedSongSmartAccountUpgradeable");
  const wrappedSongSmartAccount = await upgrades.deployProxy(
    WrappedSongSmartAccount,
    [
      USDC_ADDRESS, // Use the USDC stablecoin address
      deployer.address,
      await protocolModule.getAddress(),
      await wsTokenManagement.getAddress()
    ],
    { initializer: 'initialize' }
  );
  await wrappedSongSmartAccount.waitForDeployment();
  console.log("WrappedSongSmartAccount deployed to:", await wrappedSongSmartAccount.getAddress());
  await saveAbi("WrappedSongSmartAccount", await wrappedSongSmartAccount.getAddress());

  /* ////////////////////////////////////////////
  ////////  WrappedSongFactory contract  ////////
  //////////////////////////////////////////// */

  console.log("Deploying WrappedSongFactory...");
  const WrappedSongFactory = await ethers.getContractFactory("WrappedSongFactoryUpgradeable");
  const wrappedSongFactory = await WrappedSongFactory.deploy(
    await protocolModule.getAddress(),
    await wrappedSongSmartAccount.getAddress(),
    await wsTokenManagement.getAddress()
  );
  await wrappedSongFactory.waitForDeployment();
  console.log("WrappedSongFactory deployed to:", await wrappedSongFactory.getAddress());
  await saveAbi("WrappedSongFactory", await wrappedSongFactory.getAddress());

  // After all deployments, save the contract addresses to a file
  fs.writeFileSync(addressesFile, JSON.stringify(contractAddresses, null, 2));
  console.log(`Contract addresses saved to ${addressesFile}`);

  fs.writeFileSync(addressesFile2, JSON.stringify(contractAddresses, null, 2));
  console.log(`Contract addresses saved to ${addressesFile2}`);
}

async function saveAbi(contractName: string, contractAddress: any) {
  const artifact = await artifacts.readArtifact(contractName);
  const abiContent = JSON.stringify(artifact.abi, null, 2); // Pretty print the JSON

  // Save ABI in the app directory
  fs.writeFileSync(
    path.join(abisDirectory, `${contractName}.json`),
    abiContent
  );
  console.log(`ABI for ${contractName} saved to ${abisDirectory}/${contractName}-${networkName}.json`);

  // Save ABI in the local protocol directory
  fs.writeFileSync(
    path.join(localAbisDirectory, `${contractName}.json`),
    abiContent
  );
  console.log(`ABI for ${contractName} saved to ${localAbisDirectory}/${contractName}-${networkName}.json`);

  // Update the contract addresses object
  contractAddresses[contractName] = contractAddress;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });