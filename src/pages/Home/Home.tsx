import { useEffect, useState } from 'react'
import { ethConnect } from 'utils/web3_api'
import config from 'utils/config'

interface Props {
}

const Home = (props: Props) => {
  const [ metamaskAccount, setMetamaskAccount ] = useState('')
  const [ web3, setWeb3 ] = useState<any>(null)
  const [ balance, setBalance ] = useState(0)

  useEffect(() => {
    console.log(config)
  }, [])

  const connectMetamask = async (e: any) => {
    const web3Res = await ethConnect()
    if (web3Res) {
      console.log(web3Res)
      setWeb3(web3Res)
      web3Res.eth.getAccounts().then((res: any) => setMetamaskAccount(res?.[0]))
    }
  }

  const getBalance = async (e: any) => {
    const _balance = await web3.eth.getBalance(metamaskAccount)
    setBalance(web3.utils.fromWei(_balance, 'ether'))
  }

  return (
    <div className='home-page'>
      <h1 className='text-center'>NFT Minting Demo</h1>
      <div className="text-center mt-4">
        <button type='button' className='btn btn-primary' onClick={connectMetamask}>Connect Metamask</button>
        {!web3 && (
          <div className="m-1">
            Please install <a href='https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en' target='_blank'>Metamask</a>
          </div>
        )}
        {
          web3 && (
            <div className="m-1">
              Account: {metamaskAccount}
            </div>
          )
        }
      </div>
      <div className="text-center mt-4">
        <button type='button' className='btn btn-success' onClick={getBalance} disabled={!metamaskAccount}>Get balance</button>
        <div className="m-1">
          Account: {balance}
        </div>
      </div>
    </div>
  )
}

export default Home
