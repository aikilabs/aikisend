import React from "react";
import { usePathname } from "next/navigation";

const BottomSig = () => {
    const pathname = usePathname();

    return (
        <div className="p-8 pt-2 flex items-center justify-center gap-x-4">
            <div
                className={`w-4 h-4 shadow-md bg-gray-200 border rounded-full ${
                    pathname.includes("selectTokens") ? "border-2 border-black shadow-neo-brutalism-xs" : "bg-white"
                }`}
            ></div>
            <div className={`w-24 h-0.5 bg-gray-300`}></div>
            <div
                className={`w-4 h-4 shadow-md bg-gray-200 border rounded-full ${
                    pathname.includes("approveTokens") ? "border-2 border-black shadow-neo-brutalism-xs" : "bg-white"
                }`}
            ></div>
            <div className={`w-24 h-0.5 bg-gray-300`}></div>
            <div
                className={`w-4 h-4 shadow-md bg-gray-200 border rounded-full ${
                    pathname.includes("transferTokens")
                        ? "border-2 border-black shadow-neo-brutalism-xs"
                        : "bg-white"
                }`}
            ></div>
        </div>
    );
};

export default BottomSig;
