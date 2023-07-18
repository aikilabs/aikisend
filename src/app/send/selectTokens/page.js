"use client";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import BottomSig from "@/utils/bottomSig";
import Select from "react-select";
import { setSelectedToken } from "@/redux/aikiSend";
import InputAddress from "@/components/inputAddress";

const Page = () => {
    const [availableTokens, setAvailableTokens] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [tokenOfChoice, setTokenOfChoice] = useState([]);

    const dispatch = useDispatch();

    const address = useSelector((state) => state.aikiSend.address);
    const userTokens = useSelector((state) => state.aikiSend.availableTokens);
    const selectedToken = useSelector((state) => state.aikiSend.selectedToken);

    const handleEffect = async () => {
        setIsLoading(true);
        const availableTokens = userTokens.map((token) => {
            return {
                value: token.token_address,
                label: `${token.name} (${
                    token.balance / 10 ** token.decimals
                })`,
            };
        });
        console.log({ availableTokens });
        setAvailableTokens(availableTokens);

        setIsLoading(false);
    };
    useEffect(() => {
        handleEffect();
    }, [userTokens]);

    useEffect(() => {
        const selectedToken = tokenOfChoice.map((token) => {
            const ans = userTokens.find(
                (userToken) => userToken.token_address === token.value
            );
            return ans;
            // const newTokens = [...selectedToken, ans];
            // dispatch(setSelectedToken([...newTokens]));
            // const newAvailableTokens = availableTokens.filter(
            //     (availableToken) => availableToken.value !== token.value
            // );
            // setAvailableTokens(newAvailableTokens);
        });

        dispatch(setSelectedToken([...selectedToken]));
    }, [tokenOfChoice]);

    const addSelectedToken = () => {
        // console.log({ tokenOfChoice });
        // const ans = userTokens.find(
        //     (token) => token.token_address === tokenOfChoice
        // );
        // const newTokens = [...selectedToken, ans];
        // dispatch(setSelectedToken([...newTokens]));
        // const newAvailableTokens = availableTokens.filter(
        //     (token) => token.value !== tokenOfChoice
        // );
        // setAvailableTokens(newAvailableTokens);
        tokenOfChoice.map((token) => {
            const ans = userTokens.find(
                (userToken) => userToken.token_address === token.value
            );
            const newTokens = [...selectedToken, ans];
            dispatch(setSelectedToken([...newTokens]));
        });
    };

    const customStyles = {
        option: (defaultStyles, state) => ({
            ...defaultStyles,
            "&:hover": {
                backgroundColor: "rgba(0,0,0,0.05)",
            },
            // color: state.isSelected ? "#191970" : "#000",
            backgroundColor: state.isSelected ? "#000" : "#fff",
            // borderWidth: "3px",
            // backgroundColor: "#000",
            padding: "10px 12px",
        }),

        control: (defaultStyles, state) => ({
            ...defaultStyles,
            borderWidth: "3px",
            // borderRadius: "8px",
            maxHeight: "57px",
            overflow: "auto",
            // backgroundColor: "#212529",
            outline: "none",
            ring: "0px none transparent",
            borderColor: "rgb(0 0 0 )",
            padding: "8px 12px",
            boxShadow: "none",

            "&:hover": {
                // borderColor: state.isFocused ? "transparent" : "#000",
            },
            // border: "none",
            // boxShadow: "none",
        }),
        singleValue: (defaultStyles) => ({ ...defaultStyles, color: "#000" }),
    };

    return (
        <section className="flex flex-col flex-1 h-full ">
            <div className="flex-1 h-full gap-y-12 py-12 flex flex-col items-center  justify-center">
                <div className="flex relative max-w-2xl 3xl:max-w-3xl flex-col  w-full">
                    <h1 className="">Select Tokens</h1>
                    <Select
                        className=" max-w-2xl 3xl:max-w-3xl w-full shadow-neo-brutalism-sm rounded"
                        styles={customStyles}
                        classNamePrefix="select token"
                        closeMenuOnSelect={false}
                        isLoading={isLoading}
                        isClearable={true}
                        isMulti
                        isSearchable={true}
                        name="Select Token"
                        options={availableTokens}
                        onChange={(selectedOption) => {
                            setTokenOfChoice(selectedOption);
                        }}
                    />
                    {/* <button
                            disabled={!tokenOfChoice}
                            onClick={addSelectedToken}
                            className={`h-full transition-all  duration-200  px-8 bg-gray-300 border-[3px]  border-black rounded-lg text-lg font-bold shadow-neo-brutalism-sm ${
                                tokenOfChoice
                                    ? "active:scale-100 active:shadow-none hover:scale-105"
                                    : "text-gray-500 cursor-not-allowed"
                            }`}
                        >
                            Add
                        </button> */}
                </div>
                <div className="h-full border-4 scrollbar-thin  max-h-80 overflow-auto flex flex-col gap-y-4 py-4 border-black max-w-4xl 3xl:max-w-5xl flex-1 w-full rounded-xl shadow-neo-brutalism-lg">
                    {selectedToken.map((token) => {
                        return <InputAddress token={token} />;
                    })}
                </div>
            </div>

            <BottomSig />
        </section>
    );
};

export default Page;
