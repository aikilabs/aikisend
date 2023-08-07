"use client";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import BottomSig from "@/utils/bottomSig";
import Select from "react-select";
import { setSelectedToken } from "@/redux/aikiSend";
import InputAddress from "@/components/inputAddress";
import { useRouter } from "next/navigation";
import Loading from "../loading";

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
        // console.log({ availableTokens });
        setAvailableTokens(availableTokens);

        setIsLoading(false);
    };
    useEffect(() => {
        handleEffect();
        setTokenOfChoice([]);
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
                // allowance: null,
                approved: null,
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
                return setNextButton(false);
            } else {
                setNextButton(true);
            }
        } else {
            setNextButton(true);
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
    // if (true) {
    //     return <Loading />;
    // }

    return (
        <>
            <section className="flex flex-col flex-1 h-full overflow-auto">
                <div className="h-full overflow-auto scrollbar-thin gap-y-4 flex flex-col items-center px-4 py-2 ">
                    <div className="flex relative max-w-2xl 3xl:max-w-3xl flex-col w-full">
                        <h1 className="text-sm md:text-base">Select Tokens to send</h1>
                        <Select
                            className=" max-w-2xl 3xl:max-w-3xl cursor-pointer w-full rounded"
                            styles={customStyles}
                            classNamePrefix="select token"
                            closeMenuOnSelect={false}
                            isLoading={isLoading}
                            isClearable={true}
                            isMulti
                            key={`select-token-${availableTokens.length}`}
                            // value={{}}
                            isSearchable={true}
                            name="Select Token"
                            options={availableTokens}
                            onChange={(selectedOption) => {
                                setTokenOfChoice(selectedOption);
                            }}
                        />
                    </div>
                    <div className="flex justify-end w-full">
                        <button
                            onClick={() => router.push("/send/approveTokens")}
                            disabled={nextButton}
                            className={`sm:px-10 px-4 py-1.5 text-xs sm:text-base rounded bg-[#898a90]  transition-all duration-100 ${
                                nextButton
                                    ? "text-white bg-opacity-20"
                                    : "text-black cursor-pointer bg-opacity-50"
                            }`}
                        >
                            Next
                        </button>
                    </div>
                    <div className=" flex flex-col gap-y-6 mb-8 border-black max-w-4xl 3xl:max-w-5xl w-full ">
                        {selectedToken.map((token, index) => {
                            return <InputAddress token={token} key={index} />;
                        })}
                    </div>
                </div>
            </section>
            {/* <BottomSig /> */}
        </>
    );
};

export default Page;
