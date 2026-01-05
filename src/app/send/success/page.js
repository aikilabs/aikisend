"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setApprovedToken, setSelectedToken } from "@/redux/aikiSend";
import { motion } from "framer-motion";

const Success = () => {
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
                className="w-full max-w-md border-2 border-primary-dark bg-primary-light p-8 text-center shadow-home-shadow-lg"
            >
                {/* Success Icon */}
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center border-2 border-accent bg-accent">
                    <svg
                        className="h-10 w-10 text-primary-dark"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                </div>

                {/* Title */}
                <h1 className="mb-2 text-2xl font-bold text-primary-dark md:text-3xl">
                    Transaction Complete!
                </h1>

                {/* Message */}
                <p className="mb-8 text-primary-dark/70">
                    Your tokens have been successfully sent to all recipients.
                </p>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => router.push("/send/selectTokens")}
                        className="w-full border-2 border-primary-dark bg-primary-dark px-6 py-3 font-semibold text-primary-light transition-all hover:bg-primary-light hover:text-primary-dark"
                    >
                        Send More Tokens
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

export default Success;
