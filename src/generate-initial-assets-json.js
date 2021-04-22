/**
 * This script is responsible for generating the initial
 * assets.json that can later be adjusted to fit your
 * specific needs.
 * 
 * You can define:
 * 1. amount of assets
 * 2. whether you want to start counting the collection at 0 or 1
 * 3. what the mimetype is (jpeg, png, gif)
 */

const times = require("lodash/times")
const fs = require('fs').promises

const AMOUNT_OF_ASSETS = 2
const START_WITH_ZERO = true
const MIME_TYPE = 'image/png'

async function main() {

    const assets = await Promise.all(
        times(AMOUNT_OF_ASSETS).map(async i => {

            const number = START_WITH_ZERO ? i : i + 1

            const id = `PIADA${number}`
            const [extension] = MIME_TYPE.split("/").reverse()

            return {
                id,
                name: `PIADA #${number}`,
                // description: "",
                image: `images/${id}_thumbnail.${extension}`,
                src: `images/${id}.${extension}`,
                type: MIME_TYPE,
                // add whatever you want below
                authors: ["PIADA", "SBLYR"],
                website: "https://ada-pi.io"
            }
        })
    )

    await fs.writeFile(__dirname + '/assets.json', JSON.stringify(assets, null, 2))
}

main()

