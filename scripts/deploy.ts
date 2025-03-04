import { ethers } from 'hardhat';

async function main() {
  // TrustedIssuersRegistry
  const TrustedIssuersRegistry = await ethers.getContractFactory('TrustedIssuersRegistry');
  const TrustedIssuersRegistryInstance = await TrustedIssuersRegistry.deploy();
  await TrustedIssuersRegistryInstance.deployed();
  console.log(`TrustedIssuersRegistry deployed to: ${TrustedIssuersRegistryInstance.address}`);
  await TrustedIssuersRegistryInstance.init();
  console.log('TrustedIssuersRegistry initialized');

  // ClaimTopicsRegistry
  const ClaimTopicsRegistry = await ethers.getContractFactory('ClaimTopicsRegistry');
  const ClaimTopicsRegistryInstance = await ClaimTopicsRegistry.deploy();
  await ClaimTopicsRegistryInstance.deployed();
  console.log(`ClaimTopicsRegistry deployed to: ${ClaimTopicsRegistryInstance.address}`);
  await ClaimTopicsRegistryInstance.init();
  console.log('ClaimTopicsRegistry initialized');

  // IdentityRegistryStorage
  const IdentityRegistryStorage = await ethers.getContractFactory('IdentityRegistryStorage');
  const IdentityRegistryStorageInstance = await IdentityRegistryStorage.deploy();
  await IdentityRegistryStorageInstance.deployed();
  console.log(`IdentityRegistryStorage deployed to: ${IdentityRegistryStorageInstance.address}`);
  await IdentityRegistryStorageInstance.init();
  console.log('IdentityRegistryStorage initialized');

  // IdentityRegistry
  const IdentityRegistry = await ethers.getContractFactory('IdentityRegistry');
  const IdentityRegistryInstance = await IdentityRegistry.deploy();
  await IdentityRegistryInstance.deployed();
  console.log(`IdentityRegistry deployed to: ${IdentityRegistryInstance.address}`);
  await IdentityRegistryInstance.init(
    TrustedIssuersRegistryInstance.address,
    ClaimTopicsRegistryInstance.address,
    IdentityRegistryStorageInstance.address,
  );
  console.log('IdentityRegistry initialized');

  // ModularCompliance
  const ModularCompliance = await ethers.getContractFactory('ModularCompliance');
  const ModularComplianceInstance = await ModularCompliance.deploy();
  await ModularComplianceInstance.deployed();
  console.log(`ModularCompliance deployed to: ${ModularComplianceInstance.address}`);
  await ModularComplianceInstance.init();
  console.log('ModularCompliance initialized');

  // OnChainIdentity
  const [deployer] = await ethers.getSigners();

  const OnChainIdentity = await ethers.getContractFactory('OnChainIdentity');
  const OnChainIdentityInstance = await OnChainIdentity.deploy(deployer.address, false);
  await OnChainIdentityInstance.deployed();
  console.log(`OnChainIdentity deployed to: ${OnChainIdentityInstance.address}`);

  // Token
  const Token = await ethers.getContractFactory('Token');
  const TokenInstance = await Token.deploy();
  await TokenInstance.deployed();
  console.log(`Token deployed to: ${TokenInstance.address}`);
  await TokenInstance.init(
    IdentityRegistryInstance.address,
    ModularComplianceInstance.address,
    'Greenhood',
    'GHD',
    18,
    OnChainIdentityInstance.address,
  );
  console.log('Token initialized');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
