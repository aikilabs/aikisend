import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    address: "",
    chainId: 0,
    walletConnected: false,
    availableTokens: [],
    selectedToken: [],
    approvedToken: [],
};

export const aikiSend = createSlice({
    name: "AikiSend",
    initialState,
    reducers: {
        addUserAddress: (state, action) => {
            state.address = action.payload;
        },
        setChainId: (state, action) => {
            state.chainId = action.payload;
        },
        changeWalletConnectionState: (state, action) => {
            state.walletConnected = action.payload;
        },
        setAllAvailableTokens: (state, action) => {
            state.availableTokens = action.payload;
        },
        setSelectedToken: (state, action) => {
            state.selectedToken = action.payload;
        },
        setApprovedToken: (state, action) => {
            state.approvedToken = action.payload;
        },
    },
});

// Action creators are generated for each case reducer function
export const {
    addUserAddress,
    changeWalletConnectionState,
    setAllAvailableTokens,
    setSelectedToken,
    setApprovedToken,
    setChainId,
} = aikiSend.actions;

export default aikiSend.reducer;
