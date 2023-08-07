import React, { useEffect, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedToken } from "@/redux/aikiSend";
import { isAddress } from "web3-validator";
import { useEnsAddress } from "wagmi";

const InputAddress = ({ token }) => {
    const [address, setAddress] = useState("");
    const [amount, setAmount] = useState(0);
    const dispatch = useDispatch();
    const selectedToken = useSelector((state) => state.aikiSend.selectedToken);

    const { data, isError, isLoading } = useEnsAddress({
        name: address,
    });

    const addRecipient = async () => {
        if (!isAddress(address)) {
            if (data) {
                // setAddress(data);
            } else {
                return;
            }
        }
        if (!address || !amount || amount <= 0) return;
        let newBalance =
            token.balance / 10 ** token.decimals -
            token.recipient.reduce(
                (acc, recipient) =>
                    acc + recipient.amount / 10 ** token.decimals,
                0
            );
        if (newBalance <= 0) return;
        if (amount > newBalance) return;
        const recipient = token.recipient.find(
            (recipient) => recipient.address === address
        );
        if (recipient) {
            const newRecipientList = token.recipient.map((recipient) => {
                if (recipient.address === address) {
                    return {
                        ...recipient,
                        amount:
                            recipient.amount + amount * 10 ** token.decimals,
                    };
                } else {
                    return recipient;
                }
            });
            const newToken = { ...token, recipient: newRecipientList };
            const newSelectedToken = selectedToken.map((token) => {
                if (token.token_address === newToken.token_address) {
                    return newToken;
                } else {
                    return token;
                }
            });
            dispatch(setSelectedToken(newSelectedToken));
        } else {
            let ensName = address;
            let newAddress = address;
            if (data) {
                newAddress = data;
            }
            const newRecipient = {
                address: newAddress,
                ensName,
                amount: amount * 10 ** token.decimals,
            };
            const newRecipientList = [...token.recipient, newRecipient];
            const newToken = { ...token, recipient: newRecipientList };
            const newSelectedToken = selectedToken.map((token) => {
                if (token.token_address === newToken.token_address) {
                    return newToken;
                } else {
                    return token;
                }
            });
            dispatch(setSelectedToken(newSelectedToken));
        }
    };
    const removeRecipient = async (address) => {
        const newRecipientList = token.recipient.filter(
            (recipient) => recipient.address !== address
        );
        const newToken = { ...token, recipient: newRecipientList };
        const newSelectedToken = selectedToken.map((token) => {
            // if (token.recipient.length <= 0) {
            //     return;
            // }
            if (token.token_address === newToken.token_address) {
                return newToken;
            } else {
                return token;
            }
        });
        dispatch(setSelectedToken(newSelectedToken));
        // dispatch(setSelectedToken(newToken));
    };

    useEffect(() => {
        // console.log({ data });
    }, [data]);

    return (
        <section className="py-2 bg-gray-500 text-white mx-4 rounded">
            <div
                className={`gap-x-2 gap-y-3 pb-4 grid md:grid-cols-5 md:justify-end md:items-end px-4 py-2`}
            >
                <h1 className="flex items-end md:text-lg font-semibold md:mb-2">
                    {token.name}
                </h1>
                <input
                    type="text"
                    id="token-address"
                    onChange={(e) => setAddress(e.target.value)}
                    className="px-2 text-black text-xs md:text-sm h-8 md:h-10 flex items-end md:col-span-3 rounded py-0.5"
                    placeholder="Input Receiver address"
                />
                <div className="flex items-end gap-4 w-full md:w-auto">
                    <div className=" flex flex-1 w-full flex-col h-full md:items-end justify-end">
                        <h3 className="text-[0.6rem]">
                            Balance:{" "}
                            {token.balance / 10 ** token.decimals -
                                token.recipient.reduce(
                                    (acc, recipient) =>
                                        acc +
                                        recipient.amount / 10 ** token.decimals,
                                    0
                                )}
                        </h3>
                        <input
                            type="text"
                            onChange={(e) => setAmount(e.target.value)}
                            id="token-amount"
                            className="px-2 text-black text-xs md:text-sm font-light rounded w-full h-8 md:h-10 py-0.5"
                            placeholder="amount"
                        />
                    </div>
                    <FaPlus
                        onClick={addRecipient}
                        className="md:text-2xl mb-2 cursor-pointer"
                    />
                </div>
            </div>
            <div className="py-2 px-4 flex flex-col gap-y-1">
                {token.recipient && (
                    <>
                        {/* <div>
                            <h2 className="underline">List of Recipient</h2>
                        </div> */}
                        <div className="flex w-full items-center flex-col justify-center font-light text-sm px-2 gap-y-4 md:gap-y-1">
                            {token.recipient.map((recipient, index) => {
                                return (
                                    <div
                                        key={index}
                                        className="flex flex-col md:flex-row md:items-center md:justify-between w-full "
                                    >
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-start gap-x-2 gap-y-1">
                                            <div
                                                onClick={() =>
                                                    removeRecipient(
                                                        recipient.address
                                                    )
                                                }
                                                className="w-4 h-4 flex items-center justify-center"
                                            >
                                                <FaMinus className="w-4 h-4 cursor-pointer " />
                                            </div>
                                            <h3 className="text-xs md:text-base break-words">
                                                {recipient.ensName}
                                            </h3>
                                        </div>
                                        <h3 className="text-xs md:text-base font-semibold">
                                            {recipient.amount /
                                                10 ** token.decimals}{" "}
                                            {token.name}
                                        </h3>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </section>
    );
};

export default InputAddress;
