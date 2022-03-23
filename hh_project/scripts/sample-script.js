// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const Issuer = await hre.ethers.getContractFactory("Issuer");
  const issuer = await Issuer.deploy();

  await issuer.deployed();

  console.log("Issuer deployed to:", issuer.address);

  const Migrations = await hre.ethers.getContractFactory("Migrations");
  const migrations = await Migrations.deploy();

  await migrations.deployed();

  console.log("Migrations deployed to:", migrations.address);


  const PrivateIssuer = await hre.ethers.getContractFactory("PrivateIssuer");
  const privateIssuer = await PrivateIssuer.deploy();

  await privateIssuer.deployed();

  console.log("PrivateIssuer deployed to:", privateIssuer.address);


  const Registry = await hre.ethers.getContractFactory("Registry");
  const registry = await Registry.deploy("x");

  await registry.deployed();

  console.log("Registry deployed to:", registry.address);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
