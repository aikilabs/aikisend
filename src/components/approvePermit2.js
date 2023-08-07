import { abi } from "@/abi/abi";
import React, { useEffect } from "react";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { useContractRead } from "wagmi";
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
            className="flex flex-col items-start justify-between gap-y-4 p-4 rounded bg-[#898a90] bg-opacity-20 w-full"
        >
            <h1 className="text-center w-full">{token.name}</h1>

            <button
                disabled={isLoading}
                onClick={() => write?.()}
                className={`  py-2.5 w-full rounded bg-[#898a90]   ${
                    isLoading
                        ? " text-white bg-opacity-10 "
                        : " text-black bg-opacity-30"
                }`}
            >
                {isLoading ? "loading..." : "Approve"}
            </button>
        </div>
    );
};

export default ApprovePermit2;
