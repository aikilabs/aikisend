"use client";
import React from "react";
import Logo from "../smaller-components/logo";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRouter } from "next/navigation";

const Hero = () => {
  const router = useRouter();
  const { scrollYProgress, scrollY } = useScroll();
  const [screenHeight, setScreenHeight] = React.useState(0);

  React.useEffect(() => {
    const screenHeight = window?.innerHeight;
    setScreenHeight(screenHeight);
  }, []);

  // Calculate initial values for y1 and y2 based on the scroll position
  const initialY1 = screenHeight / 4;
  const initialY2 = screenHeight / 2;

  // Use useTransform with initial values
  const y1 = useTransform(scrollY, [0, screenHeight], [0, initialY1]);
  const y2 = useTransform(scrollY, [0, screenHeight], [0, initialY2]);

  return (
    <section
      className="relative z-10 flex h-[100dvh] w-full flex-col overflow-hidden bg-primary-light px-10 py-10 dark:bg-primary-dark
xl:flex-row "
    >
      <motion.article
        style={{ translateY: y1 }}
        className="z-10 flex h-full flex-col items-center justify-center text-center md:items-start md:justify-start md:text-left"
      >
        <h1 className="text-[4rem] font-bold sm:text-[6rem] xl:text-[8rem]">
          AIKISEND
        </h1>
        <p className="mb-5 max-w-[380px] text-sm md:mb-10 md:text-base">
          Send multiple tokens to multiple addresses in one transaction
        </p>
        <div>
          <button
            onClick={() => router.push("/send/selectTokens")}
            className="border border-primary-light bg-primary-dark p-4 py-1.5 text-primary-light transition-all duration-500 hover:shadow-none dark:border-primary-dark dark:bg-primary-light dark:text-primary-dark md:px-6 md:py-3 md:text-2xl md:shadow-home-shadow z-20"
          >
            Launch Dapp
          </button>
        </div>
      </motion.article>
      <Logo />

      <motion.div
        style={{ translateY: y2 }}
        className="z-10 hidden h-full w-full flex-col justify-end gap-5 pl-10 md:flex xl:gap-10 xl:pl-0"
      >
        <article className="  flex w-full justify-end ">
          <p className="max-w-[25rem] md:max-w-[35rem] rounded-lg md:text-xs  border border-primary-light bg-primary-dark p-4 text-[0.6rem] text-primary-light dark:border-primary-dark dark:bg-primary-light dark:text-primary-dark xl:py-2 xl:max-w-[45rem] xl:text-base">
            In the ever-evolving landscape of blockchain and cryptocurrency,
            efficiency, convenience, and innovation are paramount.
          </p>
        </article>
        <article className="flex w-full justify-end  ">
          <p className="max-w-[15rem] md:max-w-[25rem] rounded-lg md:text-xs  border border-primary-light bg-primary-dark p-4 text-[0.6rem] text-primary-light dark:border-primary-dark dark:bg-primary-light dark:text-primary-dark xl:py-2 xl:max-w-[35rem] xl:text-base">
            Aikisend is a groundbreaking solution that re-imagines the way
            digital assets are transferred.
          </p>
        </article>
        <article className="  flex w-full justify-end">
          <p className="max-w-[30rem] md:max-w-[40rem] rounded-lg md:text-xs  border border-primary-light bg-primary-dark p-4 text-[0.6rem] text-primary-light dark:border-primary-dark dark:bg-primary-light dark:text-primary-dark xl:py-2 xl:max-w-[50rem] xl:text-base">
            It provides an unprecedented level of flexibility and simplicity to
            users seeking to send multiple tokens to multiple addresses in a
            single transaction.
          </p>
        </article>
      </motion.div>
    </section>
  );
};

export default Hero;
