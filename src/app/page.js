"use client";
import { Router } from "next/router";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

const page = () => {
    const router = useRouter();
    useEffect(() => {
        router.push("/send/selectTokens");
    }, []);
    return <div>page</div>;
};

export default page;
