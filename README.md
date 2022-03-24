# How to create an NFT on the Cardano blockchain using JavaScript

Youtube Video: https://www.youtube.com/watch?v=OeOliguGn7Y

## Who is this guide for?

- For people who want to make NFT's
- For people who perhaps know Cardano

## Benefits of NFT's on Cardano

- Low transaction fees
- Native on the blockchain (perhaps compare with Ethereum, eth is smart contract based)

## Prerequisites

- cardano-node / cardano-cli set up on local machine (https://docs.cardano.org/projects/cardano-node/en/latest)
- node.js installed

```bash
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt-get install -y nodejs
```

3. Verify everything is set up properly

cardano-cli

```
cardano-cli version
```

output should be similar:

```
cardano-cli 1.34.1 - linux-aarch64 - ghc-8.10
git rev 0000000000000000000000000000000000000000
```

cardano-node

```
cardano-node version
```

output should be similar:

```
cardano-node 1.34.1 - linux-aarch64 - ghc-8.10
git rev 0000000000000000000000000000000000000000
```

node.js

```
node -v
```

```
v14.19.0
```

## Overview of this tutorial

1. verify env

2. create project and initial setup

```bash
#make sure our db is in our $PATH
CARDANO_NODE_SOCKET_PATH="$NODE_HOME/db/socket"

mkdir cardano-minter
cd cardano-minter
npm init -y #creates package.json)
npm install cardanocli-js --save

```

3. Copy the Cardano node genesis latest build number from IOHK hydra website

   - https://hydra.iohk.io/build/5367762/download/1/index.html

4. Download Genesis config file needed for shelly-era

```bash
nano fetch-config.sh
```

```
echo export NODE_BUILD_NUM=$(curl https://hydra.iohk.io/job/Cardano/iohk-nix/cardano-deployment/latest-finished/download/1/index.html | grep -e "build" | sed 's/.*build\/\([0-9]*\)\/download.*/\1/g') >> $HOME/.bashrc
wget -N https://hydra.iohk.io/build/${NODE_BUILD_NUM}/download/1/testnet-shelley-genesis.json
```

```bash
chmod +x fetch-config.sh
./fetch-config.sh
```

5. make src folder/directory and then create Cardano client

```bash
mkdir src; cd src
nano cardano.js
```

```js
const CardanocliJs = require("cardanocli-js");
const os = require("os");
const path = require("path");

const dir = path.join(os.homedir(), "cardano-minter");
const shelleyPath = path.join(
  os.homedir(),
  "pi-pool/files",
  "testnet-shelley-genesis.json"
);

const cardanocliJs = new CardanocliJs({
//   era: "mary",
  network: 'testnet-magic 1097911063',
  dir,
  shelleyGenesisPath: shelleyPath,
});

module.exports = cardanocliJs
```

8. create wallet

```
nano create-wallet.js
```

```js
const cardano = require("./cardano");

const createWallet = (account) => {
  cardano.addressKeyGen(account);
  cardano.stakeAddressKeyGen(account);
  cardano.stakeAddressBuild(account);
  cardano.addressBuild(account);
  return cardano.wallet(account);
};

createWallet("ADAPI");
```

```bash
cd cardano-minter
node src/create-wallet.js
```

9. Verify balance wallet balance is Zero, then we fund the wallet
   - First we need to create a get-balance.js script

```bash
# open text editor
cd cardano-minter/src; nano get-balance.js
```

```js
// create get-balance.js
const cardano = require("./cardano");

const sender = cardano.wallet("ADAPI");

console.log(sender.balance());
```

10. check the balance (utxo)

```bash
cd ..
node src/get-balance.js
```

11. Download IPFS

12. Upload your files to IPFS

- image - ipfs://QmQqzMTavQgT4f4T5v6PWBp7XNKtoPmC9jvn12WPT3gkSE
- src - ipfs://Qmaou5UzxPmPKVVTM9GzXPrDufP55EDZCtQmpy3T64ab9N

13. Generate policy id

14. Define your meta data

15. create mint transaction

```js
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

// 4. Define ASSET_NAME

const ASSET_NAME = "BerrySpaceGreen"

// Convert Asset ASCII name to HEX

const ASSET_NAME_HEX = ASSET_NAME.split("").map(c => c.charCodeAt(0).toString(16).padStart(2, "0")).join("");


// 5. Create ASSET_ID

const ASSET_ID = POLICY_ID + "." + ASSET_NAME_HEX

// 6. Define metadata

const metadata = {
    721: {
        [POLICY_ID]: {
            [ASSET_NAME]: {
                name: ASSET_NAME,
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
            value: { ...wallet.balance().value, [ASSET_ID]: 1 }
        }
    ],
    mint: [
        { action: "mint", quantity: 1, asset: ASSET_ID, script: mintScript },
      ],
    metadata,
    witnessCount: 2
}



if(Object.keys(tx.txOut[0].value).includes("undefined")|| Object.keys(tx.txIn[0].value.includes("undefinded"))){
    delete tx.txOut[0].value.undefined
    delete tx.txIn[0].value.undefined
}

// 8. Build transaction

const buildTransaction = (tx) => {

    const raw = cardano.transactionBuildRaw(tx)
    const fee = cardano.transactionCalculateMinFee({
        ...tx,
        txBody: raw
    })

    tx.txOut[0].value.lovelace -= fee

    return cardano.transactionBuildRaw({ ...tx, fee })
}

console.log(tx)
const raw = buildTransaction(tx)

// 9. Sign transaction

const signTransaction = (wallet, tx) => {

    return cardano.transactionSign({
        signingKeys: [wallet.payment.skey, wallet.payment.skey ],
        txBody: tx
    })
}

const signed = signTransaction(wallet, raw)

// 10. Submit transaction

const txHash = cardano.transactionSubmit(signed)

console.log(txHash)
```

16. Run the minting script, then wait a few moments to check the balance (utxo)

```bash
cd ..
node src/mint-asset.js
```

```bash
node src/get-balance.js
```

17. send your nft back to your wallet
    - Create anew script to send nft to wallet

```js
const cardano = require("./cardano");

// 1. get the wallet
// 2. define the transaction
// 3. build the transaction
// 4. calculate the fee
// 5. pay the fee by subtracting it from the sender utxo
// 6. build the final transaction
// 7. sign the transaction
// 8. submit the transaction

const sender = cardano.wallet("ADAPI");

console.log(
  "Balance of Sender wallet: " +
    cardano.toAda(sender.balance().amount.lovelace) +
    " ADA"
);

const receiver =
  "addr1qym6pxg9q4ussr96c9e6xjdf2ajjdmwyjknwculadjya488pqap23lgmrz38glvuz8qlzdxyarygwgu3knznwhnrq92q0t2dv0";

const txInfo = {
  txIn: cardano.queryUtxo(sender.paymentAddr),
  txOut: [
    {
      address: sender.paymentAddr,
      amount: {
        lovelace: sender.balance().amount.lovelace - cardano.toLovelace(1.5),
      },
    },
    {
      address: receiver,
      amount: {
        lovelace: cardano.toLovelace(1.5),
        "ad9c09fa0a62ee42fb9555ef7d7d58e782fa74687a23b62caf3a8025.BerrySpaceGreen": 1,
      },
    },
  ],
};

const raw = cardano.transactionBuildRaw(txInfo);

const fee = cardano.transactionCalculateMinFee({
  ...txInfo,
  txBody: raw,
  witnessCount: 1,
});

//pay the fee by subtracting it from the sender utxo
txInfo.txOut[0].amount.lovelace -= fee;

//create final transaction
const tx = cardano.transactionBuildRaw({ ...txInfo, fee });

//sign the transaction
const txSigned = cardano.transactionSign({
  txBody: tx,
  signingKeys: [sender.payment.skey],
});

//subm transaction
const txHash = cardano.transactionSubmit(txSigned);
console.log("TxHash: " + txHash);
```

18. view your nft in your wallet

19. View your asset on cardanoassets.com

20. View your asset on pool.pm (see the actual picture)

21. Show the original minting metadata

22. open the src ipfs to prove that it work
