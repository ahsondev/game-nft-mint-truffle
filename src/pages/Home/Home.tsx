import { useEffect, useState } from 'react'
import { ethConnect } from 'utils/web3_api'
import config from 'utils/config'

interface Props {
}

const Home = (props: Props) => {
  const [ metamaskAccount, setMetamaskAccount ] = useState('')
  const [ price, setPrice ] = useState(0)
  const [ soldCount, setSoldCount ] = useState(0)
  const [ remainingCount, setRemainingCount ] = useState(0)
  const [ contractBalance, setContractBalance ] = useState(0)
  const [ web3, setWeb3 ] = useState<any>(null)
  const [ accountBalance, setAccountBalance ] = useState(0)

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

  const getAccountBalance = async (e: any) => {
    const _balance = await web3.eth.getBalance(metamaskAccount)
    setAccountBalance(web3.utils.fromWei(_balance, 'ether'))
  }

  const getPrice = (e: any) => {}

  const getSold = (e: any) => {}

  const getRemaining = (e: any) => {}

  const getContractBalance = (e: any) => {}

  const setMint = (e: any) => {}

  return (
    <div className='home-page'>
      <h1 className='text-center'>NFT Minting Demo</h1>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '20px',
        padding: '0 40px'
      }}>
        <div className="d-flex flex-column">
          <button type='button' className='d-block btn btn-primary' onClick={connectMetamask}>Connect Metamask</button>
          <div className="btn btn-secondary">
            {!web3 && (
              <>
                Please install <a href='https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en' target='_blank'>Metamask</a>
              </>
            )}
            {web3 && (
              <>Account: {metamaskAccount}</>
            )}
          </div>
        </div>
        <div className="d-flex flex-column">
          <button type='button' className='btn btn-success' onClick={getAccountBalance} disabled={!metamaskAccount}>Account balance</button>
          <div className="btn btn-secondary">
            {accountBalance}
          </div>
        </div>
        <div className="d-flex flex-column">
          <button type='button' className='btn btn-success' onClick={getPrice} disabled={!metamaskAccount}>Price</button>
          <div className="btn btn-secondary">
            {price}
          </div>
        </div>
        <div className="d-flex flex-column">
          <button type='button' className='btn btn-success' onClick={getSold} disabled={!metamaskAccount}>Sold</button>
          <div className="btn btn-secondary">
            {soldCount}
          </div>
        </div>
        <div className="d-flex flex-column">
          <button type='button' className='btn btn-success' onClick={getRemaining} disabled={!metamaskAccount}>Remaining</button>
          <div className="btn btn-secondary">
            {remainingCount}
          </div>
        </div>
        <div className="d-flex flex-column">
          <button type='button' className='btn btn-success' onClick={getContractBalance} disabled={!metamaskAccount}>Contract Balance</button>
          <div className="btn btn-secondary">
            {contractBalance}
          </div>
        </div>
      </div>
      <div className="text-center mt-4 d-flex justify-content-center">
        <button type='button' className='btn btn-dark w-50 py-2' onClick={setMint} disabled={!metamaskAccount}>
          Mint random
        </button>
      </div>
    </div>
  )
}

export default Home
