"use client";
import { Router } from "next/router";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const networks = [
    // create object of network name and image url for arbitrum,avalanche, bsc, bscTestnet,cronos, mainnet,fantom,, goerli, polygonMumbai, polygon,sepolia,
    {
        name: "Ethereum",
        image: "/ethereum2.svg",
    },
    {
        name: "Binance Smart Chain",
        image: "/binance.svg",
    },
    {
        name: "Polygon",
        image: "/polygon.svg",
    },
    {
        name: "Avalanche",
        image: "/avalanche.svg",
    },
    {
        name: "Fantom",
        image: "/fantom.svg",
    },
    {
        name: "Arbitrum",
        image: "/arbitrum.svg",
    },
    {
        name: "Cronos",
        image: "/cronos.svg",
    },
    {
        name: "Goerli",
        image: "/default.svg",
    },
    {
        name: "Sepolia",
        image: "/default.svg",
    },
];

const tools = [
    "/walletconnect-logo-white.svg",
    "/permit2.svg",
    "/moralis.svg",
    "/wagmi.svg",
];
const page = () => {
    const router = useRouter();
    // useEffect(() => {
    //     router.push("/send/selectTokens");
    // }, []);
    return (
        <div className="flex justify-center bg-black text-white overflow-auto">
            <main className="max-w-6xl grid gap-y-24 w-full px-4">
                <nav className="flex items-center py-4 sm:px-8 ">
                    <Image
                        src={"/logoWhite.svg"}
                        className="w-28 sm:w-36"
                        width={152}
                        height={33.7}
                    />
                </nav>
                <article className="flex flex-col items-center justify-center gap-y-8">
                    <h1 className="max-w-lg text-xl md:text-3xl font-semibold text-yellow-500 text-center">
                        Send multiple tokens to multiple addresses in one
                        transaction
                    </h1>
                    <button
                        onClick={() => router.push("/send/selectTokens")}
                        className="border-2 rounded px-4 md:px-8 py-1 border-yellow-500"
                    >
                        Launch Dapp
                    </button>
                </article>
                <article className="flex flex-col items-start  justify-center gap-y-2">
                    <p className="text-xs">About Aikisend</p>
                    <h2 className="max-w-lg text-xs sm:text-sm">
                        In the ever-evolving landscape of blockchain and
                        cryptocurrency, efficiency, convenience, and innovation
                        are paramount. Aikisend emerges as a groundbreaking
                        solution that re-imagines the way digital assets are
                        transferred, providing an unprecedented level of
                        flexibility and simplicity to users seeking to send
                        multiple tokens to multiple addresses in a single
                        transaction.
                    </h2>
                    <p className="text-[0.55rem] max-w-md text-gray-500">
                        Aikisend helps you send multiple tokens to multiple
                        addresses in one transaction, unlike other multisender
                        that only support sending one token to multiple
                        addresses
                    </p>
                </article>
                <section className="flex flex-col md:flex-row justify-center gap-x-16">
                    <div className="gap-y-2 flex flex-col relative">
                        <div className=" w-full absolute top-0 left-0 bg-gray-400">
                            <div className="w-1/2 bg-yellow-500 h-[1px]"></div>
                        </div>
                        <h3 className="pt-4">Easy Token Allocation</h3>
                        <p className="max-w-xs text-xs">
                            With the use of uniswap permit2, you can easily
                            allocate tokens to multiple addresses saving you
                            alot of time and stress in the process of sending
                            tokens to multiple addresses.
                        </p>
                    </div>
                    <div>
                        <Image
                            src={"/coinFlow.svg"}
                            className="w-48 hidden md:block"
                            width={252}
                            height={252}
                        />
                    </div>
                </section>
                <section className="flex flex-col items-center justify-center text-center">
                    {/* <h2 className="text-xl text-yellow-500">Tools Used</h2> */}
                    <div className="flex gap-x-8">
                        {tools.map((tool) => (
                            <Image
                                src={tool}
                                className="w-16 md:w-24 text-white"
                                width={32}
                                height={32}
                            />
                        ))}
                    </div>
                </section>
                <section className="flex flex-col text-center gap-y-8 justify-center items-center ">
                    <h2 className="text-xl text-yellow-500">
                        Supported Networks
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-8 md:gap-x-20 max-w-4xl">
                        {networks.map((network) => (
                            <div className="flex items-center flex-col border-b rounded-2xl border-yellow-500 justify-center px-2 py-4 gap-y-4">
                                <Image
                                    src={network.image}
                                    className="w-10"
                                    width={32}
                                    height={32}
                                />
                                <p>{network.name}</p>
                            </div>
                        ))}
                    </div>
                </section>
                <footer className="flex items-center text-xs sm:text-sm md:text-base justify-center gap-6 md:justify-between px-4 py-4 sm:px-8 border-t border-gray-300">
                    <Image
                        src={"/logoHalf.svg"}
                        className="w-6 md:w-8 "
                        width={36.7}
                        height={32.7}
                    />
                    <div className="flex flex-col md:flex-row items-center sm:gap-4 justify-between ">
                        <p>Donate to this project🙂</p>
                        <p>
                            <a
                                className="cursor-pointer"
                                href="https://etherscan.io/address/0x2e2316088c015F4BF27D86A1458A707af536A324"
                            >
                                <u>
                                    0x2e2316088c015F4BF27D86A1458A707af536A324
                                </u>
                            </a>
                        </p>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default page;
