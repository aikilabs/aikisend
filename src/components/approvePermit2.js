"use client";
import { abi } from "@/abi/abi";
import React, { useEffect } from "react";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedToken } from "@/redux/aikiSend";

const ApprovePermit2 = ({ token, amount }) => {
    const selectedToken = useSelector((state) => state.aikiSend.selectedToken);
    const dispatch = useDispatch();

    const { config } = usePrepareContractWrite({
        address: token.token_address,
        abi: abi,
        functionName: "approve",
        args: [
            "0x000000000022D473030F116dDEE9F6B43aC78BA3",
            "115792089237316195423570985008687907853269984665640564039457584007913129639935",
        ],
    });

    const { data, isLoading, isSuccess, write } = useContractWrite(config);

    useEffect(() => {
        if (isSuccess) {
            const newSelectedToken = selectedToken.map((selectedToken) => {
                if (selectedToken.token_address === token.token_address) {
                    return {
                        ...selectedToken,
                        approved: true,
                    };
                }
                return selectedToken;
            });
            dispatch(setSelectedToken(newSelectedToken));
        }
    }, [isSuccess]);

    const displayAmount = (amount / 10 ** token.decimals).toFixed(4);

    return (
        <tr className="border-b border-primary-dark/20 transition-colors hover:bg-primary-dark/5">
            <td className="px-4 py-4 font-semibold">{token.name}</td>
            <td className="px-4 py-4 text-right font-mono">{displayAmount}</td>
            <td className="px-4 py-4 text-center">
                <button
                    disabled={isLoading}
                    onClick={() => write?.()}
                    className={`border-2 px-4 py-2 text-xs font-semibold transition-all ${
                        isLoading
                            ? "cursor-wait border-primary-dark/30 bg-primary-dark/10 text-primary-dark/40"
                            : "border-accent bg-accent text-primary-dark hover:bg-transparent hover:text-accent"
                    }`}
                >
                    {isLoading ? "Approving..." : "Approve"}
                </button>
            </td>
        </tr>
    );
};

export default ApprovePermit2;
