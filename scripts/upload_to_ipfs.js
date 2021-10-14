const axios = require('axios')
const fs = require('fs')
const FormData = require('form-data')
const recursive = require('recursive-fs')
const basePathConverter = require('base-path-converter')
const path = require('path')
const rimraf = require('rimraf')
require('dotenv').config()

const assetsDir = './metadata/assets'
const tempMetaDir = './metadata/temp'
const fileIpfsUrl = 'https://api.pinata.cloud/pinning/pinFileToIPFS'
const gatewayBaseUrl = 'https://gateway.pinata.cloud/ipfs/'
const metadataFile = '../metadata/mono_metadata.json'
let gatewayUrl = ''
let assetCount = 0
let tokenCount = 0
let assetsHash = ''
let metadataHash = ''
let contractUriHash = ''

const api = axios.create({
  headers: {
    common: {
      pinata_api_key: process.env.PINATA_API_KEY,
      pinata_secret_api_key: process.env.PINATA_API_SECRET,
    },
  },
})

const uploadAssets = () => new Promise((resolve, reject) => {
  assetCount = 0
  recursive.readdirr(assetsDir, (err, dirs, files) => {
    const data = new FormData()
    files.forEach((file) => {
      assetCount += 1
      data.append(`file`, fs.createReadStream(file), {
        filepath: basePathConverter(assetsDir, file),
      })
    })

    api.post(fileIpfsUrl, data, {
      maxContentLength: 'Infinity',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
      },
    }).then(res => resolve(res), err => reject(err))
  })
})

const uploadMetadata = () => new Promise((resolve, reject) => {
  const tokensDir = tempMetaDir + '/tokens'
  const jsonData = require(metadataFile).metadata

  // Delete all files in tempMetaDir
  rimraf.sync(tempMetaDir)

  // recreate directory
  fs.mkdirSync(tempMetaDir, { recursive: true })
  fs.mkdirSync(tokensDir, { recursive: true })

  // upload each metadata to a specific json file
  jsonData.forEach((metadata) => {
    tokenCount += 1
    metadata.image = gatewayUrl + '/' + metadata.image
    metadata.external_url = metadata.image

    const filename = tokensDir + '/' + metadata.id
    const st = JSON.stringify(metadata, null, 2)
    fs.writeFileSync(filename, st)
  })

  recursive.readdirr(tokensDir, (err, dirs, files) => {
    let data = new FormData()
    files.forEach((file) => {
      data.append(`file`, fs.createReadStream(file), {
        filepath: basePathConverter(tokensDir, file),
      })
    })

    api.post(fileIpfsUrl, data, {
      maxContentLength: 'Infinity',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${data._boundary}`
      },
    }).then(res => resolve(res), err => reject(err))
  })
})

const uploadContractUri = () => new Promise((resolve, reject) => {
  const contractUriFile = tempMetaDir + '/contracturi.json'
  const contractUri = require(metadataFile).contractUri

  contractUri.image = gatewayUrl + '/' + contractUri.image

  const st = JSON.stringify(contractUri, null, 2)
  fs.writeFileSync(contractUriFile, st)

  const data = new FormData()
  data.append(`file`, fs.createReadStream(contractUriFile))

  api.post(fileIpfsUrl, data, {
    maxContentLength: 'Infinity',
    headers: {
      'Content-Type': `multipart/form-data; boundary=${data._boundary}`
    },
  }).then(res => resolve(res), err => reject(err))
})

const deploy = async () => {
  // upload metadata/assets to ipfs
  const res1 = await uploadAssets()
  assetsHash = res1.data.IpfsHash
  gatewayUrl = gatewayBaseUrl + assetsHash

  // 1. distribute metadata/mono_metadata.json's metadata to metadata/temp/tokens/metadata.id
  // 2. upload distributed files to ipfs
  const res2 = await uploadMetadata()
  metadataHash = res2.data.IpfsHash

  // upload contracturi.json to ipfs
  const res3 = await uploadContractUri()
  contractUriHash = res3.data.IpfsHash

  const configFile = tempMetaDir + "/ERC721Config.json";
  const metadataConfig = {
    "gatewayUrl": gatewayBaseUrl,
    "metadataHash": metadataHash,
    "imagesHash": assetsHash,
    "contractUriHash": contractUriHash,
    "tokenAmount": assetCount
  }

  const st = JSON.stringify(metadataConfig, null, 2);
  fs.writeFileSync(configFile, st);
}

deploy()
