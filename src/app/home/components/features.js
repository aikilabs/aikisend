import React from 'react'
import { motion, useScroll, useTransform } from "framer-motion";

const Features = () => {const { scrollYProgress } = useScroll();
const [screenHeight, setScreenHeight] = React.useState(0);
React.useEffect(() => {
    const screenHeight = window?.innerHeight;
    setScreenHeight(screenHeight);
}, []);
const y1 = useTransform(scrollYProgress, [0, 1], [0, -screenHeight / 8]);
const y2 = useTransform(scrollYProgress, [0, 1], [0, -screenHeight / 2]);
  return (
      <div className=" w-full">
          <div className="h-[100dvh] w-full"></div>
          <div className="h-[100dvh] w-full"></div>
      </div>
  );
}

export default Features