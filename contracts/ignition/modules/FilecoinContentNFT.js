// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("FilecoinContentNFTModule", (m) => {
  // Get deployment parameters
  const name = m.getParameter("name", "FilecoinContentNFT");
  const symbol = m.getParameter("symbol", "FCNFT");
  const feeRecipient = m.getParameter("feeRecipient", "0x0000000000000000000000000000000000000000");

  // Deploy the FilecoinContentNFT contract
  const filecoinContentNFT = m.contract("FilecoinContentNFT", [name, symbol, feeRecipient]);

  return { filecoinContentNFT };
});
