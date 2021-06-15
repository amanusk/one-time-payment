import { Contract, utils, BytesLike } from "ethers";
import { deployerAddress } from "./deployer";

export const VERSION = "v0.1.0";

export const deployContract = async (
  deployerContract: Contract,
  // contractFactory: ContractFactory,
  salt: string,
  deployTxData: BytesLike,
) => {
  let deployedContractAddress = utils.getCreate2Address(deployerAddress, salt, utils.keccak256(deployTxData));

  let code = await deployerContract.provider.getCode(deployedContractAddress);
  console.log("Code", code);
  let balance = await deployerContract.provider.getBalance(deployedContractAddress);
  console.log("Balance", utils.formatEther(balance));

  await (await deployerContract.deploy(deployTxData, salt)).wait();

  code = await deployerContract.provider.getCode(deployedContractAddress);
  console.log("Code", code);
  balance = await deployerContract.provider.getBalance(deployedContractAddress);
  console.log("Balance", utils.formatEther(balance));

  let block = await deployerContract.provider.getBlockNumber();
  console.log("block", block);
  return deployedContractAddress;
};
