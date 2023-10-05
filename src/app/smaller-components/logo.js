import React from "react";
import TextMouseFollow from "./textMouseFollow";

const Logo = () => {
    return (
        <>
            {" "}
            <div className="absolute md:hidden top-1/2 overflow-hidden left-1/2  w-[30rem] h-[32rem] flex">
                <div className="logoMask bg-accent absolute inset-0 z-10 h-full w-full bg-opacity-50"></div>
                <div className="logoMask dark:bg-primary-light bg-primary-dark absolute inset-0 top-[3.75rem] h-full w-full bg-opacity-50"></div>
            </div>{" "}
            <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 left-1/2  w-[30rem] h-[32rem] hidden md:flex">
                <TextMouseFollow
                    flow={3}
                    className={`absolute inset-0 z-10 h-full w-full flex`}
                >
                    <div className="logoMask bg-accent h-full w-full"></div>
                </TextMouseFollow>
                {/* <TextMouseFollow>
                    {" "}
                    <div className="logoMask dark:bg-primary-light bg-primary-dark absolute inset-0 top-[3.75rem] h-full w-full"></div>
                </TextMouseFollow> */}
                <TextMouseFollow
                    flow={6}
                    opposite={true}
                    className={`absolute inset-0 h-full w-full flex top-12`}
                >
                    <div className="logoMask dark:bg-primary-light bg-primary-dark h-full w-full"></div>
                </TextMouseFollow>
            </div>
        </>
    );
};

export default Logo;
