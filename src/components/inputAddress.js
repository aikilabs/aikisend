import React from "react";

const InputAddress = ({ token }) => {
    return (
        <div className="gap-x-2 grid grid-cols-5 justify-end items-end px-4 py-2">
            <h1 className="flex items-end">{token.name}</h1>
            <input
                type="text"
                id="default-input"
                className="border-2 px-2 text-sm border-black h-10 flex items-end shadow-neo-brutalism-xs col-span-3 rounded py-0.5"
                placeholder="Input Receiver address"
            />
            <div className=" flex flex-col h-full items-end justify-end">
                <h3 className="text-[0.6rem]">
                    Balance: {token.balance / 10 ** token.decimals}
                </h3>
                <input
                    type="text"
                    id="default-input"
                    className="border-2 px-2 text-sm border-black rounded shadow-neo-brutalism-xs w-full h-10 py-0.5"
                    placeholder="amount"
                />
            </div>
        </div>
    );
};

export default InputAddress;
