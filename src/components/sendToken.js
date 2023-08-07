import React, { useEffect } from "react";
import {
    useContractWrite,
    usePrepareContractWrite,
    useWaitForTransaction,
} from "wagmi";
import { permit2Abi } from "@/abi/permit2Abi";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";

const SendToken = ({ permitData, transferDetails, address, signature }) => {
    console.log(`Owner: ${address}, Sig: ${signature}`);
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
            console.log(`Write suceeded`);
            // redirect("/");
        } catch (err) {
            console.log(err.message);
        }
    };

    useEffect(() => {
        console.log({ address });
    }, []);

    return (
        <button
            disabled={firstLoading || secondLoading}
            className="sm:text-3xl sm:py-3 sm:px-12 text-lg px-4 py-1 rounded bg-[#898a90] bg-opacity-50"
            onClick={sendTokens}
        >
            {firstLoading || secondLoading ? "Loading..." : "Send Tokens"}
            {/* Send Tokens */}
        </button>
    );
};

export default SendToken;
