"use client";
import React, { useEffect, useState } from "react";
import { useAccount, useNetwork, useBalance } from "wagmi";
import { useWeb3Modal } from "@web3modal/react";
import { useSelector, useDispatch } from "react-redux";
import {
  addUserAddress,
  changeWalletConnectionState,
  setAllAvailableTokens,
  setChainId,
} from "@/redux/aikiSend";
import Image from "next/image";
import { SiHiveBlockchain } from "react-icons/si";
import Loading from "./loading";
import Footer from "@/components/footer";
export const Moralis = require("moralis").default;
const { EvmChain } = require("@moralisweb3/common-evm-utils");

const Layout = ({ children }) => {
  const [network, setNetwork] = useState("");
  const [balance, setBalance] = useState(0);
  const [balanceSymbol, setBalanceSymbol] = useState("");
  const { isConnected, address } = useAccount();
  const {
    data: balanceData,
    isError,
    isLoading,
  } = useBalance({
    address,
  });
  const dispatch = useDispatch();
  const walletConnected = useSelector(
    (state) => state.aikiSend.walletConnected,
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
        const response = await Moralis.EvmApi.token.getWalletTokenBalances({
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
    if (balanceData) {
      setBalance(balanceData.formatted);
      setBalanceSymbol(balanceData.symbol);
    }
    if (address) {
      setTokens();
    }
  }, [isConnected, network, address, balanceData]);

  const { open, close } = useWeb3Modal();

  //   if (isLoading || !isConnected) {
  //     return <Loading />;
  //   }

  return (
    <main className="flex min-h-screen flex-col bg-primary-light font-mono text-primary-dark">
      <nav className="flex items-center justify-between border-b-2 border-primary-dark px-4 py-4 sm:px-8">
        <Image
          src={"/logo.svg"}
          className="w-28 sm:w-36 md:ml-24"
          width={152}
          height={33.7}
          alt="AikiSend Logo"
        />
        <div className="flex items-center gap-x-4">
          {network && (
            <div className="hidden items-center gap-x-2 border-2 border-primary-dark bg-primary-light px-4 py-1.5 text-sm font-semibold text-primary-dark sm:flex">
              {network ? `${network}` : ""}
              <SiHiveBlockchain className="inline-block h-5 w-5 text-accent" />
            </div>
          )}
          <button
            onClick={() => open()}
            className={`flex items-center gap-x-2 border-2 px-2 py-1.5 text-xs font-semibold transition-all duration-200 sm:text-sm md:px-4 ${
              walletConnected
                ? "border-primary-dark bg-primary-light text-primary-dark hover:bg-primary-dark hover:text-primary-light"
                : "border-primary-dark bg-primary-dark text-primary-light shadow-home-shadow hover:shadow-none"
            }`}
          >
            {walletConnected ? (
              <>
                <span>
                  {Number(balance).toFixed(3)}
                  {balanceSymbol}
                </span>
                <span className="border-l-2 border-primary-dark bg-accent px-2 py-0.5 text-primary-dark">
                  {address.substring(0, 4).concat(`...${address.slice(-4)}`)}
                </span>
              </>
            ) : (
              "Connect Wallet"
            )}
          </button>
        </div>
      </nav>
      <div className="flex flex-1 flex-col">{children}</div>
      {/* <Footer /> */}
    </main>
  );
};

export default Layout;
