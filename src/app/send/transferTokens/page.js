"use client";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { domain, types } from "./data";
import { useRouter } from "next/navigation";
import Loading from "../loading";
import { HiArrowLeft } from "react-icons/hi2";
import SendToken from "@/components/sendToken";
import { getRandomNonce, MAX_UINT256 } from "../helpers";
import { useWalletClient } from "wagmi";

const Page = () => {
    const [transferDetails, setTransferDetails] = useState([]);
    const [permitData, setPermitData] = useState({});
    const [recipient, setRecipient] = useState([]);
    const [loading, setLoading] = useState(false);
    const [signature, setSignature] = useState(null);

    const approvedTokens = useSelector((state) => state.aikiSend.approvedToken);
    const chainId = useSelector((state) => state.aikiSend.chainId);
    const account = useSelector((state) => state.aikiSend.address);
    const address = useSelector((state) => state.aikiSend.address);

    const router = useRouter();
    
    // Use wagmi's wallet client which properly handles the connected account and chain
    const { data: walletClient } = useWalletClient();

    async function signTransferData() {
        if (!account || !walletClient) return;

        const permit = Object.create(null);
        const tokenPermissionsData = [];
        const details = [];

        approvedTokens.forEach((token) => {
            token.recipient.forEach(({ address, amount }) => {
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
        permit.nonce = getRandomNonce();
        permit.deadline = MAX_UINT256;

        setPermitData(permit);
        setTransferDetails(details);

        try {
            const signature = await walletClient.signTypedData({
                domain: { ...domain, chainId: chainId },
                types,
                primaryType: "PermitBatchTransferFrom",
                message: {
                    ...permit,
                    spender: account,
                },
            });
            setSignature(signature);
        } catch (err) {
            setSignature(null);
            console.log(err.message);
        }
    }

    useEffect(() => {
        setLoading(true);
        if (approvedTokens.length === 0) {
            return router.push("/send/approveTokens");
        }

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
        <section className="flex flex-1 flex-col overflow-auto">
            <div className="flex flex-1 flex-col gap-y-6 overflow-auto p-4 scrollbar-thin md:p-6">
                {/* Header */}
                <div className="flex items-start gap-4">
                    <button
                        onClick={() => router.push("/send/approveTokens")}
                        className="border-2 border-primary-dark p-2 transition-all hover:bg-primary-dark hover:text-primary-light"
                    >
                        <HiArrowLeft className="h-5 w-5" />
                    </button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold md:text-3xl">Review & Send</h1>
                        <p className="mt-1 text-sm text-primary-dark/70">
                            Review your transfers below, then sign and send.
                        </p>
                    </div>
                </div>

                {/* Transfer Table */}
                <div className="flex-1 overflow-auto border-2 border-primary-dark">
                    <table className="w-full text-sm">
                        <thead className="sticky top-0 bg-primary-light">
                            <tr className="border-b-2 border-primary-dark bg-primary-dark text-left text-xs uppercase tracking-wide text-primary-light">
                                <th className="px-4 py-3">Token</th>
                                <th className="px-4 py-3 text-right">Amount</th>
                                <th className="px-4 py-3">Recipient</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recipient.map((r, index) => (
                                <tr
                                    key={index}
                                    className="border-b border-primary-dark/20 transition-colors hover:bg-primary-dark/5"
                                >
                                    <td className="px-4 py-4 font-semibold">{r.name}</td>
                                    <td className="px-4 py-4 text-right font-mono">
                                        {r.amount > 999999
                                            ? Number(r.amount).toExponential(2)
                                            : r.amount.toFixed(4)}
                                    </td>
                                    <td className="px-4 py-4 font-mono text-xs">
                                        {r.ensName.length > 25
                                            ? `${r.ensName.slice(0, 12)}...${r.ensName.slice(-10)}`
                                            : r.ensName}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Summary */}
                <div className="flex items-center justify-between border-2 border-primary-dark bg-primary-dark/5 px-4 py-3">
                    <span className="text-sm font-semibold">Total Transfers</span>
                    <span className="font-mono text-lg font-bold">{recipient.length}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4">
                    {!Boolean(signature) ? (
                        <button
                            className="border-2 border-primary-dark bg-primary-dark px-8 py-3 text-lg font-semibold text-primary-light shadow-home-shadow transition-all hover:shadow-none"
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
            </div>
        </section>
    );
};

export default Page;
