import React from "react";

const Process = () => {
  const [isHovering, setIsHovering] = React.useState(false);
  const steps = [
    "In the Dapp, connect web3 wallet.",
    "The list of tokens to be sent in the connected wallet can be selected using the search box.",
    "Approve Permit2 contract to spend tokens. ",
    "Sign the Signature data for the transfer.",
    "Proceed to make the transfer, all in one transaction 🎉.",
  ];
  return (
    <section className="z-20 h-[100dvh] w-full bg-primary-light text-primary-dark dark:bg-primary-dark dark:text-primary-light">
      <h1 className="flex h-[30vh] items-center justify-center  text-center  text-4xl font-bold sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] 3xl:text-[12rem]">
        HOW IT WORKS
      </h1>
      <div
        className={`group border- font-bold border-t-primary-dark dark:border-t-primary-light`}
      >
        {steps.map((step, index) => {
          return (
            <div
              onMouseOver={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              className={`flex items-center justify-between border-b border-b-primary-dark px-5 sm:px-10 py-4 transition-all duration-200  dark:border-b-primary-light cursor-pointer ${
                isHovering ? "md:opacity-10 md:hover:opacity-100" : ""
              }`}
            >
              <h2 className="flex-1 text-lg sm:text-3xl md:text-4xl lg:text-5xl 3xl:text-8xl">
                #00{index + 1}
              </h2>
              <p className="flex-1 text-xs sm:text-base">{step}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Process;
