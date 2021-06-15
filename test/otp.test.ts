import { ethers } from "hardhat";
import chai from "chai";
import { solidity } from "ethereum-waffle";
import { OneTimePay__factory } from "../typechain";

chai.use(solidity);
const { expect } = chai;

describe("OneTimePay", () => {
  describe("Pay", async () => {
    it("Should pay the target from the newly created address", async () => {
      const [deployer, payer, payee] = await ethers.getSigners();

      let nonce = await deployer.getTransactionCount();
      console.log("Current nonce", nonce);
      const optFactory = new OneTimePay__factory(deployer);

      console.log("Deployer address", deployer.address);

      // Approach 0, manually calculate result
      let contract0 = ethers.utils.keccak256(ethers.utils.RLP.encode([deployer.address, "0x"]));
      console.log("Contract 0", contract0);
      // let trimmedAddress = `0x${contract0.substring(26)}`;
      let checkSumAddress = ethers.utils.getAddress(contract0.substring(26));
      console.log("Address", checkSumAddress);

      // Approach 1, get result from ethers
      let ethersGetAddress = ethers.utils.getContractAddress({ from: deployer.address, nonce });
      console.log("Ethers predicted", ethersGetAddress);

      // TODO add assert and ensure correct balance
      await payer.sendTransaction({ to: ethersGetAddress, value: ethers.utils.parseEther("1.0") });

      let otpBalanceBefore = await ethers.provider.getBalance(ethersGetAddress);
      console.log("otp Balance before", ethers.utils.formatEther(otpBalanceBefore));

      let otpContract = await optFactory.deploy(payee.address);
      let otpAddress = otpContract.address;
      console.log("OTP address", otpAddress);

      let otpBalanceAfter = await ethers.provider.getBalance(otpAddress);
      console.log("otp Balance after", ethers.utils.formatEther(otpBalanceAfter));

      // For values besides 0, we can use hexlify for nonce
      nonce = await deployer.getTransactionCount();
      console.log("Current nonce", nonce);

      let contract1 = ethers.utils.keccak256(
        ethers.utils.RLP.encode([ethers.utils.hexlify(deployer.address), ethers.utils.hexlify(nonce)]),
      );
      console.log("Contract 1", contract1);

      otpContract = await optFactory.deploy(payee.address);
      otpAddress = otpContract.address;
      console.log("OTP address", otpAddress);
    });
  });
});
