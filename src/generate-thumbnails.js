const fs = require('fs').promises
const sharp = require("sharp")

const generateThumbnail = (filePath, data) => new Promise(resolve => {

    sharp(data)
        .resize(200)
        .toFile(filePath, resolve);
})


const assets = require("./assets.json")

async function main() {

    await Promise.all(
        assets.map(async asset => {

            const data = await fs.readFile(__dirname + "/" + asset.src)

            await generateThumbnail(__dirname + "/" + asset.image, data)
            console.log(`[${asset.name}] thumbnail generated at "${asset.image}"`)
        })
    )
}

main()

