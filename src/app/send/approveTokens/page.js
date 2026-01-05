"use client";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import { HiArrowLeft } from "react-icons/hi2";
import { useRouter } from "next/navigation";
import { useContractReads } from "wagmi";
import { abi } from "@/abi/abi";
import { setSelectedToken, setApprovedToken } from "@/redux/aikiSend";
import ApprovePermit2 from "@/components/approvePermit2";

const Page = () => {
    const [showApproved, setShowApproved] = useState(false);

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
        const newSelectedToken = selectedToken.filter(
            (token) => token.approved
        );
        if (newSelectedToken.length <= 0) {
            return;
        }
        dispatch(setApprovedToken(newSelectedToken));
        router.push("/send/transferTokens");
    };

    const unapprovedTokens = selectedToken.filter((token) => !token.approved);
    const approvedTokens = selectedToken.filter((token) => token.approved);

    return (
        <section className="flex flex-1 flex-col overflow-auto">
            <div className="flex flex-1 flex-col gap-y-6 overflow-auto p-4 scrollbar-thin md:p-6">
                {/* Header */}
                <div className="flex items-start gap-4">
                    <button
                        onClick={() => router.push("/send/selectTokens")}
                        className="border-2 border-primary-dark p-2 transition-all hover:bg-primary-dark hover:text-primary-light"
                    >
                        <HiArrowLeft className="h-5 w-5" />
                    </button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold md:text-3xl">Approve Tokens</h1>
                        <p className="mt-1 text-sm text-primary-dark/70">
                            Approve PERMIT2 to spend your tokens.{" "}
                            <Link
                                className="border-b-2 border-accent text-accent hover:text-primary-dark"
                                href="https://github.com/Uniswap/permit2"
                                target="_blank"
                            >
                                Learn more
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Proceed Button */}
                <div className="flex justify-end">
                    <button
                        onClick={proceedClick}
                        disabled={approvedTokens.length === 0}
                        className={`border-2 border-primary-dark px-6 py-2 text-sm font-semibold transition-all duration-200 sm:px-10 sm:text-base ${
                            approvedTokens.length === 0
                                ? "cursor-not-allowed bg-primary-dark/10 text-primary-dark/40"
                                : "bg-primary-dark text-primary-light shadow-home-shadow hover:shadow-none"
                        }`}
                    >
                        Proceed →
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-2 border-primary-dark">
                    <button
                        className={`flex-1 px-4 py-3 text-sm font-semibold transition-all ${
                            !showApproved
                                ? "bg-primary-dark text-primary-light"
                                : "bg-primary-light text-primary-dark hover:bg-primary-dark/10"
                        }`}
                        onClick={() => setShowApproved(false)}
                    >
                        Pending Approval ({unapprovedTokens.length})
                    </button>
                    <button
                        className={`flex-1 border-l-2 border-primary-dark px-4 py-3 text-sm font-semibold transition-all ${
                            showApproved
                                ? "bg-primary-dark text-primary-light"
                                : "bg-primary-light text-primary-dark hover:bg-primary-dark/10"
                        }`}
                        onClick={() => setShowApproved(true)}
                    >
                        Approved ({approvedTokens.length})
                    </button>
                </div>

                {/* Token Tables */}
                {!showApproved ? (
                    <div className="border-2 border-primary-dark">
                        {unapprovedTokens.length === 0 ? (
                            <div className="py-12 text-center text-primary-dark/50">
                                No tokens pending approval
                            </div>
                        ) : (
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b-2 border-primary-dark bg-primary-dark/5 text-left text-xs uppercase tracking-wide">
                                        <th className="px-4 py-3">Token</th>
                                        <th className="px-4 py-3 text-right">Amount to Send</th>
                                        <th className="px-4 py-3 text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {unapprovedTokens.map((token) => {
                                        const totalAmount = token.recipient.reduce(
                                            (acc, r) => acc + r.amount,
                                            0
                                        );
                                        return (
                                            <ApprovePermit2
                                                key={token.token_address}
                                                token={token}
                                                amount={totalAmount}
                                            />
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                ) : (
                    <div className="border-2 border-primary-dark">
                        {approvedTokens.length === 0 ? (
                            <div className="py-12 text-center text-primary-dark/50">
                                No approved tokens yet
                            </div>
                        ) : (
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b-2 border-primary-dark bg-primary-dark/5 text-left text-xs uppercase tracking-wide">
                                        <th className="px-4 py-3">Token</th>
                                        <th className="px-4 py-3 text-right">Amount to Send</th>
                                        <th className="px-4 py-3 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {approvedTokens.map((token) => {
                                        const totalAmount = token.recipient.reduce(
                                            (acc, r) => acc + r.amount / 10 ** token.decimals,
                                            0
                                        );
                                        return (
                                            <tr
                                                key={token.token_address}
                                                className="border-b border-primary-dark/20"
                                            >
                                                <td className="px-4 py-4 font-semibold">
                                                    {token.name}
                                                </td>
                                                <td className="px-4 py-4 text-right font-mono">
                                                    {totalAmount.toFixed(4)}
                                                </td>
                                                <td className="px-4 py-4 text-center">
                                                    <span className="inline-block border-2 border-green-600 bg-green-600/10 px-3 py-1 text-xs font-semibold text-green-600">
                                                        ✓ Approved
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

                {/* Revoke Info */}
                <p className="text-center text-xs text-primary-dark/50">
                    You can revoke approvals at{" "}
                    <Link
                        className="border-b border-accent text-accent hover:text-primary-dark"
                        href="http://revoke.cash"
                        target="_blank"
                    >
                        revoke.cash
                    </Link>
                </p>
            </div>
        </section>
    );
};

export default Page;
