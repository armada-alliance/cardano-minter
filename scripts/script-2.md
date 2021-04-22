## prerequisites
all of this can be done on testnet,
make sure to check out our tutorial

## optionally watch the previous video

## git clone if you havent
git clone https://github.com/ADA-Pi/cardano-minter
cd cardano-minter

## install additional dependencies
npm install form-data dotenv axios lodash sharp promise-parallel-throttle --save

## download random images for testing
`node src/download-test-images.js`
define the amount of images you want to download
iterate, download, save

## pinata.cloud
go to pinata.cloud website
create an account
create api keys

## store api keys
create .env file

## generate assets.json
`node src/generate-initial-assets-json.js`
create a script that will generate a assets.json

## or go ahead and define one yourself
- all metadata for the asset with the image src on local file system

## extend metadata.json with thumbnails
`node src/generate-thumbnails.js`
generate thumbnails based on images from the metadata.json
give them same name with `_thumbnail`

## upload data to ipfs
`node src/pin-images-to-ipfs.js`
create pin-to-ipfs.js
iterate over each item in metadata.json and:
    - pin the original image to ipfs
    - pin the thumbnail to ipfs
    - store the reference to both src and image on ipfs in metadata.json 

## mint transaction
`node src/mint-multiple-assets.js`
- build mint transaction with metadata.json
- calc fee
- rebuild
- sign
- submit

## send assets back to wallet
`node src/send-multiple-assets-back-to-wallet.js`
