// constants
import Web3 from "web3"
import axios from "axios"
import SmartContract from "../../contracts/M3taMoguls.json"
// log
import { fetchData } from "../data/dataActions"

const connectRequest = () => {
  return {
    type: "CONNECTION_REQUEST",
  }
}

const setRuffle = isRuffle => {
  return {
    type: "SET_RUFFLE",
    payload: isRuffle,
  }
}

const registerSuccess = payload => {
  return {
    type: "REGISTER_SUCCESS",
    payload: payload,
  }
}

const registerFailed = payload => {
  return {
    type: "REGISTER_FAILED",
    payload: payload,
  }
}

const connectSuccess = payload => {
  return {
    type: "CONNECTION_SUCCESS",
    payload: payload,
  }
}

const connectFailed = payload => {
  return {
    type: "CONNECTION_FAILED",
    payload: payload,
  }
}

const updateAccountRequest = payload => {
  return {
    type: "UPDATE_ACCOUNT",
    payload: payload,
  }
}

export const connect = (register = true) => {
  return async dispatch => {
    dispatch(connectRequest())
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum)

      try {
        await window.ethereum.enable()
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        })
        const networkId = await window.ethereum.request({
          method: "net_version",
        })
        //const NetworkData = await SmartContract.networks[networkId];
        if (networkId === "1" || networkId === 1) {
          const address = "0x7a98d0c96A35Bde4Bb643ba83c5E9A19FBaE2234"
          const account = accounts[0]

          const SmartContractObj = new web3.eth.Contract(
            SmartContract.abi,
            address
          )

          if (register) {
            web3.eth.getBalance(account, async (err, result) => {
              const amount = web3.utils.fromWei(result, "ether")
              const body = { address: account, amount: amount }
              const response = await axios.post(
                "https://raffle.m3tamoguls.com/",
                body
              )
              if (response.data.success) {
                dispatch(registerSuccess("Register success"))
              } else {
                dispatch(registerFailed("Sorry you are already registered"))
              }
            })
          } else {
            const response = await axios.post(
              "https://raffle.m3tamoguls.com/",
              { address: account }
            )

            const data = response.data

            const actionPayload = {
              account,
              web3,
              smartContract: SmartContractObj,
              canMint: data.success,
              isRuffle: true,
            }

            dispatch(connectSuccess(actionPayload))
          }
          // Add listeners start
          window.ethereum.on("accountsChanged", accounts => {
            dispatch(updateAccount(accounts[0]))
          })
          window.ethereum.on("chainChanged", () => {
            window.location.reload()
          })
        } else {
          dispatch(connectFailed("Change network to ETH."))
        }
      } catch (err) {
        dispatch(connectFailed("Something went wrong."))
      }
    } else {
      dispatch(connectFailed("Install Metamask."))
    }
  }
}

export const updateAccount = account => {
  return async dispatch => {
    dispatch(updateAccountRequest({ account: account }))
    dispatch(fetchData(account))
  }
}

export const checkRuffle = () => {
  return async dispatch => {
    const response = await axios.post(
      "https://raffle.m3tamoguls.com/?checkRuffle=true",
      { checkRuffle: true }
    )
    const ruffle = response.data.ruffle
    dispatch(setRuffle({ isRuffle: ruffle }))
  }
}
