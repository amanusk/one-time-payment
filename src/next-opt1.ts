import { ethers, BigNumber } from "ethers";
import * as dotenv from "dotenv";

dotenv.config();

const MNEMONIC = process.env.MNEMONIC || "";
if (MNEMONIC === "") {
  console.warn("Must provide MNEMONIC environment variable");
  process.exit(1);
}

//let provider = ethers.providers.InfuraProvider("mainnet", INFURA_API_KEY);
let provider = new ethers.providers.AlchemyProvider("goerli");

const wallet = ethers.Wallet.fromMnemonic(MNEMONIC).connect(provider);

async function main() {
  const balance: BigNumber = await provider.getBalance(wallet.address);
  console.log("Source address", ethers.utils.formatEther(balance));

  let nonce = await wallet.getTransactionCount();
  console.log("Current nonce", nonce);

  console.log("Next Nonce", nonce + 1);

  let nextOPT1Address = ethers.utils.getContractAddress({ from: wallet.address, nonce: nonce + 1 });

  console.log("Next create1 address", nextOPT1Address);
}

main();
