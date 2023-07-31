import React from "react";
import {
    useContractWrite,
    usePrepareContractWrite,
    useWaitForTransaction,
} from "wagmi";
import { permit2Abi } from "@/abi/permit2Abi";
import { redirect } from "next/navigation";

const SendToken = ({ permitData, transferDetails, address, signature }) => {
    console.log(`Owner: ${address}, Sig: ${signature}`)

    const { config } = usePrepareContractWrite({
        address: "0x000000000022D473030F116dDEE9F6B43aC78BA3",
        abi: permit2Abi,
        functionName: "permitTransferFrom",
        args: [permitData, transferDetails, address, signature],
    });

    const { data, isLoading: firstLoading, write } = useContractWrite(config);

    const { isLoading: secondLoading } = useWaitForTransaction({
        hash: data?.hash,
        onSuccess(data) {},
    });

    const sendTokens = () => {
        try {
            write?.()
            console.log(`Write suceeded`)
            redirect("/")
        }catch(err) {
            console.log(err.message)
        }
    }
    
    return (
        <button
            className="sm:text-3xl sm:py-3 sm:px-12 text-lg px-4 py-1 rounded-full bg-gray-200 border-2 border-black active:shadow-none shadow-neo-brutalism-sm"
            onClick={() => write?.()}
        >
            {firstLoading || secondLoading ? "Loading..." : "Send Tokens"}
        </button>
    );
};

export default SendToken;
