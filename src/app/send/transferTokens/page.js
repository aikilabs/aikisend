"use client";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import BottomSig from "@/utils/bottomSig";
// import { walletClient, publicClient } from "../../../../config";
import { domain, types } from "./data";
import { createWalletClient, custom } from "viem";
import { goerli } from "viem/chains";
import { ethereumClient } from "../layout";
import { useRouter } from "next/navigation";
import Loading from "../loading";
import { HiArrowLongLeft, HiArrowLongRight } from "react-icons/hi2";
import SendToken from "@/components/sendToken";

const Page = () => {
    const [transferDetails, setTransferDetails] = useState([]);
    const [permitData, setPermitData] = useState({});
    const [recipient, setRecipient] = useState([]);
    const [loading, setLoading] = useState(false);
    const [signature, setSignature] = useState(null);

    const approvedTokens = useSelector((state) => state.aikiSend.approvedToken);
    const account = useSelector((state) => state.aikiSend.address);
    const nonce = useSelector((state) => state.aikiSend.nonce);
    const address = useSelector((state) => state.aikiSend.address);

    const router = useRouter();

    const MAX_UINT256 = BigInt(
        "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
    );
    const walletClient = createWalletClient({
        account,
        chain: goerli,
        transport: custom(window.ethereum),
    });

    async function signTransferData() {
        if (!account) return;
        console.log("account", account);

        const permit = Object.create(null);
        const tokenPermissionsData = [];
        const details = [];

        approvedTokens.forEach((token) => {
            console.log("recipients", token.recipient);

            token.recipient.forEach(({ address, amount }) => {
                tokenPermissionsData.push({
                    token: token.token_address,
                    amount: BigInt(amount),
                });

                details.push({
                    to: address,
                    requestedAmount: amount,
                });
            });
        });

        permit.permitted = tokenPermissionsData;
        permit.nonce = getRandomNonce(); // random nonce.
        permit.deadline = MAX_UINT256; // max expiry

        setPermitData(permit);
        setTransferDetails(details);

        const chainId = await walletClient.getChainId();
        console.log("chainid", chainId);

        const signature = await walletClient.signTypedData({
            account,
            domain: { ...domain, chainId },
            types,
            primaryType: "PermitBatchTransferFrom",
            message: {
                permitted: permit.permitted,
                nonce: permit.nonce,
                deadline: permit.deadline,
            },
        });
        setSignature(signature);
    }

    async function handleSign() {
        await signTransferData();
        console.log({
            signature,
            permitData,
            transferDetails,
            address,
        });
        if (transferDetails.length === 0) {
            await signTransferData();
        }
    }

    // compute a random nonce as BigInt
    function getRandomNonce() {
        const MAX_UINT128 = BigInt("0xffffffffffffffffffffffffffffffff");
        let nonce = BigInt(Math.floor(10 * Math.random())) * MAX_UINT128;
        while (nonce == 0n) {
            nonce = BigInt(Math.floor(10 * Math.random())) * MAX_UINT128;
        }
        return nonce;
    }

    useEffect(() => {
        console.log(address);
        setLoading(true);
        if (approvedTokens.length === 0) {
            return router.push("/send/approveTokens");
        }

        // add all recipients to state
        const recipients = [];
        approvedTokens.forEach((token) => {
            token.recipient.forEach((recipient) => {
                let newRecipient = { ...recipient };
                newRecipient.name = token.name;
                newRecipient.amount = recipient.amount / 10 ** token.decimals;
                recipients.push(newRecipient);
            });
        });
        setRecipient(recipients);
        setLoading(false);
    }, []);

    if (loading) {
        return <Loading />;
    }

    return (
        <>
            <section className="flex flex-col flex-1 h-full overflow-auto lg:px-24 xl:px-52 px-8 gap-y-8 pb-4 ">
                <button
                    onClick={() => router.push("/send/approveTokens")}
                    className="sm:w-16 sm:h-16 w-10 h-10 mt-4 transition-all duration-100  flex active:shadow-none active:scale-100 active:translate-x-1 active:translate-y-1 justify-center items-center rounded-full shadow-neo-brutalism-sm border-2 sm:border-[3px] border-black"
                >
                    <HiArrowLongLeft className="transition-all duration-100 w-16 h-16 -top-[140%] -right-10" />
                </button>

                <div className="overflow-x-auto relative rounded-lg scrollbar-thin border-4 border-black shadow-neo-brutalism-lg h-full">
                    <table className="min-w-full divide-y-2 divide-primary text-sm ">
                        <thead className="ltr:text-left rtl:text-right">
                            <tr className="bg-primary bg-opacity-25 font-semibold text-xl xl:text-2xl">
                                <th className="whitespace-nowrap px-4 py-3 text-text">
                                    Amount
                                </th>
                                <th className="whitespace-nowrap px-4 py-3 text-text">
                                    Token
                                </th>
                                <th className="whitespace-nowrap px-4 py-3 text-text">
                                    Address
                                </th>
                            </tr>
                        </thead>

                        <tbody className=" text-center font-light">
                            {recipient.map((recipient, index) => (
                                <tr key={index}>
                                    <td className="px-4 py-3 xl:text-xl whitespace-nowrap">
                                        {recipient.amount > 999999
                                            ? Number(
                                                  recipient.amount
                                              ).toExponential(2)
                                            : recipient.amount}
                                    </td>
                                    <td className="px-4 py-3 xl:text-xl whitespace-nowrap">
                                        {recipient.name}
                                    </td>
                                    <td className="px-4 py-3 xl:text-xl whitespace-nowrap">
                                        {recipient.ensName}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="w-full flex items-center justify-end pr-8">
                    <button
                        className="sm:text-3xl sm:py-3 sm:px-12 text-lg px-4 py-1 rounded-full bg-gray-200 border-2 border-black active:shadow-none shadow-neo-brutalism-sm"
                        onClick={handleSign}
                    >
                        "sign"
                    </button>
                    {transferDetails.length > 0 && (
                        <SendToken
                            permitData={permitData}
                            transferDetails={transferDetails}
                            address={address}
                            signature={signature}
                        />
                    )}
                </div>
            </section>
            <BottomSig />
        </>
    );
};

export default Page;
