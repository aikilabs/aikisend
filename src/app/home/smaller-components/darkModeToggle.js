"use client";
import Image from "next/image";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";

const DarkModeToggle = () => {
    const [darkMode, setDarkMode] = React.useState(false);
    React.useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [darkMode]);
    React.useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, []);

    return (
            <div
                onClick={() => setDarkMode((prevDarkMode) => !prevDarkMode)}
                className="fixed z-[100] top-10 right-10 w-10 h-10 flex items-center justify-center cursor-pointer"
            >
                {!darkMode ? (
                    <>
                        <Image
                            src={`/moon.svg`}
                            width={50}
                            height={50}
                            alt="moon"
                            className="dark:hidden w-full h-full flex"
                        />
                        <Image
                            src={`/sun.svg`}
                            width={50}
                            height={50}
                            alt="sun"
                            className="dark:flex hidden w-full h-full"
                        />
                    </>
                ) : (
                    <>
                        <Image
                            src={`/moon.svg`}
                            width={50}
                            height={50}
                            alt="moon"
                            className="dark:hidden w-full h-full flex"
                        />
                        <Image
                            src={`/sun.svg`}
                            width={50}
                            height={50}
                            alt="sun"
                            className="dark:flex hidden w-full h-full"
                        />
                    </>
                )}
            </div>
    );
};

export default DarkModeToggle;
