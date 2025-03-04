import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Deploys a contract named "YourContract" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployYourContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  /*
    On localhost, the deployer account is the one that comes with Hardhat, which is already funded.

    When deploying to live networks (e.g `yarn deploy --network sepolia`), the deployer account
    should have sufficient balance to pay for the gas fees for contract creation.

    You can generate a random account with `yarn generate` or `yarn account:import` to import your
    existing PK which will fill DEPLOYER_PRIVATE_KEY_ENCRYPTED in the .env file (then used on hardhat.config.ts)
    You can run the `yarn account` command to check your balance in every network.
  */
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // TrustedIssuersRegistry
  await deploy("TrustedIssuersRegistry", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });
  const TrustedIssuersRegistry = await hre.ethers.getContract<Contract>("TrustedIssuersRegistry", deployer);
  await TrustedIssuersRegistry.init();

  // ClaimTopicsRegistry
  await deploy("ClaimTopicsRegistry", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });
  const ClaimTopicsRegistry = await hre.ethers.getContract<Contract>("ClaimTopicsRegistry", deployer);
  await ClaimTopicsRegistry.init();

  // IdentityRegistryStorage
  await deploy("IdentityRegistryStorage", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });
  const IdentityRegistryStorage = await hre.ethers.getContract<Contract>("IdentityRegistryStorage", deployer);
  await IdentityRegistryStorage.init();
  console.log(await IdentityRegistryStorage.getAddress());

  // IdentityRegistry
  await deploy("IdentityRegistry", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });
  const IdentityRegistry = await hre.ethers.getContract<Contract>("IdentityRegistry", deployer);
  await IdentityRegistry.init(
    await TrustedIssuersRegistry.getAddress(),
    await ClaimTopicsRegistry.getAddress(),
    await IdentityRegistryStorage.getAddress(),
  );

  // ModularCompliance
  await deploy("ModularCompliance", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });
  const ModularCompliance = await hre.ethers.getContract<Contract>("ModularCompliance", deployer);
  await ModularCompliance.init();

  // OnChainIdentity
  await deploy("OnChainIdentity", {
    from: deployer,
    args: [deployer, false],
    log: true,
    autoMine: true,
  });

  // Token
  await deploy("Token", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });
  const Token = await hre.ethers.getContract<Contract>("Token", deployer);
  await Token.init(
    await IdentityRegistry.getAddress(),
    await ModularCompliance.getAddress(),
    "Greenhood",
    "GHD",
    18,
    "0x0000000000000000000000000000000000000000",
  );
};

export default deployYourContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deployYourContract.tags = ["YourContract"];
