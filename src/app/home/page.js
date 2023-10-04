import Image from "next/image";
import Hero from "./components/hero";
import CustomCursorInDiv from "./smaller-components/customCursor";
import DarkModeToggle from "./smaller-components/darkModeToggle";

export default function Home() {
    return (
        <CustomCursorInDiv>
            {/* <main
                className={`dark:bg-primary-dark bg-primary-light flex font-space-mono text-primary-dark dark:text-primary-light`}
            > */}
                <Hero />
                <DarkModeToggle />
            {/* </main> */}
        </CustomCursorInDiv>
    );
}
