"use client";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
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
                approved: null,
            };
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
                backgroundColor: "#D07A25",
                color: "#F5F5F5",
            },
            color: state.isSelected ? "#F5F5F5" : "#232B2B",
            backgroundColor: state.isSelected ? "#232B2B" : "#F5F5F5",
            padding: "12px 16px",
            cursor: "pointer",
            fontFamily: "Victor Mono, monospace",
        }),

        control: (defaultStyles, state) => ({
            ...defaultStyles,
            borderWidth: "2px",
            borderRadius: "0",
            maxHeight: "60px",
            overflow: "auto",
            outline: "none",
            borderColor: "#232B2B",
            backgroundColor: "#F5F5F5",
            padding: "8px 12px",
            boxShadow: state.isFocused ? "-4px 4px 0px 0px #D07A25" : "none",
            fontFamily: "Victor Mono, monospace",
            "&:hover": {
                borderColor: "#232B2B",
            },
        }),

        multiValue: (defaultStyles) => ({
            ...defaultStyles,
            backgroundColor: "#232B2B",
            borderRadius: "0",
        }),

        multiValueLabel: (defaultStyles) => ({
            ...defaultStyles,
            color: "#F5F5F5",
            fontFamily: "Victor Mono, monospace",
        }),

        multiValueRemove: (defaultStyles) => ({
            ...defaultStyles,
            color: "#F5F5F5",
            "&:hover": {
                backgroundColor: "#D07A25",
                color: "#232B2B",
            },
        }),

        menu: (defaultStyles) => ({
            ...defaultStyles,
            borderRadius: "0",
            border: "2px solid #232B2B",
            boxShadow: "-4px 4px 0px 0px #D07A25",
        }),

        singleValue: (defaultStyles) => ({ 
            ...defaultStyles, 
            color: "#232B2B",
            fontFamily: "Victor Mono, monospace",
        }),
    };

    return (
        <section className="flex flex-1 flex-col overflow-auto">
            <div className="flex flex-1 flex-col items-center gap-y-6 overflow-auto px-4 py-6 scrollbar-thin">
                {/* Header */}
                <div className="w-full max-w-4xl 3xl:max-w-5xl">
                    <h1 className="mb-2 text-2xl font-bold md:text-3xl">Select Tokens</h1>
                    <p className="text-sm text-primary-dark/70">Choose the tokens you want to send and add recipients below.</p>
                </div>

                {/* Token Selector */}
                <div className="relative flex w-full max-w-4xl flex-col 3xl:max-w-5xl">
                    <label className="mb-2 text-sm font-semibold">Tokens to Send</label>
                    <Select
                        className="w-full cursor-pointer"
                        styles={customStyles}
                        classNamePrefix="select-token"
                        closeMenuOnSelect={false}
                        isLoading={isLoading}
                        isClearable={true}
                        isMulti
                        key={`select-token-${availableTokens.length}`}
                        isSearchable={true}
                        name="Select Token"
                        options={availableTokens}
                        placeholder="Search and select tokens..."
                        onChange={(selectedOption) => {
                            setTokenOfChoice(selectedOption);
                        }}
                    />
                </div>

                {/* Next Button */}
                <div className="flex w-full max-w-4xl justify-end 3xl:max-w-5xl">
                    <button
                        onClick={() => router.push("/send/approveTokens")}
                        disabled={nextButton}
                        className={`border-2 border-primary-dark px-6 py-2 text-sm font-semibold transition-all duration-200 sm:px-10 sm:text-base ${
                            nextButton
                                ? "cursor-not-allowed bg-primary-dark/10 text-primary-dark/40"
                                : "bg-primary-dark text-primary-light shadow-home-shadow hover:shadow-none"
                        }`}
                    >
                        Continue →
                    </button>
                </div>

                {/* Selected Tokens Input Cards */}
                <div className="mb-8 flex w-full max-w-4xl flex-col gap-y-6 3xl:max-w-5xl">
                    {selectedToken.map((token, index) => {
                        return <InputAddress token={token} key={index} />;
                    })}
                </div>
            </div>
        </section>
    );
};

export default Page;
