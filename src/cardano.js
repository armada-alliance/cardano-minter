const CardanocliJs = require("cardanocli-js");
const os = require("os");
const path = require("path");

const dir = path.join(os.homedir(), "projects/cardano-minter");
const shelleyPath = path.join(
  os.homedir(),
  "mainnet-relay",
  "mainnet-shelley-genesis.json"
);

const cardanocliJs = new CardanocliJs({
//   era: "mary",
  network: `mainnet`,
  dir,
  shelleyGenesisPath: shelleyPath,
});

module.exports = cardanocliJs