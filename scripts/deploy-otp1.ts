// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
import { Contract, ContractFactory } from "ethers";

const GWEI = 1000000000;

async function main(): Promise<void> {
  const Otp1Factory: ContractFactory = await ethers.getContractFactory("OneTimePay");
  // Set target to the next address associated with the used seed and nonce
  const otp1: Contract = await Otp1Factory.deploy("0x1A3879f814ec73045cEC9ee826EC146b524C789e");
  await otp1.deployed();
  // Use appropriate gas price
  console.log("Otp contract deployed to", otp1.address, { gasPrice: 501 * GWEI });
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
