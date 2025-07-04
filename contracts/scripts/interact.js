const { ethers } = require("hardhat");

async function main() {
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const FilecoinContentNFT = await ethers.getContractFactory("FilecoinContentNFT");
  const filecoinContentNFT = await FilecoinContentNFT.attach(contractAddress);

  // Set a value
  await filecoinContentNFT.set(42);
  console.log("Set value to 42");

  // Get the value
  const value = await simpleStorage.get();
  console.log("Stored value:", value.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
