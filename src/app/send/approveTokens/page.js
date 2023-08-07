"use client";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import BottomSig from "@/utils/bottomSig";
import Link from "next/link";
import { HiArrowLeft } from "react-icons/hi2";
import { useRouter } from "next/navigation";
import { useContractReads } from "wagmi";
import { abi } from "@/abi/abi";
import { setSelectedToken, setApprovedToken } from "@/redux/aikiSend";
import ApprovePermit2 from "@/components/approvePermit2";
// import ApprovedToken from "@/components/approvedToken";

const Page = () => {
    const [showApprovePermit2, setShowApprovePermit2] = useState(false);

    const address = useSelector((state) => state.aikiSend.address);
    const chainId = useSelector((state) => state.aikiSend.chainId);
    const selectedToken = useSelector((state) => state.aikiSend.selectedToken);
    const approvedToken = useSelector((state) => state.aikiSend.approvedToken);

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
        onSuccess(data) {
            const newSelectedToken = selectedToken.map((token, index) => {
                return {
                    ...token,
                    // allowance: Number(
                    //     BigInt(allowanceData.data[index].result)
                    // ),
                    approved:
                        Number(BigInt(data[index].result)) >
                        token.recipient.reduce(
                            (acc, recipient) => acc + recipient.amount,
                            0
                        ),
                };
            });
            dispatch(setSelectedToken(newSelectedToken));
        },
    });

    const proceedClick = () => {
        // router.push("/send/transferTokens");
        // filter out tokens with 0 amount and approved is false
        const newSelectedToken = selectedToken.filter(
            (token) => token.approved
        );
        if (newSelectedToken.length <= 0) {
            return;
        }
        // console.log(newSelectedToken);

        dispatch(setApprovedToken(newSelectedToken));
        router.push("/send/transferTokens");
    };

    useEffect(() => {
        // if (selectedToken.length === 0) {
        //     return router.push("/send/selectTokens");
        // }
        // set allowance of selected token to match there index in data of allowance
        // const newSelectedToken = selectedToken.map((token, index) => {
        //     // if (!allowanceData[index]) {
        //     //     return {
        //     //         ...token,
        //     //         allowance: 0,
        //     //     };
        //     // }
        //     // if (allowanceData[index].status != "success") {
        //     //     return {
        //     //         ...token,
        //     //         allowance: 0,
        //     //     };
        //     // }
        //     return {
        //         ...token,
        //         allowance: Number(BigInt(allowanceData[index].result)),
        //         approved: Number(BigInt(allowanceData[index].result)) !== 0,
        //     };
        // });
        // dispatch(setSelectedToken(newSelectedToken));
    }, []);

    return (
        <>
            <section className="flex flex-col flex-1 gap-y-6 p-4 h-full scrollbar-thin overflow-auto text-black ">
                <div className="flex">
                    <button
                        onClick={() => router.push("/send/selectTokens")}
                        className="transition-all duration-100 "
                    >
                        <HiArrowLeft className="transition-all duration-100 w-6 h-6" />
                    </button>
                    <div className="flex relative gap-1 text-center flex-col flex-1 w-full">
                        <h1 className="sm:text-2xl font-normal">
                            Set approval for PERMIT2
                        </h1>
                        <p className="sm:text-sm text-xs ">
                            You are approving PERMIT2 to spend your tokens
                            {` `}
                            <Link
                                className="underline font-light text-pink-500"
                                href="https://github.com/Uniswap/permit2"
                                target="_blank"
                            >
                                UNISWAP PERMIT2
                            </Link>
                        </p>
                        <p className="sm:text-sm text-xs ">
                            You can also revoke approval here
                            {` `}
                            <Link
                                className="underline font-bold "
                                href="http://revoke.cash"
                                target="_blank"
                            >
                                revoke.cash
                            </Link>
                        </p>
                    </div>
                </div>
                <div className="flex justify-end">
                    <button
                        onClick={proceedClick}
                        className="sm:px-10 px-4 py-1.5 text-xs sm:text-base rounded bg-[#898a90] bg-opacity-50   transition-all duration-100"
                    >
                        Proceed
                    </button>
                </div>
                <div className="flex text-sm md:text-base items-center mb-4 justify-center">
                    <div className="flex gap-x-3 md:gap-x-6 relative px-2 md:px-4 justify-center">
                        <button
                            className={`px-2`}
                            onClick={() => setShowApprovePermit2(false)}
                        >
                            Unapproved Tokens
                        </button>
                        <button
                            className={`px-2`}
                            onClick={() => setShowApprovePermit2(true)}
                        >
                            Approved Tokens
                        </button>
                        <div className="absolute w-full bottom-0 bg-gray-300">
                            <div
                                className={`h-0.5 bg-yellow-200 w-1/2 bottom-0 transition-all duration-200 ${
                                    showApprovePermit2 ? "translate-x-full" : ""
                                }`}
                            ></div>
                        </div>
                    </div>
                </div>
                {!showApprovePermit2 && (
                    <div className="grid sm:grid-cols-2 md:grid-cols-4 w-full gap-y-6 gap-x-6 max-w-6xl place-self-center mb-8">
                        {selectedToken.map((token, index) => {
                            const totalAmountToSend = token.recipient.reduce(
                                (acc, recipient) => acc + recipient.amount,
                                0
                            );
                            if (!token.approved) {
                                return (
                                    <ApprovePermit2
                                        key={token.token_address}
                                        token={token}
                                        amount={totalAmountToSend}
                                    />
                                );
                            }
                        })}{" "}
                        {
                            // if no approved token display "no approved token"
                            selectedToken.filter(
                                (token) => !token.approved

                                // token.approved
                            ).length === 0 && (
                                <h3 className="text-center w-full flex-1 text-xl 3xl:col-span-3 sm:col-span-2 md:col-span-4 text-gray-600">
                                    No Unapproved Token
                                </h3>
                            )
                        }
                    </div>
                )}
                {showApprovePermit2 && (
                    <div className="grid sm:grid-cols-2 md:grid-cols-4 w-full gap-y-6 gap-x-6 max-w-6xl place-self-center pb-8">
                        {selectedToken.map((token, index) => {
                            const totalAmountToSend = token.recipient.reduce(
                                (acc, recipient) => acc + recipient.amount,
                                0
                            );
                            if (token.approved) {
                                return (
                                    <h3
                                        key={token.token_address}
                                        className="bg-[#898a90] bg-opacity-20 p-4 rounded text-center "
                                    >
                                        {token.name}
                                    </h3>
                                );
                            }
                        })}

                        {selectedToken.filter((token) => token.approved)
                            .length === 0 && (
                            <h3 className="text-center w-full flex-1 text-xl 3xl:col-span-3 sm:col-span-2 md:col-span-4 text-gray-600">
                                No Approved Token
                            </h3>
                        )}
                    </div>
                )}
                {/* <div className="w-2/3 hidden bg-gray-300 md:grid place-self-center fixed bottom-10">
                    <div
                        className={`h-1 bg-gray-600 w-1/2 bottom-0 transition-all duration-200 ${
                            showApprovePermit2 ? "translate-x-full" : ""
                        }`}
                    ></div>
                </div> */}
            </section>
            {/* <BottomSig /> */}
        </>
    );
};

export default Page;
