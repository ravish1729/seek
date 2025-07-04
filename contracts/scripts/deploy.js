const { ethers } = require("hardhat");

async function main() {
  const FilecoinContentNFT = await ethers.getContractFactory("FilecoinContentNFT");
  console.log("Deploying FilecoinContentNFT...");
  const filecoinContentNFT = await FilecoinContentNFT.deploy();
  console.log("FilecoinContentNFT deployed to:", filecoinContentNFT.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
