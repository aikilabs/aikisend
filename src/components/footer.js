"use client";
import Image from "next/image";
import { MdOutlineContentCopy } from "react-icons/md";
import { useState } from "react";

const Footer = () => {
    const [copied, setCopied] = useState(false);
    
    const handleCopy = () => {
        navigator?.clipboard.writeText("0x2e2316088c015F4BF27D86A1458A707af536A324");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <footer className="flex items-center border-t-2 border-primary-dark bg-primary-light px-4 py-4 text-xs text-primary-dark sm:px-8 sm:text-sm md:text-base">
            <div className="flex w-full flex-col items-center justify-between gap-4 md:flex-row">
                <Image
                    src={"/logoHalfBlack.svg"}
                    className="w-6 sm:w-8"
                    width={36.7}
                    height={32.7}
                    alt="AikiSend"
                />
                <div className="flex flex-col items-center gap-2 text-center md:flex-row md:gap-4">
                    <p className="font-semibold">Support this project 🙂</p>
                    <div className="flex items-center gap-2">
                        <a
                            className="border-b-2 border-accent font-mono text-xs transition-colors hover:text-accent sm:text-sm"
                            href="https://etherscan.io/address/0x2e2316088c015F4BF27D86A1458A707af536A324"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            0x2e23...A324
                        </a>
                        <button
                            onClick={handleCopy}
                            className="border-2 border-primary-dark p-1 transition-all hover:bg-primary-dark hover:text-primary-light"
                            title="Copy address"
                        >
                            <MdOutlineContentCopy className={`h-4 w-4 ${copied ? "text-accent" : ""}`} />
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;