const fs = require("fs")
const cardano = require("./cardano")

// 1. Get the wallet
const wallet = cardano.wallet("ADAPI")

// 2. Define mint script
const mintScript = {
    keyHash: cardano.addressKeyHash(wallet.name),
    type: "sig"
}

fs.writeFileSync(__dirname + '/mint-policy.json', JSON.stringify(mintScript, null, 2))
fs.writeFileSync(__dirname + '/mint-policy-id.txt', cardano.transactionPolicyid(mintScript))