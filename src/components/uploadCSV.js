import React, { useRef, useState } from "react";
import { FaFileCsv } from "react-icons/fa6";
import { isAddress } from "web3-validator";
// import {MoralisA} from "../../src/app/send/layout";
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
    // add total amount of addresses to the selected token
    const totalAmount = addressArray.reduce((acc, item) => {
      return acc + item.amount;
    }, 0);

    let newBalance =
      token.balance / 10 ** token.decimals -
      token.recipient.reduce(
        (acc, recipient) => acc + recipient.amount / 10 ** token.decimals,
        0,
      );
    if (newBalance <= 0) {
      toast.error("Insufficient Balance");
      return;
    }
    if (totalAmount > newBalance) {
      toast.error("Insufficient Balance");
      return;
    }

    // check if any of the addresses in addressesArray already exist in the selected token.recipient
    const newRecipientList = addressArray.map((recipient) => {
      const existingRecipient = token.recipient.find(
        (item) => item.address === recipient.address,
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
        toast.error("Incorrect ` address,amount` format");
        return;
      }
      let addresses = isCorrectFormat.map((item) => item.trim());
      const formattedAddresses = await Promise.all(
        addresses.map(async (item) => {
          let address = item.split(",")[0];
          let amount = item.split(",")[1];
          let ensName;

          // check if amount is a number and if number convert to number
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
        }),
      );
      const validAddresses = formattedAddresses.filter((address) => {
        return isAddress(address.address) && address.amount > 0;
      });
      const invalidAddresses = formattedAddresses.filter(
        (address) =>
          !isAddress(address.address) ||
          address.amount < 0 ||
          isNaN(address.amount),
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
    <div className="flex px-2 pb-8 md:px-6">
      {addressArray.length > 1 ? (
        <div className="flex w-full flex-col gap-2">
          <section className="flex w-full flex-col justify-between gap-2 md:flex-row">
            <div className="flex flex-1 flex-col">
              <h1>Valid Addresses, Amount</h1>
              <div className="h-full max-h-24 flex-1 space-y-1 overflow-auto rounded border-2 border-primary-light p-2">
                {addressArray.map((item, index) => (
                  <div key={index} className="text-[0.65rem] md:text-xs">
                    <span>{item.ensName ? item.ensName : item.address}</span>,{" "}
                    <span>{item.amount}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-1 flex-col">
              <h1>Invalid Addresses, Amount</h1>
              <div className="h-full max-h-24 space-y-1 overflow-auto rounded border-2 border-primary-light p-2">
                {invalidAddressArray.map((item, index) => (
                  <div key={index} className="text-[0.65rem] md:text-xs">
                    <span>{item.address}</span>, <span>{item.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
          <section className="flex gap-2">
            <button
              onClick={addAddresses}
              className="flex items-center gap-2 rounded-md border border-primary-dark bg-white px-4 py-1.5 text-sm text-primary-dark md:px-8 md:text-base"
            >
              Add
            </button>

            <button
              onClick={() => {
                setAddressArray([]);
                toast.success("Addresses Cleared");
              }}
              className="flex items-center gap-2 rounded-md border-2 border-white px-4 py-1.5 text-sm text-white md:px-8 md:text-base"
            >
              Clear
            </button>
          </section>
        </div>
      ) : (
        <>
          {loading ? (
            <div
              className={`flex h-40 w-full cursor-pointer flex-col justify-center gap-2 overflow-y-auto rounded-lg border-2 border-dashed p-4 `}
            >
              <span
                className={`flex flex-col items-center justify-center gap-2 text-center text-white ${
                  hoverEffect ? "text-gray-400" : ""
                } `}
              >
                {/* <FaFileCsv className="h-12 w-12" /> */}
                <span className="text-xs">Scanning File...</span>
              </span>
            </div>
          ) : (
            <label
              onDragOver={handleOver}
              onDragLeave={(e) => {
                e.preventDefault();
                setHoverEffect(false);
              }}
              onDrop={handleFileDrop}
              className={`flex h-40 w-full cursor-pointer flex-col justify-center gap-2 overflow-y-auto rounded-lg border-2 border-dashed p-4 transition-colors duration-100 ${
                hoverEffect ? "border-gray-400 text-gray-400" : ""
              }`}
            >
              <span
                className={`flex flex-col items-center justify-center gap-2 text-center text-white ${
                  hoverEffect ? "text-gray-400" : ""
                } `}
              >
                <FaFileCsv
                  className={`h-12 w-12 transition-colors duration-100 ${
                    hoverEffect ? "border-gray-400 text-gray-400" : ""
                  }`}
                />
                <span
                  className={`text-xs transition-colors duration-100 ${
                    hoverEffect ? "border-gray-400 text-gray-400" : ""
                  }`}
                >
                  Drop csv file, or Click in this area to select.
                </span>
              </span>

              <input
                type="file"
                name="fileUpload"
                className="hidden"
                title=" "
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
