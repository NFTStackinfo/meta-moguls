import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchData } from "./redux/data/dataActions"
import { checkRuffle, connect } from "./redux/blockchain/blockchainActions"
import Countdown from "react-countdown"
import { isAndroid, isIOS } from "react-device-detect"
import addressList from "./data"
import "./style/app.scss"

const { MerkleTree } = require("merkletreejs")
const keccak256 = require("keccak256")

const errorMessages = ["Change network to ETH.", "Something went wrong."]
const metamaskError = "Install Metamask."

const fixImpreciseNumber = number => {
  return parseFloat(number.toPrecision(12))
}

const truncateText = text => {
  return (
    text.substring(0, 5) + "...." + text.substring(text.length - 4, text.length)
  )
}

const App = () => {
  const dispatch = useDispatch()
  const blockchain = useSelector(state => state.blockchain)
  const data = useSelector(state => state.data)
  const [mintPrice, setMintPrice] = useState(null)
  const [mintCount, setMintCount] = useState(1)
  const [maxMintCount, setMaxMintCount] = useState(null)
  const [maxTotalSupply, setMaxTotalSupply] = useState(null)
  const [totalSupply, setTotalSupply] = useState(null)
  const [connectingMobile, setConnectingMobile] = useState(false)
  const [walletConnected, setWalletConnected] = useState(false)
  const [fallback, setFallback] = useState("")
  const [notSelected, setNotSelected] = useState(null)
  const [loading, setLoading] = useState(false)

  const minMintCount = 1

  // uncomment if you need static maxMintCount
  // const maxMintCount = 10
  // const maxTotalSupply = 13

  // const maxTotalSupply = 650
  // const maxTotalSupply = 1000
  // const maxTotalSupply = 1500

  useEffect(() => {
    dispatch(checkRuffle())
  }, [])

  useEffect(async () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account))
      if (blockchain.account) {
        const isMintActive = await blockchain.smartContract.methods
        .isMintActive()
        .call()
        const isRaffleActive1 = await blockchain.smartContract.methods
        .isRaffleActive1().call()
        const isRaffleActive2 = await blockchain.smartContract.methods
        .isRaffleActive2().call()
        const isRaffleActive3 = await blockchain.smartContract.methods
        .isRaffleActive3().call()
        const price = isMintActive
            ?  await blockchain.smartContract.methods.mintPrice().call() / 10 ** 18
            : await blockchain.smartContract.methods.raffleMintPrice().call() / 10 ** 18
        setMintPrice(price)

        if(isMintActive) {
          setMaxMintCount(await blockchain.smartContract.methods
          .maximumAllowedTokensPerWallet.call())
          const maximumMintSupply = await blockchain?.smartContract?.methods.maximumMintSupply().call()
          setMaxTotalSupply(+maximumMintSupply)
        }
        if(isRaffleActive1) {
          const raffleMaxMint1 = await blockchain.smartContract.methods
          .raffleMaxMint1().call()
          const raffleBreakPoint1 = await blockchain?.smartContract?.methods.raffleBreakPoint1().call()
          setMaxMintCount(+raffleMaxMint1)
          setMaxTotalSupply(+raffleBreakPoint1)
        }
        if(isRaffleActive2) {
          const raffleMaxMint2 = await blockchain.smartContract.methods
          .raffleMaxMint2().call()
          const raffleBreakPoint2 = await blockchain?.smartContract?.methods.raffleBreakPoint2().call()
          setMaxMintCount(+raffleMaxMint2)
          setMaxTotalSupply(+raffleBreakPoint2)
        }
        if(isRaffleActive3) {
          const raffleMaxMint3 = await blockchain.smartContract.methods
          .raffleMaxMint3().call()
          const raffleBreakPoint3 = await blockchain?.smartContract?.methods.raffleBreakPoint3().call()
          setMaxMintCount(+raffleMaxMint3)
          setMaxTotalSupply(+raffleBreakPoint3)
        }

        const getTotalSupply = await blockchain?.smartContract?.methods
          .getTotalSupply()
          .call()


        /**/
        // setMaxMintCount(await blockchain?.smartContract?.methods.allowListMaxMint().call())

        setTotalSupply(Number(getTotalSupply))

        if (totalSupply > maxTotalSupply) {
          return setFallback("No more NFTs are left to mint for this stage.")
        }
        const root = await blockchain?.smartContract?.methods.getRoot().call()
        let tree

        const createMerkleTree = () => {
          const leaves = addressList.map(v => keccak256(v))
          tree = new MerkleTree(leaves, keccak256, { sort: true })

        }

        const getRoot = () => {
          return tree.getHexRoot()
        }

        setWalletConnected(true)

        createMerkleTree()
        const localRoot = getRoot()
        const account = await blockchain.account

        console.log({localRoot});
        console.log({root});
        if (root === localRoot && addressList.includes(account)) {
          setNotSelected(false)
        } else {
          setNotSelected(true)
        }


        console.log({isMintActive});
        console.log({isRaffleActive1});
        console.log({isRaffleActive2});
        console.log({isRaffleActive3});
        console.log({maxTotalSupply});
        console.log({totalSupply});
        console.log({maxMintCount});
      }
    }
  }, [blockchain.smartContract, totalSupply, dispatch])

  useEffect(() => {
    setConnectingMobile(true)

    setFallback("")
    if (blockchain.errorMsg && errorMessages.includes(blockchain.errorMsg)) {
      setFallback(blockchain.errorMsg)
    }
    if (blockchain.errorMsg === metamaskError && !(isIOS || isAndroid)) {
      window.location.replace(
        "https://metamask.app.link/dapp/racing-social-club.netlify.com/"
      )
    }
  }, [blockchain.errorMsg])

  const openMobileMetamask = () => {
    if (typeof window.ethereum === "undefined") {
      if (
        (connectingMobile && !walletConnected && (isIOS || isAndroid)) ||
        blockchain.errorMsg === metamaskError
      ) {
        window.location.replace(
          "https://metamask.app.link/dapp/racing-social-club.netlify.com/"
        )
      }
    }
  }

  const normalizeMintCount = count =>
    count > maxMintCount
      ? maxMintCount
      : count < minMintCount
      ? minMintCount
      : count

  const handleConnectWallet = async () => {
    dispatch(connect(false))
    openMobileMetamask()
  }

  const claimNFTs = async _amount => {
    setLoading(true)
    let tree

    const createMerkleTree = () => {
      const leaves = addressList.map(v => keccak256(v))
      tree = new MerkleTree(leaves, keccak256, { sort: true })
    }

    const getProof = address => {
      const leaf = keccak256(address)
      return tree.getHexProof(leaf)
    }

    createMerkleTree()

    const isMintActive = await blockchain.smartContract.methods
      .isMintActive()
      .call()
    const isRaffleActive1 = await blockchain.smartContract.methods
      .isRaffleActive1().call()
    const isRaffleActive2 = await blockchain.smartContract.methods
      .isRaffleActive2().call()
    const isRaffleActive3 = await blockchain.smartContract.methods
      .isRaffleActive3().call()
    const mint = isMintActive
      ? await blockchain.smartContract.methods.mint(blockchain.account, _amount)
      : (isRaffleActive1 || isRaffleActive2 || isRaffleActive3)
      ? await blockchain.smartContract.methods.raffleMint(
          _amount,
          getProof(blockchain.account)
        )
      : null

    if (mint) {
      const balance = await blockchain.web3.eth.getBalance(
        blockchain.account,
        async (err, result) => {
          return blockchain.web3.utils.fromWei(result, "ether")
        }
      )
      const roundedBalance = balance / 10 ** 18
      if (roundedBalance < fixImpreciseNumber(_amount * mintPrice)) {
        setLoading(false)
        return setFallback(
          `You don’t have enough funds to mint! Please, make sure to have ${fixImpreciseNumber(
            _amount * mintPrice
          )} ETH + gas.`
        )
      }
      if (roundedBalance) setLoading(false)
      mint
        .send({
          from: blockchain.account,
          value: blockchain.web3.utils.toWei(
            fixImpreciseNumber(mintPrice * _amount).toString(),
            "ether"
          ),
        })
        .once("error", err => {
          if (err.code === -32000 || err.code === "-32000") {
            setFallback(
              "Insufficient funds, please add funds to your wallet and try again"
            )
          } else {
            setFallback("Sorry, something went wrong please try again")
          }
        })
        .then(receipt => {
          // setTotalSupply(blockchain?.smartContract?.methods.getTotalSupply().call())
          setFallback("You have successfully minted your NFT/s.")
        })
    } else {
      setLoading(false)
      setFallback("The mint is not open yet.")
    }
  }

  const handleMint = (e, count) => {
    e.preventDefault()
    setFallback("")
    claimNFTs(count)
  }

  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return (
        <>
          {walletConnected && notSelected ? (
            <>
              {/*connect failed*/}
              <div className="content">
                <p className="text uppercase">
                  You have not been selected for the mint.
                </p>
              </div>
            </>
          ) : walletConnected &&
            notSelected === false &&
            totalSupply <= maxTotalSupply ? (
            <>
              {/*mint*/}

              <p className="small-text main-text uppercase">
                Congrats! You have been selected for the Raffle.
              </p>
              <div className="content-sm">
                <div className="grid">
                  <button
                    className="glow-block button-big grid-item"
                    onClick={() => setMintCount(1)}
                  >
                    <img src="assets/1.png" alt="1" />
                  </button>
                  <button
                    disabled={2 + totalSupply >= maxTotalSupply}
                    className="glow-block button-big grid-item"
                    onClick={() => setMintCount(2)}
                  >
                    <img src="assets/2.png" alt="2" />
                  </button>
                  <button
                      disabled={(maxMintCount < 3) || (3 + totalSupply >= maxTotalSupply)}
                    className='glow-block button-big grid-item'
                    onClick={() => setMintCount(3)}
                  >
                    <img src="assets/3.png" alt="3" />
                  </button>
                </div>
                <div className="row glow-block">
                  <div>custom</div>
                  <div className="counter">
                    <button
                      onClick={() =>
                        setMintCount(normalizeMintCount(mintCount - 1))
                      }
                      disabled={mintCount === minMintCount}
                    >
                      <img src="assets/minus.svg" alt="" />
                    </button>
                    <span>{mintCount}</span>
                    <button
                      onClick={() =>
                        setMintCount(normalizeMintCount(mintCount + 1))
                      }
                      disabled={mintCount === maxMintCount ||
                          mintCount + totalSupply >= maxTotalSupply}
                    >
                      <img src="assets/plus.svg" alt="" />
                    </button>
                  </div>
                </div>
                <div className="row glow-block">
                  <div>TOTAL</div>
                  <div>
                    {mintCount} NFT ={" "}
                    {fixImpreciseNumber(mintCount * mintPrice)} ETH
                  </div>
                </div>
                <div className="button-wrapper">
                  <button
                    className="button"
                    onClick={e => handleMint(e, mintCount)}
                  >
                    mint now
                  </button>
                </div>
                <p className="small-text">
                  wallet address - {truncateText(blockchain.account)}
                </p>
              </div>
            </>
          ) : (
            <>
              {/*connect*/}
              <div className="content content-sm">
                <div className="grid pointer-none">
                  <div className="glow-block button-big grid-item">
                    <img src="assets/1.png" alt="1" />
                  </div>
                  <div className="glow-block button-big grid-item">
                    <img src="assets/2.png" alt="2" />
                  </div>
                  <div className="glow-block button-big grid-item">
                    <img src="assets/3.png" alt="3" />
                  </div>
                </div>
                <div className="row glow-block pointer-none">
                  <div>custom</div>
                  <div className="counter">
                    <button>
                      <img src="assets/minus.svg" alt="" />
                    </button>
                    <span>{mintCount}</span>
                    <button>
                      <img src="assets/plus.svg" alt="" />
                    </button>
                  </div>
                </div>
                <div className="row glow-block pointer-none">
                  <div>TOTAL</div>
                  <div>1 NFT = - ETH</div>
                </div>
                <div className="button-wrapper">
                  <button className="button" onClick={handleConnectWallet}>
                    connect
                  </button>
                  {fallback && <p className="warn-text">{fallback}</p>}
                </div>
              </div>
            </>
          )}
        </>
      )
    } else {
      // Render a countdown
      return (
        <div>
          {blockchain.registerMessage ? (
            <>
              {/*success*/}
              <div className="content">
                <h1 className="title">REGISTERED SUCCESSFULLY</h1>
                <p className="text main-text">
                  Check back in {days} days {hours} hours {minutes} minutes{" "}
                  {seconds} seconds to see if you were selected to mint.
                </p>
              </div>
            </>
          ) : (
            <>
              {/*register*/}
              <div className="content">
                <h1 className="title">RAFFLE REGISTRATION</h1>
                <p className="text main-text">
                  The registration is free and registering is only available
                  with metamask wallet. <br /> Registration period ends in{" "}
                  {days} days {hours} hours {minutes} minutes {seconds} seconds.
                </p>
                <div className="button-wrapper">
                  <button
                    className="button"
                    onClick={e => {
                      e.preventDefault()
                      dispatch(connect(true))
                      openMobileMetamask()
                    }}
                  >
                    Register
                  </button>
                  {fallback && <p className="warn-text">{fallback}</p>}
                </div>
              </div>
            </>
          )}
        </div>
      )
    }
  }

  return (
    <div className="app">
      <div className="container">
        <div className="wrapper">
          <div className="logo">
            <img src="logo.png" alt="Meta Moguls logo" />
          </div>
          <div className="logo-text">
            <img src="logo-text.svg" alt="Meta Moguls" />
          </div>

          <Countdown
              // date={"2022-05-31T20:27:05"}
              date={1654092307000}
              renderer={renderer}
          />
        </div>
      </div>
    </div>
  )
}

export default App
