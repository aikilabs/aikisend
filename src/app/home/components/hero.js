"use client";
import React from "react";
import Logo from "../smaller-components/logo";
import { motion, useScroll, useTransform } from "framer-motion";

const Hero = () => {
    const { scrollYProgress, scrollY } = useScroll();
    const [screenHeight, setScreenHeight] = React.useState(0);

    React.useEffect(() => {
        const screenHeight = window?.innerHeight;
        setScreenHeight(screenHeight);
    }, []);

    // Calculate initial values for y1 and y2 based on the scroll position
    const initialY1 = -screenHeight /6;
    const initialY2 = -screenHeight /4;

    // Use useTransform with initial values
    const y1 = useTransform(scrollY, [0, screenHeight], [0, initialY1]);
    const y2 = useTransform(scrollY, [0, screenHeight], [0, initialY2]);

    return (
        <section className="h-[100dvh] w-full overflow-hidden py-10 px-10 flex relative flex-col xl:flex-row">
            <motion.article
                style={{ translateY: y1 }}
                className="flex flex-col z-10 h-full items-center md:justify-start md:items-start justify-center text-center md:text-left"
            >
                <h1 className="font-bold text-[4rem] sm:text-[6rem] xl:text-[8rem]">
                    AIKISEND
                </h1>
                <p className="text-sm md:text-base max-w-[380px] mb-5 md:mb-10">
                    Send multiple tokens to multiple addresses in one
                    transaction
                </p>
                <div>
                    <button className="dark:text-primary-dark md:text-2xl text-primary-light bg-primary-dark dark:bg-primary-light p-4 md:px-6 py-1.5 md:py-3 md:shadow-home-shadow hover:shadow-none transition-all duration-500 dark:border-primary-dark border-primary-light border">
                        Launch Dapp
                    </button>
                </div>
            </motion.article>
            <Logo />

            <motion.div
                style={{ translateY: y2 }}
                className="w-full h-full md:flex flex-col justify-end hidden z-10 gap-5 xl:gap-10 pl-10 xl:pl-0"
            >
                <article className="  w-full flex justify-end ">
                    <p className="text-[0.6rem] xl:text-xs max-w-[25rem] xl:max-w-[35rem] p-4 dark:border-primary-dark border-primary-light border rounded-lg dark:text-primary-dark bg-primary-dark text-primary-light dark:bg-primary-light">
                        In the ever-evolving landscape of blockchain and
                        cryptocurrency, efficiency, convenience, and innovation
                        are paramount.
                    </p>
                </article>
                <article className="w-full flex justify-end  ">
                    <p className="text-[0.6rem] xl:text-xs max-w-[15rem] xl:max-w-[25rem] p-4 dark:border-primary-dark border-primary-light border rounded-lg dark:text-primary-dark bg-primary-dark text-primary-light dark:bg-primary-light">
                        Aikisend is a groundbreaking solution that re-imagines
                        the way digital assets are transferred.
                    </p>
                </article>
                <article className="  w-full flex justify-end">
                    <p className="text-[0.6rem] xl:text-xs max-w-[30rem] xl:max-w-[40rem] p-4 dark:border-primary-dark border-primary-light border rounded-lg dark:text-primary-dark bg-primary-dark text-primary-light dark:bg-primary-light">
                        It provides an unprecedented level of flexibility and
                        simplicity to users seeking to send multiple tokens to
                        multiple addresses in a single transaction.
                    </p>
                </article>
            </motion.div>
        </section>
    );
};

export default Hero;
