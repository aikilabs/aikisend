import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";

const InfiniteTextMove = ({ word, direction }) => {
  const controls = useAnimation();
  let xPercent = 0;

  useEffect(() => {
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

    requestAnimationFrame(animation);

    // Cleanup function to cancel animation when component unmounts
    return () => cancelAnimationFrame(animation);
  }, [controls, direction]);

  return (
    <div className="relative m-0 flex whitespace-nowrap">
      <motion.p animate={controls}>{word}</motion.p>
      <motion.p animate={controls} className="absolute left-full">
        {word}
      </motion.p>
    </div>
  );
};

export default InfiniteTextMove;
