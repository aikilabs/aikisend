"use client";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import BottomSig from "@/utils/bottomSig";
import { domain, types } from "./data";
import { createWalletClient, custom } from "viem";
import { goerli } from "viem/chains";
import { useRouter } from "next/navigation";
import Loading from "../loading";
import { HiArrowLeft, HiArrowLongRight } from "react-icons/hi2";
import SendToken from "@/components/sendToken";
import { getRandomNonce, MAX_UINT256 } from "../helpers";

const Page = () => {
    const [transferDetails, setTransferDetails] = useState([]);
    const [permitData, setPermitData] = useState({});
    const [recipient, setRecipient] = useState([]);
    const [loading, setLoading] = useState(false);
    const [signature, setSignature] = useState(null);
    const [walletClient, setWalletClient] = useState(null);

    const approvedTokens = useSelector((state) => state.aikiSend.approvedToken);
    const chainId = useSelector((state) => state.aikiSend.chainId);
    const account = useSelector((state) => state.aikiSend.address);
    const address = useSelector((state) => state.aikiSend.address); //3

    const router = useRouter();

    useEffect(() => {
        const walletClient = createWalletClient({
            account,
            chain: goerli,
            transport: custom(window?.ethereum),
        });
        setWalletClient(walletClient);
    }, []);

    async function signTransferData() {
        if (!account) return;

        const permit = Object.create(null);
        const tokenPermissionsData = [];
        const details = [];

        approvedTokens.forEach((token) => {
            console.log("recipients", token.recipient);

            token.recipient.forEach(({ address, amount }) => {
                console.log("requested amount ", amount);
                tokenPermissionsData.push({
                    token: token.token_address,
                    amount: `${amount}`,
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

        setPermitData(permit); // 1
        setTransferDetails(details); //2

        try {
            const signature = await walletClient.signTypedData({
                account,
                domain: { ...domain, chainId: chainId },
                types,
                primaryType: "PermitBatchTransferFrom",
                message: {
                    ...permit,
                    spender: account,
                },
            });
            console.log("signatuer viem ::", signature);
            setSignature(signature); // 4
        } catch (err) {
            setSignature(null);
            console.log(err.message);
        }
    }

    useEffect(() => {
        console.log("address", address);
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
            <section className="flex flex-col h-full scrollbar-thin overflow-auto p-4 gap-y-8 justify-center items-center ">
                <button
                    onClick={() => router.push("/send/approveTokens")}
                    className=" transition-all duration-100 flex justify-start items-start rounded-full w-full"
                >
                    <HiArrowLeft className="transition-all duration-100 w-8 h-8 -top-[140%] -right-10" />
                </button>

                <div className="overflow-auto relative rounded scrollbar-thin border-2 border-[#898a90] h-full max-w-6xl w-full">
                    <table className="min-w-full divide-y-2 divide-[#898a90] text-sm ">
                        <thead className="ltr:text-left rtl:text-right">
                            <tr className="bg-[#898a90] bg-opacity-25 font-semibold text-xl xl:text-2xl">
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
                    {!Boolean(signature) ? (
                        <button
                            className="sm:text-3xl sm:py-3 sm:px-12 text-lg px-4 py-1 rounded bg-[#898a90] bg-opacity-50"
                            onClick={signTransferData}
                        >
                            Sign Data
                        </button>
                    ) : (
                        <SendToken
                            permitData={permitData}
                            transferDetails={transferDetails}
                            address={address}
                            signature={signature}
                        />
                    )}
                </div>
            </section>
            {/* <BottomSig /> */}
        </>
    );
};

export default Page;
