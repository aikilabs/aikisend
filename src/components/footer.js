import Image from "next/image";

const Footer = () => (
    <footer className="flex items-center text-xs sm:text-sm md:text-base justify-center gap-6 md:justify-between px-4 py-4 sm:px-8 border-t border-gray-300">
        <Image
            src={"/logoHalfBlack.svg"}
            className="w-6 sm:w-8 "
            width={36.7}
            height={32.7}
        />
        <div className="flex flex-col md:flex-row items-center sm:gap-4 justify-between ">
            <p>Donate to this project🙂</p>
            <p>
                <a
                    className="cursor-pointer"
                    href="https://etherscan.io/address/0x2e2316088c015F4BF27D86A1458A707af536A324"
                >
                    <u>0x2e2316088c015F4BF27D86A1458A707af536A324</u>
                </a>
            </p>
        </div>
    </footer>
);

export default Footer;