// "use client";
// import React, { useEffect, useState } from "react";
// import { ConnectButton } from "@rainbow-me/rainbowkit";
// import { useAccount, useContractRead, useContractEvent } from "wagmi";
// import { useWeb3Modal } from "@web3modal/react";

// const Page = () => {
//     const [connected, setConnected] = useState(false);
//     const { isConnected, address } = useAccount();

//     useEffect(() => {
//         setConnected(isConnected);
//         console.log(address);
//     }, [isConnected]);

//     const { open, close } = useWeb3Modal();

//     return (
//         <main>
//             <nav className="px-24 py-12 flex justify-between items-center">
//                 <h1 className="font-extrabold text-3xl">AIKISEND</h1>
//                 <button
//                     onClick={() => open()}
//                     className={`transition-all text-lg hover:scale-110 duration-200 shadow-neo-brutalism-sm border-[3px] border-black px-3 py-1 rounded-xl  ${
//                         connected
//                             ? "text-black font-extrabold font-sans tracking-[0.3em]"
//                             : "bg-blue-500 text-white  font-semibold tracking-[0.1em] "
//                     }`}
//                 >
//                     {connected
//                         ? address &&
//                           address
//                               .substring(0, 4)
//                               .concat(`...${address.slice(-4)}`)
//                         : "Connect Wallet"}
//                 </button>
//             </nav>
//         </main>
//     );
// };

// export default Page;
