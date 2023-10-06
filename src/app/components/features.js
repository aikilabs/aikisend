import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

const Features = () => {
  const { scrollYProgress, scrollY } = useScroll();

  const x = useTransform(scrollYProgress, [0, 1], ["50%", "-130%"]);
  return (
    <section className="z-10 h-[310dvh] w-full sm:h-[315dvh] lg:h-[340dvh] ">
      <div className="flex h-[10vh] items-center overflow-hidden bg-primary-light dark:bg-primary-dark sm:h-[15vh] md:h-[30vh]">
        {" "}
        <motion.h1
          style={{ x }}
          className="text-center text-5xl font-bold sm:text-7xl  md:text-8xl  lg:text-9xl xl:text-[10rem] 3xl:text-[12rem]"
        >
          HOW WE HELP
        </motion.h1>
      </div>
      <div className="sticky top-0 z-0 flex h-[100dvh] w-full items-center justify-center border-y-2 border-primary-dark bg-primary-light py-10  text-primary-dark dark:border-primary-light dark:bg-primary-dark dark:text-primary-light">
        <div className="flex h-full w-full flex-col items-center justify-center border-y-2 border-primary-dark py-10 text-xs dark:border-primary-light md:flex-row md:py-0 md:text-base">
          <div className="flex h-full w-full flex-1 flex-col justify-center gap-4 border-primary-dark px-5 dark:border-primary-light md:gap-11 md:border-r-2 3xl:px-20">
            <h1 className="max-w-[25rem] text-4xl font-bold md:text-6xl  lg:text-7xl xl:text-8xl 3xl:max-w-none 3xl:text-[6vw]">
              Batched Multi-Tokens Transfers
            </h1>
            <p className="max-w-[36rem]">
              Unlike other multisender application that only allows transfer of
              one token to multiple addresses, with AikiSend you can transfer
              multiple tokens say (Dai, Uni, USDC) to multiple addresses all in
              one transaction.
            </p>
          </div>
          <div className="flex flex-1 items-center justify-center px-5 3xl:px-20">
            <Image
              src={"/feat.png"}
              width={640}
              height={340}
              className=" border border-primary-dark dark:border-primary-light md:shadow-home-shadow-lg"
            />
          </div>
        </div>
      </div>
      <div className="sticky  top-0 z-0 flex h-[100dvh] w-full items-center justify-center border-y-2 border-primary-dark bg-primary-light py-10  text-primary-dark dark:border-primary-light dark:bg-primary-dark dark:text-primary-light">
        <div className="flex h-full w-full flex-col items-center justify-center border-y-2 border-primary-dark py-10 text-xs dark:border-primary-light md:flex-row-reverse md:py-0 md:text-base  ">
          <div className="flex h-full w-full flex-1 flex-col items-end justify-center gap-4 border-primary-dark px-5 text-right dark:border-primary-light md:gap-11  md:border-l-2 3xl:px-20">
            <h1 className="max-w-[25rem] text-4xl font-bold md:text-6xl  lg:text-7xl xl:text-8xl 3xl:max-w-none 3xl:text-[6vw]">
              ENS Domains Support{" "}
            </h1>
            <p className="max-w-[20rem]">
              Aikisend has integrated ENS to allow for token transfers to valid
              ENS names, improving the User Experience
            </p>
          </div>
          <div className="flex flex-1 items-center justify-center px-5 3xl:px-20">
            <Image
              src={"/featTwo.png"}
              width={640}
              height={340}
              className=" border border-primary-dark dark:border-primary-light md:shadow-home-shadow-lg-reverse"
            />
          </div>
        </div>
      </div>{" "}
      <div className="sticky  top-0 z-0 flex h-[100dvh] w-full items-center justify-center border-y-2 border-primary-dark bg-primary-light py-10  text-primary-dark dark:border-primary-light dark:bg-primary-dark dark:text-primary-light">
        <div className="flex h-full w-full flex-col items-center justify-center border-y-2 border-primary-dark py-10 text-xs dark:border-primary-light md:flex-row md:py-0 md:text-base">
          <div className="flex h-full w-full flex-1 basis-[50%] flex-col justify-center gap-4 border-primary-dark px-5 dark:border-primary-light md:gap-11 md:border-r-2 3xl:px-20">
            <h1 className="max-w-[20rem] text-4xl font-bold md:text-6xl  lg:text-7xl xl:text-8xl 3xl:max-w-none 3xl:text-[6vw]">
              Multi-Chain Support{" "}
            </h1>
            <p className="max-w-[20rem]">
              AikiSend works out of the box on many EVM chains with Permit2
              deployment.
            </p>
          </div>
          <div className="flex flex-1 basis-[50%] items-center  justify-center px-10 3xl:px-20">
            <Image
              src={"/multiChainFeature.svg"}
              width={640}
              height={340}
              className=" w-full border-primary-dark p-12 dark:border-primary-light md:w-3/4 md:border md:bg-white md:p-4 md:shadow-home-shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
