"use client";
import Image from "next/image";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";

const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = React.useState(false);
  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      // save theme to local storage
      localStorage.setItem("theme", true);
    } else {
      document.documentElement.classList.remove("dark");
      // save theme to local storage
      localStorage.setItem("theme", false);
    }
  }, [darkMode]);
  React.useEffect(() => {
    const storageDarkMode = localStorage?.theme;
    setDarkMode(storageDarkMode);
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", true);
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", false);
    }
  }, []);

  return (
    <div
      onClick={() => setDarkMode((prevDarkMode) => !prevDarkMode)}
      className="fixed right-5 top-5 z-[100] flex h-6 w-6 cursor-pointer items-center justify-center md:right-10 md:top-10 md:h-10 md:w-10"
    >
      {!darkMode ? (
        <>
          <Image
            src={`/moon.svg`}
            width={50}
            height={50}
            alt="moon"
            className="flex h-full w-full dark:hidden"
          />
          <Image
            src={`/sun.svg`}
            width={50}
            height={50}
            alt="sun"
            className="hidden h-full w-full dark:flex"
          />
        </>
      ) : (
        <>
          <Image
            src={`/moon.svg`}
            width={50}
            height={50}
            alt="moon"
            className="flex h-full w-full dark:hidden"
          />
          <Image
            src={`/sun.svg`}
            width={50}
            height={50}
            alt="sun"
            className="hidden h-full w-full dark:flex"
          />
        </>
      )}
    </div>
  );
};

export default DarkModeToggle;
