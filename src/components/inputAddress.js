import React, { useEffect, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedToken } from "@/redux/aikiSend";
import { isAddress } from "web3-validator";
import { useEnsAddress } from "wagmi";
import UploadCSV from "./uploadCSV";

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
        (acc, recipient) => acc + recipient.amount / 10 ** token.decimals,
        0,
      );
    if (newBalance <= 0) return;
    if (amount > newBalance) return;
    const recipient = token.recipient.find(
      (recipient) =>
        recipient.address === address || recipient.address === data,
    );
    if (recipient) {
      const newRecipientList = token.recipient.map((recipient) => {
        if (recipient.address === address || recipient.address === data) {
          return {
            ...recipient,
            amount: recipient.amount + amount * 10 ** token.decimals,
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
      (recipient) => recipient.address !== address,
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
    <section className="mx-4 rounded bg-primary-dark py-2 text-white">
      <div
        className={`grid gap-x-2 gap-y-3 px-4 py-2 pb-4 md:grid-cols-5 md:items-end md:justify-end`}
      >
        <h1 className="flex items-end font-semibold md:mb-2 md:text-lg">
          {token.name}
        </h1>
        <input
          type="text"
          id="token-address"
          onChange={(e) => setAddress(e.target.value)}
          className="flex h-8 items-end rounded px-2 py-0.5 text-xs text-black md:col-span-3 md:h-10 md:text-sm"
          placeholder="Input Receiver address"
        />
        <div className="flex w-full items-end gap-4 md:w-auto">
          <div className=" flex h-full w-full flex-1 flex-col justify-end md:items-end">
            <h3 className="text-[0.6rem]">
              Balance:{" "}
              {token.balance / 10 ** token.decimals -
                token.recipient.reduce(
                  (acc, recipient) =>
                    acc + recipient.amount / 10 ** token.decimals,
                  0,
                )}
            </h3>
            <input
              type="text"
              onChange={(e) => setAmount(e.target.value)}
              id="token-amount"
              className="h-8 w-full rounded px-2 py-0.5 text-xs font-light text-black md:h-10 md:text-sm"
              placeholder="amount"
            />
          </div>
          <FaPlus
            onClick={addRecipient}
            className="mb-2 cursor-pointer md:text-2xl"
          />
        </div>
      </div>
      <div className="flex flex-col gap-y-1 px-4 py-2">
        {token.recipient && (
          <>
            {/* <div>
                            <h2 className="underline">List of Recipient</h2>
                        </div> */}
            <div className="flex w-full flex-col items-center justify-center gap-y-4 px-2 text-sm font-light md:gap-y-1">
              {token.recipient.map((recipient, index) => {
                return (
                  <div
                    key={index}
                    className="flex w-full flex-col md:flex-row md:items-center md:justify-between "
                  >
                    <div className="flex flex-col gap-x-2 gap-y-1 md:flex-row md:items-center md:justify-start">
                      <div
                        onClick={() => removeRecipient(recipient.address)}
                        className="flex h-4 w-4 items-center justify-center"
                      >
                        <FaMinus className="h-4 w-4 cursor-pointer " />
                      </div>
                      <h3 className="break-words text-xs md:text-base">
                        {recipient.ensName}
                      </h3>
                    </div>
                    <h3 className="text-xs font-semibold md:text-base">
                      {recipient.amount / 10 ** token.decimals} {token.name}
                    </h3>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
      <div className="space-y-4">
        <p className="text-center">or</p>
        <UploadCSV />
      </div>
    </section>
  );
};

export default InputAddress;
