import { ethers } from "hardhat";
import chai from "chai";
import { solidity } from "ethereum-waffle";
import { OneTimePay__factory } from "../typechain";
import { deployContract, VERSION } from "../src/deploy";
import { deployDeployer } from "../src/deployer";
import { Contract, ContractFactory } from "ethers";

chai.use(solidity);
const { expect } = chai;

describe("Create2 OneTimePay", () => {
  let deployerContract: Contract;

  // beforeEach(async () => {
  //   const [deployer] = await ethers.getSigners();
  //   deployerContract = await deployDeployer(deployer);
  //   console.log("Deployer contract address", deployerContract.address);
  // });
  describe("Pay", async () => {
    it("Should deploy the otp contract to a known address", async () => {
      const [deployer, payer, payee] = await ethers.getSigners();
      deployerContract = await deployDeployer(deployer);
      console.log("Deployer contract address", deployerContract.address);

      let nonce = await deployer.getTransactionCount();
      console.log("Current nonce", nonce);
      //const otpFactory = new OneTimePay__factory(deployer);
      const otpFactory = await ethers.getContractFactory("OneTimePay");
      const deployTx = otpFactory.getDeployTransaction(payee.address);
      if (deployTx.data) {
        let otpAddress = ethers.utils.getCreate2Address(
          deployerContract.address,
          ethers.utils.keccak256(ethers.utils.toUtf8Bytes(VERSION)),
          ethers.utils.keccak256(deployTx.data),
        );
        console.log("Future TOP address", otpAddress);
        await payer.sendTransaction({ to: otpAddress, value: ethers.utils.parseEther("1.0") });

        let otpBalance = await ethers.provider.getBalance(otpAddress);
        console.log("otp Balance before", ethers.utils.formatEther(otpBalance));

        let deployedAddress = await deployContract(
          deployerContract,
          // otpFactory,
          ethers.utils.keccak256(ethers.utils.toUtf8Bytes(VERSION)),
          deployTx.data,
        );

        let nonce = await deployer.getTransactionCount();
        console.log("Deployer nonce", nonce);

        console.log("OTP address", deployedAddress);
        if (deployedAddress) {
          let payeeBalanceAfter = await ethers.provider.getBalance(payee.address);
          console.log("Payee Balance after", ethers.utils.formatEther(payeeBalanceAfter));
          let otpBalanceAfter = await ethers.provider.getBalance(deployedAddress);
          console.log("otp Balance after", ethers.utils.formatEther(otpBalanceAfter));
        }
      }
    });
  });
});
