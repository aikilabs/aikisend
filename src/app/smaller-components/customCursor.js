"use client";
import React, { useRef } from "react";
import { motion } from "framer-motion";
// import {FiArrowUpRight} from ""

const CustomCursorInDiv = ({ children, mouseText = "" }) => {
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = React.useState(0);
  const ref = useRef();

  const mouseMove = (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    setPosition({ x, y });
    setOpacity(1);
  };
  const mouseLeave = (e) => {
    // setPosition({ x: 0, y: 0 });
    setOpacity(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={mouseMove}
      onMouseLeave={mouseLeave}
      className="relative flex flex-col items-center justify-center bg-primary-light font-space-mono text-primary-dark transition-colors duration-500 scrollbar-none dark:bg-primary-dark dark:text-primary-light"
    >
      {/* <motion.div
                onClick
                className=" absolute pointer-events-none z-50 flex h-2 w-2 items-center justify-center rounded-full bg-accent mix-blend-difference text-white"
                animate={{ x: position.x, y: position.y, opacity }}
                transition={{ type: "tween", ease: "backOut" }}
            ></motion.div>
            <motion.div
                className=" absolute pointer-events-none z-50 flex h-8 w-8 items-center justify-center rounded-full border-accent border mix-blend-difference text-white"
                animate={{ x: position.x, y: position.y, opacity }}
                transition={{ type: "tween", ease: "backOut", duration: 0.5 }}
            ></motion.div> */}
      {children}
    </motion.div>
  );
};

export default CustomCursorInDiv;
