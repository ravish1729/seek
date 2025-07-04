// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("TipModule", (m) => {
  // Deploy the Tip contract
  // The Tip contract constructor doesn't take any parameters
  // The deployer automatically becomes the platform owner
  const tip = m.contract("Tip");

  return { tip };
});
