"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import {
    setAllAvailableTokens,
    setApprovedToken,
    setSelectedToken,
} from "@/redux/aikiSend";

const Success = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setSelectedToken([]));
        dispatch(setApprovedToken([]));
        // dispatch(setAllAvailableTokens([]));
    }, []);
    return (
        <>
            <div className=" h-screen">
                <div className="p-6  md:mx-auto">
                    <svg
                        className="h-16 w-16 text-red-600 mx-auto my-6 cursor-pointer"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <div className="text-center">
                        <h3 className="md:text-2xl text-base text-gray-900 font-semibold text-center">
                            Transaction Failed!
                        </h3>
                        <p className="text-gray-600 my-2">
                            Your transaction was not successful.
                        </p>
                        <p> Damn! </p>
                        <div className="py-10 text-center">
                            <button
                                onClick={() =>
                                    router.push("/send/selectTokens")
                                }
                                className="px-12 border-2 border-black rounded font-semibold py-3"
                            >
                                Restart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Success;
