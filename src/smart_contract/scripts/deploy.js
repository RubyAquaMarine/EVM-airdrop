// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Contract name within .sol
  const SimulateTx = await hre.ethers.getContractFactory("AirdropV2");//AirdropV2
  const simulateTx = await SimulateTx.deploy();
  await simulateTx.deployed();
  console.log("simulateTx to:", simulateTx.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
