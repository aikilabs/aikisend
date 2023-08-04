"use client";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import BottomSig from "@/utils/bottomSig";
import Link from "next/link";
import { HiArrowLongLeft } from "react-icons/hi2";
import { useRouter } from "next/navigation";
import { useContractReads } from "wagmi";
import { abi } from "@/abi/abi";
import { setSelectedToken, setApprovedToken } from "@/redux/aikiSend";
import ApprovePermit2 from "@/components/approvePermit2";
// import ApprovedToken from "@/components/approvedToken";

const Page = () => {
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
        if (selectedToken.length === 0) {
            return router.push("/send/selectTokens");
        }
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
                                    target="_blank"
                                >
                                    UNISWAP PERMIT2
                                </Link>
                            </p>
                            <p className="sm:text-sm text-xs text-gray-500">
                                You can also revoke approval here
                                {` `}
                                <Link
                                    className="underline font-bold text-black"
                                    href="http://revoke.cash"
                                    target="_blank"
                                >
                                    revoke.cash
                                </Link>
                            </p>
                        </div>
                    </div>
                    <div className="flex-1 flex-col flex lg:flex-row justify-start items-start lg:px-20 gap-6 lg:gap-12 overflow-auto px-4">
                        <button
                            onClick={() => router.push("/send/selectTokens")}
                            className="w-16 h-16 mt-4 transition-all duration-100  flex active:shadow-none active:scale-100 active:translate-x-1 active:translate-y-1 justify-center items-center rounded-full shadow-neo-brutalism-xs sm:shadow-neo-brutalism-sm border-2 sm:border-[3px] border-black"
                        >
                            <HiArrowLongLeft className="transition-all duration-100 w-16 h-16 -top-[140%] -right-10" />
                        </button>
                        <div className="h-full overflow-auto flex flex-col w-full flex-1 gap-y-4">
                            <h2 className="underline font-bold text-center text-2xl">
                                Unapproved Tokens
                            </h2>
                            <div className="lg:flex-1 min-h-[6rem] h-full max-h-min w-full flex flex-col border-4 rounded-xl space-y-12 lg:space-y-0 lg:grid 3xl:grid-cols-3 xl:grid-cols-2 items-center xl:items-start lg:gap-12 overflow-auto  px-4 lg:px-6 lg:py-10 py-6 scrollbar-thin shadow-inner-2">
                                {selectedToken.map((token, index) => {
                                    const totalAmountToSend =
                                        token.recipient.reduce(
                                            (acc, recipient) =>
                                                acc + recipient.amount,
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
                                })}
                                {
                                    // if no approved token display "no approved token"
                                    selectedToken.filter(
                                        (token) => !token.approved

                                        // token.approved
                                    ).length === 0 && (
                                        <h3 className="text-center text-gray-500 italic font-light w-full flex-1 text-xl 3xl:col-span-3 xl:col-span-2">
                                            You've approved all tokens
                                        </h3>
                                    )
                                }
                            </div>
                        </div>
                        <div className="scrollbar-thin lg:w-64 min-h-[6rem] w-full max-h-[16rem] lg:h-64 border-4 border-black md:p-4 p-1 rounded-xl overflow-auto sm:shadow-neo-brutalism-lg">
                            <h2 className="underline font-semibold text-center text-lg">
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
                                            className=""
                                        >
                                            {token.name}
                                        </h3>
                                    );
                                }
                            })}
                        </div>
                    </div>
                    <div className="w-full flex justify-end px-8 my-4">
                        <button
                            onClick={proceedClick}
                            className="md:px-8 md:py-2.5 py-1 px-4 text-sm rounded-lg shadow-neo-brutalism-sm border-2 md:border-[3px] bg-gray-500 text-white border-black transition-all duration-100  active:shadow-none active:scale-100 active:translate-x-1 active:translate-y-1"
                        >
                            Proceed
                        </button>
                    </div>
                </div>
            </section>
            <BottomSig />
        </>
    );
};

export default Page;
