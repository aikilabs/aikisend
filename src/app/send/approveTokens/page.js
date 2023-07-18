"use client";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import BottomSig from "@/utils/bottomSig";

const Page = () => {
    const address = useSelector((state) => state.aikiSend.address);
    return (
        <section className="flex flex-col flex-1 h-full ">
            <div className="flex-1 h-full "></div>
            <BottomSig />
        </section>
    );
};

export default Page;
