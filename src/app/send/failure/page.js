"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setApprovedToken, setSelectedToken } from "@/redux/aikiSend";
import { motion } from "framer-motion";

const Failure = () => {
    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setSelectedToken([]));
        dispatch(setApprovedToken([]));
    }, []);

    return (
        <section className="flex flex-1 items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md border-2 border-primary-dark bg-primary-light p-8 text-center"
                style={{ boxShadow: "-12px 12px 0px 0px #dc2626" }}
            >
                {/* Failure Icon */}
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center border-2 border-red-600 bg-red-600">
                    <svg
                        className="h-10 w-10 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </div>

                {/* Title */}
                <h1 className="mb-2 text-2xl font-bold text-primary-dark md:text-3xl">
                    Transaction Failed
                </h1>

                {/* Message */}
                <p className="mb-8 text-primary-dark/70">
                    Something went wrong with your transaction. Please try again.
                </p>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => router.push("/send/selectTokens")}
                        className="w-full border-2 border-primary-dark bg-primary-dark px-6 py-3 font-semibold text-primary-light transition-all hover:bg-primary-light hover:text-primary-dark"
                    >
                        Try Again
                    </button>
                    <button
                        onClick={() => router.push("/")}
                        className="w-full border-2 border-primary-dark bg-transparent px-6 py-3 font-semibold text-primary-dark transition-all hover:bg-primary-dark hover:text-primary-light"
                    >
                        Back to Home
                    </button>
                </div>
            </motion.div>
        </section>
    );
};

export default Failure;
