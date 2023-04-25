// scripts/withdraw.js

const { ethers } = require("hardhat");
const hre = require("hardhat");
const abi = require("../artifacts/contracts/BuyMeACoffee.sol/BuyMeACoffee.json");
require("dotenv").config()

async function getBalance(provider, address) {
  const balanceBigInt = await provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigInt);
}

async function main() {
  // Get the contract that has been deployed to Mumbai.
  const contractAddress="0xc303D7d294F7207d34aeA34bE772dcBd0A0c2eb8";
  const contractABI = abi.abi;

  // Get the node connection and wallet connection.
  const provider = new hre.ethers.providers.AlchemyProvider("matic", process.env.MUMBAI_API_KEY);

  // Ensure that signer is the SAME address as the original contract deployer,
  // or else this script will fail with an error.
  const signer = new hre.ethers.Wallet(process.env.PRIVATE_KEY, provider);


  // Instantiate connected contract.
  const buyMeACoffee = new hre.ethers.Contract(contractAddress, contractABI, signer);

  // Check starting balances.
  console.log("current balance of owner: ", await getBalance(provider, signer.address), "MATIC");
  const contractBalance = await getBalance(provider, buyMeACoffee.address);
  console.log("current balance of contract: ", await getBalance(provider, buyMeACoffee.address), "MATIC");

  // Withdraw funds if there are funds to withdraw.
 if (contractBalance !== "0.0") {
    console.log("withdrawing funds..")
    const withdrawTxn = await buyMeACoffee.withdrawTips();
    await withdrawTxn.wait();
  } else {
    console.log("no funds to withdraw!");
  }

  // Check ending balance.
  console.log("current balance of owner: ", await getBalance(provider, signer.address), "MATIC");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });