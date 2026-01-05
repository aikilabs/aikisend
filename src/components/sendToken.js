"use client";
import React, { useEffect } from "react";
import {
    useContractWrite,
    usePrepareContractWrite,
    useWaitForTransaction,
} from "wagmi";
import { permit2Abi } from "@/abi/permit2Abi";
import { useRouter } from "next/navigation";

const SendToken = ({ permitData, transferDetails, address, signature }) => {
    const router = useRouter();

    const { config } = usePrepareContractWrite({
        address: "0x000000000022D473030F116dDEE9F6B43aC78BA3",
        abi: permit2Abi,
        functionName: "permitTransferFrom",
        args: [permitData, transferDetails, address, signature],
        onError(err) {
            router.push("/send/failure");
        },
    });

    const { data, isLoading: firstLoading, write } = useContractWrite(config);

    const { isLoading: secondLoading } = useWaitForTransaction({
        hash: data?.hash,
        onError(err) {
            router.push("/send/failure");
        },
        onSuccess(data) {
            router.push("/send/success");
        },
    });

    const sendTokens = () => {
        try {
            write?.();
        } catch (err) {
            console.log(err.message);
        }
    };

    const isLoading = firstLoading || secondLoading;

    return (
        <button
            disabled={isLoading}
            className={`border-2 px-8 py-3 text-lg font-semibold transition-all ${
                isLoading
                    ? "cursor-wait border-primary-dark/30 bg-primary-dark/10 text-primary-dark/40"
                    : "border-primary-dark bg-primary-dark text-primary-light shadow-home-shadow hover:shadow-none"
            }`}
            onClick={sendTokens}
        >
            {isLoading ? (
                <span className="flex items-center gap-2">
                    <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                    Sending...
                </span>
            ) : (
                "Send Tokens →"
            )}
        </button>
    );
};

export default SendToken;
