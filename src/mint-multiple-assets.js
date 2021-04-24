const cardano = require("./cardano")
const getPolicyId = require("./get-policy-id")
const assets = require("./assets.json")

// 1. Get the wallet
const wallet = cardano.wallet("ADAPI")

// 2. Get minting policy

const { policyId: POLICY_ID, mintScript } = getPolicyId()

// 4. Generate metadata
const metadata_assets = assets.reduce((result, asset) => {

    const ASSET_ID = POLICY_ID + "." + asset.id

    // remove the id property from the asset metadata
    const asset_metadata = {
        ...asset
    }

    delete asset_metadata.id

    return {
        ...result,
        [ASSET_ID]: asset_metadata
    }

}, {})

const metadata = {
    721: {
        [POLICY_ID]: {
            ...metadata_assets
        }
    }
}

// 5. Generate txOut amount
const txOut_amount = assets.reduce((result, asset) => {

    const ASSET_ID = POLICY_ID + "." + asset.id
    result[ASSET_ID] = 1
    return result

}, {
    ...wallet.balance().amount
})

// 6. Generate mint actions
const mint_actions = assets.map(asset => ({ action: "mint", amount: 1, token: POLICY_ID + "." + asset.id }))

// 7. Define transaction
const tx = {
    txIn: wallet.balance().utxo,
    txOut: [
        {
            address: wallet.paymentAddr,
            amount: txOut_amount
        }
    ],
    mint: mint_actions,
    metadata,
    witnessCount: 2
}

// 8. Build transaction
const buildTransaction = (tx) => {

    const raw = cardano.transactionBuildRaw(tx)
    const fee = cardano.transactionCalculateMinFee({
        ...tx,
        txBody: raw
    })

    tx.txOut[0].amount.lovelace -= fee

    return cardano.transactionBuildRaw({ ...tx, fee })
}

const raw = buildTransaction(tx)

// 9. Sign transaction
const signTransaction = (wallet, txBody, scriptFile) => {

    return cardano.transactionSign({
        signingKeys: [wallet.payment.skey, wallet.payment.skey],
        scriptFile,
        txBody
    })
}

const signed = signTransaction(wallet, raw, mintScript)

// 10. Submit transaction
const txHash = cardano.transactionSubmit(signed)

console.log(txHash)