import React from "react";
import { MdOutlineContentCopy } from "react-icons/md";
import InfiniteTextMove from "../smaller-components/infinteTextMove";
import Link from "next/link";

const Footer = () => {
  return (
    <section className="sticky bottom-0 z-0 flex h-[75dvh] w-full flex-col overflow-hidden bg-accent">
      <div className="absolute inset-0 m-0 flex items-center text-[40rem] leading-tight text-black">
        <InfiniteTextMove direction={1} word={`AIKISEND·`} />
      </div>
      <div className="z-10 flex flex-1 flex-col items-center justify-center gap-10 text-white">
        <h1 className="text-2xl px-5 break-all text-center font-bold sm:text-3xl md:text-5xl lg:text-6xl 3xl:text-8xl">
          0x2e2316088c015F4BF27D86A1458A707af536A324
        </h1>
        <MdOutlineContentCopy
          onClick={() =>
            navigator?.clipboard.writeText(
              "0x2e2316088c015F4BF27D86A1458A707af536A324",
            )
          }
          className="h-10 w-10 cursor-pointer transition-all duration-200 active:scale-75"
        />
        <p className="px-5 text-center text-xs md:text-base lg:text-lg md:px-20">
          AikiSend is free and open to public use, however we appreciate
          donations from the broader community to continually improve the
          application and keep it live.
        </p>
      </div>
      <nav className="z-10 justify-end border-t border-t-white p-2 text-right font-bold text-white md:p-4">
        <Link href={`https://github.com/aikilabs`}>
          <h3>
            Products of{" "}
            <span className=" font-normal italic underline">AikiLabs</span>
          </h3>
        </Link>
      </nav>
    </section>
  );
};

export default Footer;
