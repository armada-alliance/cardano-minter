const cardano = require("./cardano")

// 1. get the wallet

const sender = cardano.wallet("ADAPI")

// 2. define the transaction

console.log(
    "Balance of Sender wallet: " +
    cardano.toAda(sender.balance().value.lovelace) + " ADA"
)

const receiver = "addr1qym6pxg9q4ussr96c9e6xjdf2ajjdmwyjknwculadjya488pqap23lgmrz38glvuz8qlzdxyarygwgu3knznwhnrq92q0t2dv0"

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
                "ad9c09fa0a62ee42fb9555ef7d7d58e782fa74687a23b62caf3a8025.BerrySpaceGreen": 1
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