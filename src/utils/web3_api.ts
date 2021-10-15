import Web3 from 'web3'

const wnd = window as any

export const ethConnect = async () => {
  if (wnd.ethereum) {
    try {
      await wnd.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x3' }],
      });
    } catch (switchError: any) {
    }

    await wnd.ethereum.send('eth_requestAccounts')
    const web3 = new Web3(Web3.givenProvider)
    return web3
  }
  return null
}

