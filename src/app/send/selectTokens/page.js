"use client";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import BottomSig from "@/utils/bottomSig";
import Select from "react-select";
import { setSelectedToken } from "@/redux/aikiSend";
import InputAddress from "@/components/inputAddress";
import { HiArrowLongRight } from "react-icons/hi2";
import { useRouter } from "next/navigation";

const Page = () => {
    const [availableTokens, setAvailableTokens] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [tokenOfChoice, setTokenOfChoice] = useState([]);
    const [nextButton, setNextButton] = useState(true);

    const dispatch = useDispatch();
    const router = useRouter();

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
        const newSelectedToken = tokenOfChoice.map((token) => {
            const existingToken = selectedToken.find(
                (selectedToken) => selectedToken.token_address === token.value
            );
            if (existingToken) {
                return existingToken;
            }
            const ans = userTokens.find(
                (userToken) => userToken.token_address === token.value
            );
            return {
                name: ans.name,
                balance: ans.balance,
                decimals: ans.decimals,
                token_address: ans.token_address,
                recipient: [],
                allowance: null,
                approved: false,
            };
            // const newTokens = [...newSelectedToken, ans];
            // dispatch(setSelectedToken([...newTokens]));
            // const newAvailableTokens = availableTokens.filter(
            //     (availableToken) => availableToken.value !== token.value
            // );
            // setAvailableTokens(newAvailableTokens);
        });

        dispatch(setSelectedToken([...newSelectedToken]));
    }, [tokenOfChoice]);

    useEffect(() => {
        if (selectedToken.length > 0) {
            const recipient = selectedToken.reduce(
                (acc, token) => acc + token.recipient.length,
                0
            );
            if (recipient > 0) {
                setNextButton(false);
            }
        }
    }, [selectedToken]);

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
            maxHeight: "60px",
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
            <div className="flex-1 h-full gap-y-12 flex flex-col items-center justify-center px-6 ">
                <div className="flex relative max-w-2xl 3xl:max-w-3xl flex-col  w-full">
                    <h1 className="text-sm md:text-base">Select Tokens</h1>
                    <Select
                        className=" max-w-2xl 3xl:max-w-3xl cursor-pointer w-full shadow-neo-brutalism-sm rounded"
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
                </div>
                <div className="h-full border-4 scrollbar-thin  max-h-80 overflow-auto flex flex-col gap-y-4 py-4 border-black max-w-4xl 3xl:max-w-5xl flex-1 w-full rounded-xl shadow-neo-brutalism-lg">
                    {selectedToken.map((token, index) => {
                        return <InputAddress token={token} key={index} />;
                    })}
                </div>
                <div className="w-full 3xl:mt-8 flex justify-end max-w-3xl 3xl:max-w-4xl px-8 md:px-4">
                    <button
                        onClick={() => router.push("/send/approveTokens")}
                        disabled={nextButton}
                        className={`relative text-3xl transition-all duration-200 flex items-end flex-col w-min   ${
                            nextButton
                                ? "text-gray-400"
                                : "text-black cursor-pointer group"
                        }`}
                    >
                        <HiArrowLongRight className="absolute group-hover:translate-x-4 transition-all duration-200 w-24 h-24 -top-[140%] -right-10" />
                        NEXT
                    </button>
                </div>
            </div>

            <BottomSig />
        </section>
    );
};

export default Page;
