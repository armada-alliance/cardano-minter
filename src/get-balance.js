const cardano = require("./cardano")

const sender = cardano.wallet("ADAPI")

console.log(
    sender.balance()
)