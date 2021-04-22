const fs = require("fs")
const cardano = require("./cardano")

const SLOTS_PER_EPOCH = 5 * 24 * 60 * 60

// 1. Get the wallet
const wallet = cardano.wallet("ADAPI")

// 2. Get the current slot
const { slot } = cardano.queryTip()

// 3. Define mint script
const mintScript = {
    type: "all",
    scripts: [
        {
            slot: slot + (SLOTS_PER_EPOCH * 5),
            type: "before"
        },
        {
            keyHash: cardano.addressKeyHash(wallet.name),
            type: "sig"
        }
    ]
}

fs.writeFileSync(__dirname + '/mint-policy.json', JSON.stringify(mintScript, null, 2))
fs.writeFileSync(__dirname + '/mint-policy-id.txt', cardano.transactionPolicyid(mintScript))