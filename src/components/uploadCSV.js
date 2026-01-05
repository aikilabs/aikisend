"use client";
import React, { useRef, useState } from "react";
import { FaFileCsv } from "react-icons/fa6";
import { isAddress } from "web3-validator";
import { setSelectedToken } from "@/redux/aikiSend";
import { useSelector, useDispatch } from "react-redux";
import { Moralis } from "@/app/send/layout";
import toast from "react-hot-toast";

const UploadCSV = ({ token }) => {
  const [addressArray, setAddressArray] = useState([]);
  const [invalidAddressArray, setInvalidAddressArray] = useState([]);
  const [hoverEffect, setHoverEffect] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const selectedToken = useSelector((state) => state.aikiSend.selectedToken);
  const dispatch = useDispatch();

  const addAddresses = async () => {
    const totalAmount = addressArray.reduce((acc, item) => {
      return acc + item.amount;
    }, 0);

    let newBalance =
      token.balance / 10 ** token.decimals -
      token.recipient.reduce(
        (acc, recipient) => acc + recipient.amount / 10 ** token.decimals,
        0
      );
    if (newBalance <= 0) {
      toast.error("Insufficient Balance");
      return;
    }
    if (totalAmount > newBalance) {
      toast.error("Insufficient Balance");
      return;
    }

    const newRecipientList = addressArray.map((recipient) => {
      const existingRecipient = token.recipient.find(
        (item) => item.address === recipient.address
      );
      if (existingRecipient) {
        return {
          ...existingRecipient,
          ensName: recipient.ensName || recipient.address,
          amount: recipient.amount * 10 ** token.decimals,
        };
      } else {
        return {
          address: recipient.address,
          ensName: recipient.ensName || recipient.address,
          amount: recipient.amount * 10 ** token.decimals,
        };
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
    setAddressArray([]);
    setInvalidAddressArray([]);
    toast.success("Addresses Added");
  };

  const fileHandler = async (file) => {
    try {
      if (!file.name.endsWith(".csv")) {
        toast.error("File not Supported");
        return;
      }
      const text = await file.text();
      const lines = text.split("\n");
      const isCorrectFormat = lines.filter((item) => {
        const split = item.split(",");
        return split.length === 2;
      });
      if (isCorrectFormat.length <= 0) {
        toast.error("Incorrect `address,amount` format");
        return;
      }
      let addresses = isCorrectFormat.map((item) => item.trim());
      const formattedAddresses = await Promise.all(
        addresses.map(async (item) => {
          let address = item.split(",")[0];
          let amount = item.split(",")[1];
          let ensName;

          if (!isNaN(amount)) {
            amount = Number(amount);
          }

          if (!isAddress(address)) {
            ensName = address;
            try {
              const response = await Moralis.EvmApi.resolve.resolveENSDomain({
                domain: address,
              });
              address = response.raw.address;
            } catch (e) {
              console.log(e);
            }
          }

          return { address, amount, ensName };
        })
      );
      const validAddresses = formattedAddresses.filter((address) => {
        return isAddress(address.address) && address.amount > 0;
      });
      const invalidAddresses = formattedAddresses.filter(
        (address) =>
          !isAddress(address.address) ||
          address.amount < 0 ||
          isNaN(address.amount)
      );
      if (validAddresses.length <= 0) {
        toast.error("No valid addresses found");
        return;
      }

      setAddressArray(validAddresses);
      setInvalidAddressArray(invalidAddresses);
      return { validAddresses, invalidAddresses };
    } catch (error) {
      return { error };
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (e.target.files) {
      let file = e.target.files[0];
      await fileHandler(file);
    }
    e.target.value = "";
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
    setLoading(false);
  };

  const handleFileDrop = async (e) => {
    e.preventDefault();
    setLoading(true);
    setHoverEffect(false);
    if (e.dataTransfer.files[0]) {
      let file = e.dataTransfer.files[0];
      await fileHandler(file);
    }
    setLoading(false);
  };

  const handleOver = (e) => {
    e.preventDefault();
    setHoverEffect(true);
  };

  return (
    <div className="flex w-full">
      {addressArray.length > 0 ? (
        <div className="flex w-full flex-col gap-4">
          {/* Preview Tables */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Valid Addresses */}
            <div className="flex flex-col">
              <h2 className="mb-2 text-xs font-semibold text-primary-light/70">
                Valid Addresses ({addressArray.length})
              </h2>
              <div className="max-h-24 overflow-auto border-2 border-primary-light/30 bg-primary-light/5 p-2 scrollbar-thin">
                {addressArray.map((item, index) => (
                  <div key={index} className="flex justify-between text-xs">
                    <span className="truncate">
                      {item.ensName || `${item.address.slice(0, 8)}...`}
                    </span>
                    <span className="font-mono">{item.amount}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Invalid Addresses */}
            {invalidAddressArray.length > 0 && (
              <div className="flex flex-col">
                <h2 className="mb-2 text-xs font-semibold text-red-400">
                  Invalid Addresses ({invalidAddressArray.length})
                </h2>
                <div className="max-h-24 overflow-auto border-2 border-red-400/30 bg-red-400/5 p-2 scrollbar-thin">
                  {invalidAddressArray.map((item, index) => (
                    <div key={index} className="flex justify-between text-xs text-red-400">
                      <span className="truncate">{item.address}</span>
                      <span className="font-mono">{item.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={addAddresses}
              className="border-2 border-accent bg-accent px-6 py-2 text-sm font-semibold text-primary-dark transition-all hover:bg-transparent hover:text-accent"
            >
              Add All
            </button>
            <button
              onClick={() => {
                setAddressArray([]);
                setInvalidAddressArray([]);
                toast.success("Cleared");
              }}
              className="border-2 border-primary-light/50 px-6 py-2 text-sm font-semibold text-primary-light/70 transition-all hover:border-primary-light hover:text-primary-light"
            >
              Clear
            </button>
          </div>
        </div>
      ) : (
        <>
          {loading ? (
            <div className="flex h-24 w-full flex-col items-center justify-center gap-2 border-2 border-dashed border-primary-light/30">
              <div className="h-5 w-5 animate-spin border-2 border-transparent border-t-accent"></div>
              <span className="text-xs text-primary-light/50">Scanning file...</span>
            </div>
          ) : (
            <label
              onDragOver={handleOver}
              onDragLeave={(e) => {
                e.preventDefault();
                setHoverEffect(false);
              }}
              onDrop={handleFileDrop}
              className={`flex h-24 w-full cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed transition-all ${
                hoverEffect
                  ? "border-accent bg-accent/10"
                  : "border-primary-light/30 hover:border-primary-light/50"
              }`}
            >
              <FaFileCsv
                className={`h-8 w-8 transition-colors ${
                  hoverEffect ? "text-accent" : "text-primary-light/50"
                }`}
              />
              <span
                className={`text-xs transition-colors ${
                  hoverEffect ? "text-accent" : "text-primary-light/50"
                }`}
              >
                Drop CSV or click to upload
              </span>
              <input
                type="file"
                name="fileUpload"
                className="hidden"
                accept=".csv"
                ref={fileInputRef}
                onChange={handleFileUpload}
              />
            </label>
          )}
        </>
      )}
    </div>
  );
};

export default UploadCSV;
