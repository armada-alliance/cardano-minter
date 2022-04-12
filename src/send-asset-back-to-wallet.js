const cardano = require("./cardano")

// 1. get the wallet

const sender = cardano.wallet("ADAPI")

// 2. define the transaction

console.log(
    "Balance of Sender wallet: " +
    cardano.toAda(sender.balance().value.lovelace) + " ADA"
)

const receiver = "addr_test1qqqydvg5wzd6twvernsjcdjd9akmygyqp7gky7zpm0hrmq3ccwlnumzzuum6k6ja2k47g5dv2p4kwt753mpjjzx8fsmsq2aj0p"

const txInfo = {
    txIn: cardano.queryUtxo(sender.paymentAddr),
    txOut: [
        {
            address: sender.paymentAddr,
            value: {
                lovelace: sender.balance().value.lovelace - cardano.toLovelace(1.5)
            }
        },
        {
            address: receiver,
            value: {
                lovelace: cardano.toLovelace(1.5),
                "9e57c3a4aa769063ab4963e3e2fc18aeafb6808b3adbc3f1670a9c00.54696d65576172704265727279": 1
            }
        }
    ]
}

// 3. build the transaction

const raw = cardano.transactionBuildRaw(txInfo)

// 4. calculate the fee

const fee = cardano.transactionCalculateMinFee({
    ...txInfo,
    txBody: raw,
    witnessCount: 1
})

// 5. pay the fee by subtracting it from the sender utxo

txInfo.txOut[0].value.lovelace -= fee

// 6. build the final transaction

const tx = cardano.transactionBuildRaw({ ...txInfo, fee })

// 7. sign the transaction

const txSigned = cardano.transactionSign({
    txBody: tx,
    signingKeys: [sender.payment.skey]
})

// 8. submit the transaction

const txHash = cardano.transactionSubmit(txSigned)

console.log(txHash)