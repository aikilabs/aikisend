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
import ApprovePermit2 from "@/components/approvePermit2";
import ApprovedToken from "@/components/approvedToken";

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
            // if (!allowanceData[index]) {
            //     return {
            //         ...token,
            //         allowance: 0,
            //     };
            // }
            // if (allowanceData[index].status != "success") {
            //     return {
            //         ...token,
            //         allowance: 0,
            //     };
            // }
            return {
                ...token,
                allowance: Number(BigInt(allowanceData[index].result)),
                approved: Number(BigInt(allowanceData[index].result)) !== 0,
            };
        });
        dispatch(setSelectedToken(newSelectedToken));
    }, []);

    return (
        <>
            <section className="flex flex-col flex-1 h-full overflow-auto px-4">
                <div className="flex-1 h-full lg:gap-y-4 flex flex-col overflow-auto">
                    <div>
                        <div className="flex relative text-center flex-col  w-full">
                            <h1 className="sm:text-2xl font-semibold">
                                Set approval for PERMIT2
                            </h1>
                            <p className="sm:text-sm text-xs text-gray-500">
                                You are approving PERMIT2 to spend your tokens
                                {` `}
                                <Link
                                    className="underline font-light text-pink-500"
                                    href="https://github.com/Uniswap/permit2"
                                >
                                    UNISWAP PERMIT2
                                </Link>
                            </p>
                        </div>
                    </div>
                    <div className="w-full flex justify-end px-4 my-2">
                        <button
                            onClick={() => router.push("/send/transferTokens")}
                            className="md:px-2.5 md:py-2.5 p-1 text-sm rounded-lg shadow-neo-brutalism-sm border-2 md:border-[3px] bg-gray-500 text-white border-black transition-all duration-100 hover:scale-110 active:shadow-none active:scale-100 active:translate-x-1 active:translate-y-1"
                        >
                            Proceed
                        </button>
                    </div>
                    <div className="flex-1 flex-col flex lg:flex-row justify-start items-start lg:px-20 gap-6 lg:gap-12 overflow-auto px-4">
                        <button
                            onClick={() => router.push("/send/selectTokens")}
                            className="sm:w-20 sm:h-20 w-10 h-10 mt-4 transition-all duration-100 hover:scale-110 flex active:shadow-none active:scale-100 active:translate-x-1 active:translate-y-1 justify-center items-center rounded-full shadow-neo-brutalism-xs sm:shadow-neo-brutalism-sm border-2 sm:border-[3px] border-black"
                        >
                            <HiArrowLongLeft className="transition-all duration-100 w-10 h-10 sm:w-20 sm:h-20 -top-[140%] -right-10" />
                        </button>
                        <div className="lg:flex-1 w-full flex flex-col border-4 rounded-xl space-y-12 lg:space-y-0 lg:grid 3xl:grid-cols-3 xl:grid-cols-2 items-center xl:items-start lg:gap-12 overflow-auto  px-4 lg:px-6 lg:py-10 py-6 scrollbar-thin">
                            {selectedToken.map((token, index) => {
                                const totalAmountToSend =
                                    token.recipient.reduce(
                                        (acc, recipient) =>
                                            acc + recipient.amount,
                                        0
                                    );
                                if (
                                    token.allowance < totalAmountToSend &&
                                    !token.approved
                                ) {
                                    return (
                                        <ApprovePermit2
                                            key={token.token_address}
                                            token={token}
                                            amount={totalAmountToSend}
                                        />
                                    );
                                }
                            })}
                        </div>
                        <div className="scrollbar-thin lg:w-64 min-h-[6rem] w-full max-h-[16rem] lg:h-64 border-4 border-black md:p-4 p-1 rounded-xl overflow-auto sm:shadow-neo-brutalism-lg">
                            <h2 className="underline font-semibold">
                                Approved Tokens
                            </h2>
                            {selectedToken.map((token, index) => {
                                const totalAmountToSend =
                                    token.recipient.reduce(
                                        (acc, recipient) =>
                                            acc + recipient.amount,
                                        0
                                    );
                                if (token.approved) {
                                    return (
                                        <h3
                                            key={token.token_address}
                                            className="text-sm"
                                        >
                                            {token.name}
                                        </h3>
                                    );
                                }
                            })}
                        </div>
                    </div>
                </div>
            </section>
            <BottomSig />
        </>
    );
};

export default Page;
