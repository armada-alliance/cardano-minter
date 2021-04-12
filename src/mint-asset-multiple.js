const cardano = require("./cardano")

// 1. Get the wallet

const wallet = cardano.wallet("ADAPI")

// 2. Define mint script

const mintScript = {
    keyHash: cardano.addressKeyHash(wallet.name),
    type: "sig"
}

// 3. Create POLICY_ID

const POLICY_ID = cardano.transactionPolicyid(mintScript)

// 4. Define ASSET_NAMEs

const ASSET_NAME_1 = "BerrySpaceGreen1"
const ASSET_NAME_2 = "BerrySpaceGreen2"

// 5. Create ASSET_ID

const ASSET_ID_1 = POLICY_ID + "." + ASSET_NAME_1
const ASSET_ID_2 = POLICY_ID + "." + ASSET_NAME_2

// 6. Define metadata

const metadata = {
    721: {
        [POLICY_ID]: {
            [ASSET_NAME_1]: {
                name: "BerrySpaceGreen #1",
                image: "ipfs://QmQqzMTavQgT4f4T5v6PWBp7XNKtoPmC9jvn12WPT3gkSE",
                description: "Super Fancy Berry Space Green NFT",
                type: "image/png",
                src: "ipfs://Qmaou5UzxPmPKVVTM9GzXPrDufP55EDZCtQmpy3T64ab9N",
                // other properties of your choice
                authors: ["PIADA", "SBLYR"]
            },
            [ASSET_NAME_2]: {
                name: "BerrySpaceGreen #2",
                image: "ipfs://QmQqzMTavQgT4f4T5v6PWBp7XNKtoPmC9jvn12WPT3gkSE",
                description: "Super Fancy Berry Space Green NFT",
                type: "image/png",
                src: "ipfs://Qmaou5UzxPmPKVVTM9GzXPrDufP55EDZCtQmpy3T64ab9N",
                // other properties of your choice
                authors: ["PIADA", "SBLYR"]
            }
        }
    }
}

// 7. Define transaction

const tx = {
    txIn: wallet.balance().utxo,
    txOut: [
        {
            address: wallet.paymentAddr,
            amount: {
                ...wallet.balance().amount,
                [ASSET_ID_1]: 1,
                [ASSET_ID_2]: 1
            }
        }
    ],
    mint: [{
        action: "mint", amount: 1, token: ASSET_ID_1,
        action: "mint", amount: 1, token: ASSET_ID_2,
    }],
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

const signTransaction = (wallet, tx, script) => {

    return cardano.transactionSign({
        signingKeys: [wallet.payment.skey, wallet.payment.skey],
        scriptFile: script,
        txBody: tx
    })
}

const signed = signTransaction(wallet, raw, mintScript)

// 10. Submit transaction

const txHash = cardano.transactionSubmit(signed)

console.log(txHash)