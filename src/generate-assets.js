const times = require("lodash/times")
const random = require("lodash/random")
const axios = require("axios")
const fs = require('fs').promises
const sharp = require("sharp")
const pinToIpfs = require("./pin-to-ipfs")

const generateThumbnail = (filePath, data) => new Promise(resolve => {

    sharp(data)
        .resize(200, 200)
        .toFile(filePath, resolve);
})


async function main() {

    const assets = await Promise.all(
        times(15).map(async i => {

            const asset = {
                id: `PIADA${i}`,
                name: `PIADA Logo #${i}`,
                authors: ["PIADA", "SBLYR"]
            }

            const { data } = await axios.request(`https://source.unsplash.com/800x800?cat&v=${random()}`, { responseType: 'arraybuffer' })
            console.log(`[${asset.id}] downloaded image`)

            const src_filePath = __dirname + `/images/${asset.id}.jpeg`
            const image_filePath = __dirname + `/images/${asset.id}_thumbnail.jpeg`

            await fs.writeFile(src_filePath, data)
            console.log(`[${asset.id}] image saved`)

            await generateThumbnail(image_filePath, data)
            console.log(`[${asset.id}] thumbnail generated`)

            asset.image = await pinToIpfs(image_filePath)
            console.log(`[${asset.id}] thumbnail (image) stored on ipfs`)

            asset.src = await pinToIpfs(src_filePath)
            console.log(`[${asset.id}] image (src) stored on ipfs`)

            return asset
        })
    )

    await fs.writeFile(__dirname + '/metadata.json', JSON.stringify(assets, null, 2))

    console.log(`Done. ✅`)

    console.log(
        JSON.stringify(
            assets,
            null,
            2
        )
    )
}

main()

