# Intro Script..

### Brief introduction.. tell the audience a welcoming greeting like "welcome to another ADA-Pi youtube tutorial", tell them your name and how to contact you (website or join discord). Let them know to like, suscribe, and hit that notification bell so they can be reminded whenever we release more tutorials for stake pool operation and developing on Cardano. 

### This is the second tutorial in our NFT series done by us here at ADA-Pi. Give them a brief intro into the topic "making a NFT collection on Cardano"

### Let them know this is not meant for "beginners" but almost anyone with a bit of coding/programming knowledge and can run a cardano node and use the cli can reproduce. And if they have not yet watched our first video we recommend to watch that and complete the gitbook tutorial. (I will put link for our first video in somewhere in the top right corner of this video). You can even say we assume you have completed the "basic env setup and downloaded/install needed packages" if you want. I mean we should not really go over the initial set up very much just the cloning of the repo with the new code.



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
Brief explaination why we didnt use blockfrost
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


## Before you mint transaction

### Speak about the various minting policies. https://docs.cardano.org/projects/cardano-node/en/latest/reference/simple-scripts.html#Step-1---construct-the-tx-body Let them know the difference in your NFTs if you use a time-locked policy vs open policy like we used in prev video. 
Time-Lock- this ensures your NFT remains a NFT, but can't do anything once the slot has passed..Maybe explain the downside of this policy (for example you dont give your self enough time to mint/burn tokens so if there was an issue you can't do anything about it once the time has passed).
Explain how to time lock a policy in your tutorial (before slot), and advise to publish both the policy id and script in a place easily found by users for example in your github repo or website like how spacebudz did it ( you can just show them spacebudz github and then the site to show what we mean).


## mint transaction
`node src/mint-multiple-assets.js`
- build mint transaction with metadata.json
- calc fee ( let them know they have to do this everytime and it may vary on price depending on a few factors)
- rebuild
- sign
- submit

## send assets back to wallet
`node src/send-multiple-assets-back-to-wallet.js`


# Outro Script...

### Tell them thanks for watching, and if they like the tutorials to please Delegate to our Pools {BERRY, PIADA, SBLYR} links will be in description
### If you would like to find out more about this project and speak with us please contact us.. (Links in description and will be in the about section.
### Stay tuned for the next video 
