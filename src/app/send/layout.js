"use client";
import React, { useEffect, useState } from "react";
import { useAccount, useNetwork } from "wagmi";
import { useWeb3Modal } from "@web3modal/react";
import { useSelector, useDispatch } from "react-redux";
import {
    addUserAddress,
    changeWalletConnectionState,
    setAllAvailableTokens,
    setChainId,
} from "@/redux/aikiSend";
const Moralis = require("moralis").default;
const { EvmChain } = require("@moralisweb3/common-evm-utils");

const Layout = ({ children }) => {
    const [network, setNetwork] = useState("");
    const { isConnected, address } = useAccount();
    const dispatch = useDispatch();
    const walletConnected = useSelector(
        (state) => state.aikiSend.walletConnected
    );
    const { chain: networkChain, chains: networkChains } = useNetwork();
    useEffect(() => {
        if (isConnected) {
            // refresh the page when the chain changes
            // window.location.reload();
            switch (networkChain.network) {
                case "arbitrum-goerli": {
                    setNetwork("ARBITRUM_TESTNET");
                    break;
                }
                case "avalanche-fuji": {
                    setNetwork("AVALANCHE_TESTNET");
                    break;
                }
                case "bsc-testnet": {
                    setNetwork("BSC_TESTNET");
                    break;
                }
                case "fantom-testnet": {
                    setNetwork("FANTOM_TESTNET");
                    break;
                }
                case "maticmum": {
                    setNetwork("MUMBAI");
                    break;
                }
                case "matic": {
                    setNetwork("POLYGON");
                    break;
                }
                case "homestead": {
                    setNetwork("ETHEREUM");
                    break;
                }
                default: {
                    setNetwork(networkChain.network.toUpperCase());
                }
            }
        }
    }, [networkChain]);

    const setTokens = async () => {
        let chain = EvmChain[network];

        console.log(chain);

        if (network) {
            try {
                const response =
                    await Moralis.EvmApi.token.getWalletTokenBalances({
                        address,
                        chain,
                    });

                dispatch(setAllAvailableTokens(response.toJSON()));
                dispatch(setChainId(chain._chainlistData.chainId));
                // console.log(response.toJSON());
            } catch (error) {
                console.log(error);
            }
        }
    };

    useEffect(() => {
        dispatch(changeWalletConnectionState(isConnected));
        dispatch(addUserAddress(address || ""));
        if (address) {
            setTokens();
        }
    }, [isConnected, network]);

    const { open, close } = useWeb3Modal();

    return (
        <main className="flex h-full flex-col">
            <nav className="md:px-24 px-4 pt-8 pb-2 flex justify-between items-center">
                <h1 className="font-extrabold text-lg md:text-3xl">AIKISEND</h1>
                <div className="flex items-center gap-x-4">
                    <h2 className="text-sm md:text-lg font-normal italic text-blue-500">
                        {network ? `${network} Network` : ""}
                    </h2>
                    <button
                        onClick={() => open()}
                        className={` text-sm md:text-lg  shadow-neo-brutalism-sm border-[3px] border-black px-2 py-0.5 md:px-3 md:py-1 rounded-lg transition-all duration-100 active:shadow-none active:scale-100 active:translate-x-1 active:translate-y-1 ${
                            walletConnected
                                ? "text-black font-extrabold font-sans tracking-[0.3em]"
                                : "bg-blue-500 text-white  font-semibold tracking-[0.1em] "
                        }`}
                    >
                        {walletConnected
                            ? address &&
                              address
                                  .substring(0, 4)
                                  .concat(`...${address.slice(-4)}`)
                            : "Connect Wallet"}
                    </button>
                </div>
            </nav>
            {children}
        </main>
    );
};

export default Layout;
