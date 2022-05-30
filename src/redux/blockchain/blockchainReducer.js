const initialState = {
  loading: false,
  account: null,
  smartContract: null,
  web3: null,
  errorMsg: "",
};

const blockchainReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CONNECTION_REQUEST":
      return {
        ...state,
        loading: true,
      };
    case "SET_RUFFLE":
      return {
        ...initialState,
        isRuffle: action.payload.isRuffle,
      };
    case "CONNECTION_SUCCESS":
      return {
        ...state,
        loading: false,
        account: action.payload.account,
        smartContract: action.payload.smartContract,
        web3: action.payload.web3,
        canMint: action.payload.canMint,
      };
    case "CONNECTION_FAILED":
      return {
        ...initialState,
        loading: false,
        errorMsg: action.payload,
      };
    case "REGISTER_SUCCESS":
      return {
        ...state,
        loading: false,
        registerMessage: action.payload,
      };
    case "REGISTER_FAILED":
      return {
        ...state,
        loading: false,
        registerMessage: action.payload
      };
    case "UPDATE_ACCOUNT":
      return {
        ...state,
        account: action.payload.account,
      };
    default:
      return state;
  }
};

export default blockchainReducer;
