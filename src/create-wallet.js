const cardano = require("./cardano")

const createWallet = name => {

    cardano.addressKeyGen(name)
    cardano.stakeAddressKeyGen(name)
    cardano.stakeAddressBuild(name)
    cardano.addressBuild(name)
    return cardano.wallet(name)
}

createWallet("ADAPI")