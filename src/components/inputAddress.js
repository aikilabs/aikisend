"use client";
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

  // Only attempt ENS resolution if it looks like an ENS name (contains '.')
  const isEnsName = address.includes('.') && !isAddress(address);
  
  const { data: ensResolvedAddress, isError: ensError } = useEnsAddress({
    name: isEnsName ? address : undefined,
    enabled: isEnsName,
  });

  const addRecipient = async () => {
    if (!isAddress(address)) {
      if (ensResolvedAddress) {
        // ENS resolved successfully
      } else {
        return;
      }
    }
    if (!address || !amount || amount <= 0) return;
    let newBalance =
      token.balance / 10 ** token.decimals -
      token.recipient.reduce(
        (acc, recipient) => acc + recipient.amount / 10 ** token.decimals,
        0
      );
    if (newBalance <= 0) return;
    if (amount > newBalance) return;
    const recipient = token.recipient.find(
      (recipient) =>
        recipient.address === address || recipient.address === ensResolvedAddress
    );
    if (recipient) {
      const newRecipientList = token.recipient.map((recipient) => {
        if (recipient.address === address || recipient.address === ensResolvedAddress) {
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
      if (ensResolvedAddress) {
        newAddress = ensResolvedAddress;
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
      if (token.token_address === newToken.token_address) {
        return newToken;
      } else {
        return token;
      }
    });
    dispatch(setSelectedToken(newSelectedToken));
  };

  const remainingBalance =
    token.balance / 10 ** token.decimals -
    token.recipient.reduce(
      (acc, recipient) => acc + recipient.amount / 10 ** token.decimals,
      0
    );

  return (
    <section className="border-2 border-primary-dark bg-primary-dark text-primary-light">
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-primary-light/20 px-4 py-3">
        <h1 className="text-lg font-bold">{token.name}</h1>
        <span className="text-sm">
          Balance: <span className="font-semibold text-accent">{remainingBalance.toFixed(4)}</span>
        </span>
      </div>

      {/* Input Row */}
      <div className="grid gap-4 p-4 md:grid-cols-[1fr_auto_auto]">
        <input
          type="text"
          onChange={(e) => setAddress(e.target.value)}
          className="w-full border-2 border-primary-light bg-transparent px-3 py-2 text-sm text-primary-light placeholder-primary-light/50 outline-none focus:border-accent"
          placeholder="Recipient address or ENS name"
        />
        <input
          type="number"
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border-2 border-primary-light bg-transparent px-3 py-2 text-sm text-primary-light placeholder-primary-light/50 outline-none focus:border-accent md:w-32"
          placeholder="Amount"
        />
        <button
          onClick={addRecipient}
          className="flex items-center justify-center gap-2 border-2 border-accent bg-accent px-4 py-2 font-semibold text-primary-dark transition-all hover:bg-transparent hover:text-accent"
        >
          <FaPlus className="h-3 w-3" />
          <span className="hidden sm:inline">Add</span>
        </button>
      </div>

      {/* Recipients Table */}
      {token.recipient.length > 0 && (
        <div className="border-t-2 border-primary-light/20">
          <div className="max-h-48 overflow-auto scrollbar-thin">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-primary-dark/95">
                <tr className="border-b border-primary-light/20 text-left text-xs uppercase tracking-wide text-primary-light/70">
                  <th className="px-4 py-2">Address</th>
                  <th className="px-4 py-2 text-right">Amount</th>
                  <th className="px-4 py-2 text-center w-16">Action</th>
                </tr>
              </thead>
              <tbody>
                {token.recipient.map((recipient, index) => (
                  <tr
                    key={index}
                    className="border-b border-primary-light/10 transition-colors hover:bg-primary-light/5"
                  >
                    <td className="px-4 py-3 font-mono text-xs md:text-sm">
                      {recipient.ensName.length > 20 
                        ? `${recipient.ensName.slice(0, 10)}...${recipient.ensName.slice(-8)}`
                        : recipient.ensName
                      }
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">
                      {(recipient.amount / 10 ** token.decimals).toFixed(4)} {token.name}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => removeRecipient(recipient.address)}
                        className="text-primary-light/50 transition-colors hover:text-red-400"
                        title="Remove recipient"
                      >
                        <FaMinus className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CSV Upload */}
      <div className="border-t-2 border-primary-light/20 p-4">
        <p className="mb-3 text-center text-xs text-primary-light/50">— or upload CSV —</p>
        <UploadCSV token={token} />
      </div>
    </section>
  );
};

export default InputAddress;
