const dotenv = require("dotenv")
dotenv.config()
const axios = require('axios')
const FormData = require('form-data')
const fs = require("fs")

const pinata = axios.create({
    baseURL: 'https://api.pinata.cloud',
    headers: {
        pinata_api_key: process.env.PINATA_API_KEY,
        pinata_secret_api_key: process.env.PINATA_API_SECRET
    }
})

module.exports = async (filePath) => {

    //we gather a local file for this example, but any valid readStream source will work here.
    let data = new FormData();
    data.append('file', fs.createReadStream(filePath));

    //You'll need to make sure that the metadata is in the form of a JSON object that's been convered to a string
    //metadata is optional
    const metadata = JSON.stringify({
        name: 'PIADA0',
        keyvalues: {
            PI: 'ADA'
        }
    });

    data.append('pinataMetadata', metadata);

    //pinataOptions are optional
    const pinataOptions = JSON.stringify({
        cidVersion: 0,
        customPinPolicy: {
            regions: [
                {
                    id: 'FRA1',
                    desiredReplicationCount: 1
                },
                {
                    id: 'NYC1',
                    desiredReplicationCount: 2
                }
            ]
        }
    });

    data.append('pinataOptions', pinataOptions);

    const response = await pinata
        .post('/pinning/pinFileToIPFS', data, {
            maxBodyLength: 'Infinity', //this is needed to prevent axios from erroring out with large files
            headers: {
                'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
            }
        }).catch(e => {
            console.log(e.response.error)
        })

    return `ipfs://${response.data.IpfsHash}`
}