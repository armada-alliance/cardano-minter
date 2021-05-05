# How to make a NFT collection on Cardano using javascript.

## Prerequisites
- cardano-node / cardano-cli set up on local machine (https://docs.cardano.org/projects/cardano-node/en/latest)
- Node.js installed version 14
- cardano-cli-js package installed 
- cardano-minter repo from the previous tutorial

**If you haven't already, watch the previous video tutorial here:**
https://youtu.be/OeOliguGn7Y

## Clone the cardano-minter repo if you haven't already...
```bash
git clone https://github.com/ADA-Pi/cardano-minter
cd cardano-minter
```
## Install additional dependencies
```bash
npm install form-data dotenv axios lodash sharp promise-parallel-throttle --save
```
# Tutorial Overview

## 1. Create our initial assets
- Create a script that will generate our assets in a nicely formatted json file called "assets.json".
```bash
node src/create-initial-assets-json.js
```
## 2. Download random images for testing
```bash
node src/download-test-images.js
```

## 3. Create our pinata.cloud account to get our API keys

1. Create an account
2. Create api keys

## 4. Need to safely store our API keys
- create .env file and paste in our keys


## 5. Extend metadata.json with thumbnails (optional)
- generate thumbnails based on images from the metadata.json and
give them same name with `_thumbnail` tag added to the name
```bash
node src/generate-thumbnails.js
```

## 6. upload and pin our data to ipfs
`node src/pin-images-to-ipfs.js`
create pin-to-ipfs.js
iterate over each item in metadata.json and:
    - pin the original image to ipfs
    - pin the thumbnail to ipfs
    - store the reference to both src and image on ipfs in metadata.json 


## Before you mint transaction

- Speak about the various minting policies. https://docs.cardano.org/projects/cardano-node/en/latest/reference/simple-scripts.html#Step-1---construct-the-tx-body 

## 7. Create an "open" or "unlocked" minting policy and script
- We will create a open minting policy script and export it in a JSON and TXT format.
```bash
node src/create-mint-policy.js
```

## 8. Create an "time-locked" minting policy and script
- Create a "time-locked" minting policy script and export it in a JSON and TXT format.
```bash
node src/create-time-locked-mint-policy.js
```

## 9. Create a a script to get our policy ID
- We want to make a script that can get our Policy ID to be used in other parts of our program
```bash
node src/get-policy-id.js
```

## 9. Define the mint transaction 
1. build mint transaction with metadata.json
2. calc fee
3. rebuild
4. sign
5. submit
```bash
node src/mint-multiple-assets.js
```

## 10. Send assets back to wallet
-Make a script to send multiple assets back to a wallet in a single transaction.
```bash
node src/send-multiple-assets-back-to-wallet.js
```
