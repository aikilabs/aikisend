"use client";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import BottomSig from "@/utils/bottomSig";
import Link from "next/link";
import { HiArrowLongLeft } from "react-icons/hi2";
import { useRouter } from "next/navigation";
import { useContractRead, useContractReads } from "wagmi";
import { abi } from "@/abi/abi";
import { setSelectedToken } from "@/redux/aikiSend";

const Page = () => {
    const [contracts, setContracts] = useState([]);
    const address = useSelector((state) => state.aikiSend.address);
    const selectedToken = useSelector((state) => state.aikiSend.selectedToken);

    const router = useRouter();
    const dispatch = useDispatch();

    const {
        data: allowanceData,
        isError,
        isLoading,
    } = useContractReads({
        contracts: selectedToken.map((token) => {
            return {
                address: token.token_address,
                abi,
                functionName: "allowance",
                args: [address, "0x000000000022D473030F116dDEE9F6B43aC78BA3"],
            };
        }),
    });

    useEffect(() => {
        if (selectedToken.length === 0) {
            return router.push("/send/selectTokens");
        }
        // set allowance of selected token to match there index in data of allowance
        const newSelectedToken = selectedToken.map((token, index) => {
            return {
                ...token,
                allowance: allowanceData[index].result,
            };
        });
        dispatch(setSelectedToken(newSelectedToken));
        // console.log(allowanceData[0].result <= 0);
    }, []);

    return (
        <section className="flex flex-col flex-1 h-full ">
            <div className="flex-1 h-full flex flex-col ">
                <div>
                    <div className="flex relative text-center flex-col  w-full">
                        <h1 className="text-2xl font-semibold">
                            Set approval for PERMIT2
                        </h1>
                        <p className="text-sm text-gray-500">
                            You are approving PERMIT2 to spend your tokens{` `}
                            <Link
                                className="underline font-light text-pink-500"
                                href="https://github.com/Uniswap/permit2"
                            >
                                UNISWAP PERMIT2
                            </Link>
                        </p>
                    </div>
                </div>
                <div className="flex-1 flex justify-start items-start px-20">
                    <button
                        onClick={() => router.push("/send/selectTokens")}
                        className="w-20 h-20 transition-all duration-200 hover:scale-110 flex active:shadow-none active:scale-100 justify-center items-center rounded-full shadow-neo-brutalism-sm border-[3px] border-black"
                    >
                        <HiArrowLongLeft className="transition-all duration-200 w-20 h-20 -top-[140%] -right-10" />
                    </button>
                    <div className="flex-1"></div>
                    <div className=""></div>
                </div>
            </div>
            <BottomSig />
        </section>
    );
};

export default Page;
