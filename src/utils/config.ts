import env from 'dotenv-flow'


const config = {
  ...env.config().parsed,
  rpcUrl: 'https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
  appID: 'NFT',
  apiUrl: 'https://api.example.com',
}

export const actionTypes = {
  SAMPLE_ACTION: 'SAMPLE_ACTION'
}

export default config
