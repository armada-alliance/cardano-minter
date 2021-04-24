const cardano = require("./cardano")
const assets = require("./assets.json")
const getPolicyId = require("./get-policy-id")

// 1. get the wallet
const sender = cardano.wallet("ADAPI")

// 2. define the transaction
console.log(
    "Balance of Sender wallet: " +
    cardano.toAda(sender.balance().amount.lovelace) + " ADA"
)

const { policyId: POLICY_ID } = getPolicyId()

// 5. Generate txOut amount
function sendAssets({ receiver, assets }) {

    const txOut_amount_sender = assets
        .reduce((result, asset) => {
            const ASSET_ID = POLICY_ID + "." + asset
            delete result[ASSET_ID]
            return result

        }, {
            ...sender.balance().amount
        })

    const txOut_amount_receiver = assets
        .reduce((result, asset) => {

            const ASSET_ID = POLICY_ID + "." + asset
            result[ASSET_ID] = 1
            return result

        }, {})

    // This is dependent on the network, try to increase this amount of ADA
    // if you get an error saying: OutputTooSmallUTxO
    const MIN_LOVELACE = 1.6

    const txInfo = {
        txIn: cardano.queryUtxo(sender.paymentAddr),
        txOut: [
            {
                address: sender.paymentAddr,
                amount: {
                    ...txOut_amount_sender,
                    lovelace: txOut_amount_sender.lovelace - cardano.toLovelace(MIN_LOVELACE),
                }
            },
            {
                address: receiver,
                amount: {
                    lovelace: cardano.toLovelace(MIN_LOVELACE),
                    ...txOut_amount_receiver
                }
            }
        ]
    }

    console.log(JSON.stringify(
        txInfo,
        null,
        2
    ))

    // 3. build the transaction

    const raw = cardano.transactionBuildRaw(txInfo)

    // 4. calculate the fee

    const fee = cardano.transactionCalculateMinFee({
        ...txInfo,
        txBody: raw,
        witnessCount: 1
    })

    // 5. pay the fee by subtracting it from the sender utxo

    txInfo.txOut[0].amount.lovelace -= fee

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
}

sendAssets({
    receiver: "addr1q9ktasvhdwppg8chvpcpu4xnp70ce4wlf8qduf576pj7p5h6k36mg2qlc9aq7qapx85067d5l8llhhr4fj6azvx384eqfcg44e",
    assets: assets.map(asset => asset.id)
})

// another example
// sendAssets({
//     receiver: "addr1q9ktasvhdwppg8chvpcpu4xnp70ce4wlf8qduf576pj7p5h6k36mg2qlc9aq7qapx85067d5l8llhhr4fj6azvx384eqfcg44e",
//     assets: [
//         "PIADA0",
//         "PIADA1",
//         "PIADA2",
//     ]
// })