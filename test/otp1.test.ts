import { ethers } from "hardhat";
import chai from "chai";
import { solidity } from "ethereum-waffle";
import { OneTimePay__factory } from "../typechain";

chai.use(solidity);
const { expect } = chai;

describe("OneTimePay", () => {
  describe("Pay", async () => {
    it("Should pay the target from the newly created address, with manual calculation", async () => {
      const [deployer, payer, payee] = await ethers.getSigners();

      let payeeBalanceBefore = await ethers.provider.getBalance(payee.address);

      let nonce = await deployer.getTransactionCount();
      // console.log("Current nonce", nonce);
      const optFactory = new OneTimePay__factory(deployer);

      // console.log("Deployer address", deployer.address);

      // Approach 0, manually calculate result
      let contract0 = ethers.utils.keccak256(ethers.utils.RLP.encode([deployer.address, "0x"]));
      // console.log("Contract 0", contract0);
      // let trimmedAddress = `0x${contract0.substring(26)}`;
      let contract0Address = ethers.utils.getAddress(contract0.substring(26));
      //console.log("Address", checkSumAddress);

      let value = ethers.utils.parseEther("1.0");

      // TODO add assert and ensure correct balance
      await payer.sendTransaction({ to: contract0Address, value: value });

      let otpBalanceBefore = await ethers.provider.getBalance(contract0Address);
      expect(otpBalanceBefore).to.be.equal(value);
      console.log("otp Balance before", ethers.utils.formatEther(otpBalanceBefore));

      let otpContract = await optFactory.deploy(payee.address);
      let otpAddress = otpContract.address;
      // console.log("OTP address", otpAddress);

      let otpBalanceAfter = await ethers.provider.getBalance(otpAddress);
      expect(otpBalanceAfter).to.be.equal(0);
      console.log("otp Balance after", ethers.utils.formatEther(otpBalanceAfter));

      let payeeBalanceAfter = await ethers.provider.getBalance(payee.address);
      expect(payeeBalanceAfter).to.be.equal(payeeBalanceBefore.add(value));

      // For values besides 0, we can use hexlify for nonce
      nonce = await deployer.getTransactionCount();
      // console.log("Current nonce", nonce);

      let contract1Address = ethers.utils.keccak256(
        ethers.utils.RLP.encode([ethers.utils.hexlify(deployer.address), ethers.utils.hexlify(nonce)]),
      );
      contract1Address = ethers.utils.getAddress(contract1Address.substring(26));
      console.log("Contract 1", contract1Address);
      await payer.sendTransaction({ to: contract1Address, value: value });

      payeeBalanceBefore = payeeBalanceAfter;

      otpContract = await optFactory.deploy(payee.address);
      otpAddress = otpContract.address;

      payeeBalanceAfter = await ethers.provider.getBalance(payee.address);
      expect(payeeBalanceAfter).to.be.equal(payeeBalanceBefore.add(value));
    });

    it("Should pay the target from the newly created address, using ethers", async () => {
      const [deployer, payer, payee] = await ethers.getSigners();

      let payeeBalanceBefore = await ethers.provider.getBalance(payee.address);

      let nonce = await deployer.getTransactionCount();
      // console.log("Current nonce", nonce);
      const optFactory = new OneTimePay__factory(deployer);

      // console.log("Deployer address", deployer.address);

      let ethersGetAddress = ethers.utils.getContractAddress({ from: deployer.address, nonce });
      //console.log("Ethers predicted", ethersGetAddress);

      let value = ethers.utils.parseEther("1.0");

      // TODO add assert and ensure correct balance
      await payer.sendTransaction({ to: ethersGetAddress, value: value });

      let otpBalanceBefore = await ethers.provider.getBalance(ethersGetAddress);
      // console.log("otp Balance before", ethers.utils.formatEther(otpBalanceBefore));
      expect(otpBalanceBefore).to.be.equal(value);

      await optFactory.deploy(payee.address);

      let payeeBalanceAfter = await ethers.provider.getBalance(payee.address);
      expect(payeeBalanceAfter).to.be.equal(payeeBalanceBefore.add(value));
    });

    it("Check balance of self destructed contract", async () => {
      const [deployer, payer] = await ethers.getSigners();

      let nonce = await deployer.getTransactionCount();
      // console.log("Current nonce", nonce);
      const optFactory = new OneTimePay__factory(deployer);

      // console.log("Deployer address", deployer.address);

      let ethersGetAddress = ethers.utils.getContractAddress({ from: deployer.address, nonce });
      //console.log("Ethers predicted", ethersGetAddress);

      let value = ethers.utils.parseEther("1.0");

      // TODO add assert and ensure correct balance
      await payer.sendTransaction({ to: ethersGetAddress, value: value });

      let otpBalanceBefore = await ethers.provider.getBalance(ethersGetAddress);
      // console.log("otp Balance before", ethers.utils.formatEther(otpBalanceBefore));
      expect(otpBalanceBefore).to.be.equal(value);

      let depRes = await optFactory.deploy(ethersGetAddress);
      expect(depRes.address).to.be.equal(ethersGetAddress);

      let otpBalanceAfter = await ethers.provider.getBalance(ethersGetAddress);
      console.log("OTP balance after", otpBalanceAfter);
    });
  });
});
