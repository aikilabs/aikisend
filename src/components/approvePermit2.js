import { abi } from "@/abi/abi";
import React, { useEffect } from "react";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { useContractRead } from "wagmi";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedToken } from "@/redux/aikiSend";

const ApprovePermit2 = ({ token, amount }) => {
    const selectedToken = useSelector((state) => state.aikiSend.selectedToken);
    const address = useSelector((state) => state.aikiSend.address);
    const dispatch = useDispatch();

    const { config } = usePrepareContractWrite({
        address: token.token_address,
        abi: abi,
        functionName: "approve",
        args: [
            // permit2 contract address
            "0x000000000022D473030F116dDEE9F6B43aC78BA3",
            // max uint256 value
            "115792089237316195423570985008687907853269984665640564039457584007913129639935",
        ],
    });
    const { data, isLoading, isSuccess, write } = useContractWrite(config);
    useEffect(() => {
        if (isSuccess) {
            // search for token in selectedToken and update allowance
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

    return (
        <div
            key={token.token_address}
            className="flex flex-col h-40 items-start justify-start gap-y-8 border-4 p-4 rounded-2xl border-black max-w-md w-full shadow-neo-brutalism-lg"
        >
            <h1 className="text-2xl font-semibold">{token.name}</h1>

            <button
                disabled={isLoading}
                onClick={() => write?.()}
                className={`  py-2.5 w-full rounded-lg shadow-neo-brutalism-sm border-[3px]  ${
                    isLoading
                        ? "shadow-none text-gray-400 border-gray-400 "
                        : "bg-gray-500 text-white border-black transition-all duration-100 active:shadow-none active:scale-100 active:translate-x-1 active:translate-y-1"
                }`}
            >
                {isLoading ? "loading..." : "Approve"}
            </button>
        </div>
    );
};

export default ApprovePermit2;
