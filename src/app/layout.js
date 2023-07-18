"use client";
import "./globals.css";
import { Inter } from "next/font/google";
import React, { useEffect } from "react";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { goerli, foundry, mainnet } from "wagmi/chains";
import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from "wagmi/providers/public";
import {
    EthereumClient,
    w3mConnectors,
    w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import store from "../redux/store";
import { Provider } from "react-redux";
const Moralis = require("moralis").default;

const inter = Inter({ subsets: ["latin"] });

const { chains, publicClient } = configureChains(
    [goerli, foundry, mainnet],
    [
        infuraProvider({ apiKey: process.env.NEXT_PUBLIC_INFURA_API_KEY }),
        publicProvider(),
    ]
);
const connectors = w3mConnectors({
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    chains,
});
const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
});

const ethereumClient = new EthereumClient(wagmiConfig, chains);

// const { connectors } = getDefaultWallets({
//     appName: "Zuxt",
//     projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
//     chains,
// });

export const metadata = {
    title: "Aikisend",
    description: "Multi token transfer",
};

Moralis.start({
    apiKey: process.env.NEXT_PUBLIC_MORALIS_API_KEY,
    // ...and any other configuration
});

export default function RootLayout({ children }) {
    useEffect(() => {
        const func = async () => {};
        func();
    }, []);
    return (
        <Provider store={store}>
            <html
                lang="en"
                className="h-full scrollbar-thin scrollbar-thumb-gray-500"
            >
                <body className=" font-farro bg-[#FBFBFB] h-full">
                    <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>
                    <Web3Modal
                        projectId={
                            process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
                        }
                        ethereumClient={ethereumClient}
                    />
                </body>
            </html>
        </Provider>
    );
}
