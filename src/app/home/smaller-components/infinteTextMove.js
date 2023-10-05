import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";

const InfiniteTextMove = ({ word, direction }) => {
    let controls = useAnimation();
    let xPercent = 0;

    useEffect(() => {
        requestAnimationFrame(animation);
    }, []);

    const animation = () => {
        if (xPercent <= -100) {
            xPercent = 0;
        }
        if (xPercent > 0) {
            xPercent = -100;
        }
        controls.set({
            x: xPercent + "%",
        });
        xPercent += 0.05 * direction;
        requestAnimationFrame(animation);
    };

    return (
        <div className="relative whitespace-nowrap flex m-0">
            <motion.p animate={controls} >{word}</motion.p>
            <motion.p animate={controls} className="absolute left-full">
                {word}
            </motion.p>
        </div>
    );
};

export default InfiniteTextMove;
